package openshift

import (
	"context"
	"encoding/json"
	"fmt"

	configv1 "github.com/openshift/api/config/v1"
	machinev1beta1 "github.com/openshift/api/machine/v1beta1"
	machineclient "github.com/openshift/client-go/machine/clientset/versioned"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

const (
	// MachineAPINamespace is the namespace used by the Machine API components.
	MachineAPINamespace = "openshift-machine-api"
)

// cpmsGVR is the GroupVersionResource for ControlPlaneMachineSet.
var cpmsGVR = schema.GroupVersionResource{
	Group:    "machine.openshift.io",
	Version:  "v1",
	Resource: "controlplanemachinesets",
}

// MachineManager manages Machine API resources including MachineSets and
// ControlPlaneMachineSets.
type MachineManager struct {
	kubeClient    kubernetes.Interface
	machineClient machineclient.Interface
	dynamicClient dynamic.Interface
}

// NewMachineManager creates a new MachineManager with the given clients.
func NewMachineManager(kubeClient kubernetes.Interface, machineClient machineclient.Interface, dynamicClient dynamic.Interface) *MachineManager {
	return &MachineManager{
		kubeClient:    kubeClient,
		machineClient: machineClient,
		dynamicClient: dynamicClient,
	}
}

// CreateWorkerMachineSet creates a new worker MachineSet from the given template,
// configured for the specified failure domain. The new MachineSet is created in the
// openshift-machine-api namespace.
func (m *MachineManager) CreateWorkerMachineSet(ctx context.Context, name string, replicas int32, failureDomain *configv1.VSpherePlatformFailureDomainSpec, template *machinev1beta1.MachineSet, infraID string) (*machinev1beta1.MachineSet, error) {
	if template == nil {
		return nil, fmt.Errorf("template MachineSet must not be nil")
	}
	if failureDomain == nil {
		return nil, fmt.Errorf("failureDomain must not be nil")
	}
	log := klog.FromContext(ctx)
	log.V(2).Info("creating worker machineset", "name", name, "replicas", replicas)

	newMS := template.DeepCopy()
	newMS.Name = name
	newMS.Namespace = MachineAPINamespace
	newMS.ResourceVersion = ""
	newMS.UID = ""
	newMS.CreationTimestamp = metav1.Time{}
	newMS.Status = machinev1beta1.MachineSetStatus{}
	newMS.Spec.Replicas = &replicas

	// Update labels and selectors. Use the MachineSet name as the cluster-api-machineset
	// label value so listing Machines by this label (in CheckMachinesReady, etc.) finds them.
	if newMS.Spec.Selector.MatchLabels == nil {
		newMS.Spec.Selector.MatchLabels = make(map[string]string)
	}
	newMS.Spec.Selector.MatchLabels["machine.openshift.io/cluster-api-machineset"] = name
	if newMS.Spec.Template.Labels == nil {
		newMS.Spec.Template.Labels = make(map[string]string)
	}
	newMS.Spec.Template.Labels["machine.openshift.io/cluster-api-machineset"] = name
	newMS.Spec.Template.Labels["machine.openshift.io/cluster-api-cluster"] = infraID

	// Update the provider spec with the failure domain topology.
	if err := updateMachineSetProviderSpec(newMS, failureDomain); err != nil {
		return nil, fmt.Errorf("updating provider spec for machineset %q: %w", name, err)
	}

	created, err := m.machineClient.MachineV1beta1().MachineSets(MachineAPINamespace).Create(ctx, newMS, metav1.CreateOptions{})
	if err != nil {
		return nil, fmt.Errorf("creating machineset %q: %w", name, err)
	}

	log.V(2).Info("created worker machineset", "name", name)
	return created, nil
}

// GetMachineSet retrieves a MachineSet by name from the openshift-machine-api namespace.
func (m *MachineManager) GetMachineSet(ctx context.Context, name string) (*machinev1beta1.MachineSet, error) {
	ms, err := m.machineClient.MachineV1beta1().MachineSets(MachineAPINamespace).Get(ctx, name, metav1.GetOptions{})
	if err != nil {
		return nil, fmt.Errorf("getting machineset %q: %w", name, err)
	}
	return ms, nil
}

// GetMachineSetsByVCenter returns all MachineSets whose provider spec references
// the given vCenter server. If vcenterServer is empty, all MachineSets are returned.
func (m *MachineManager) GetMachineSetsByVCenter(ctx context.Context, vcenterServer string) ([]*machinev1beta1.MachineSet, error) {
	log := klog.FromContext(ctx)
	log.V(2).Info("listing machinesets", "vcenterServer", vcenterServer)

	msList, err := m.machineClient.MachineV1beta1().MachineSets(MachineAPINamespace).List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, fmt.Errorf("listing machinesets: %w", err)
	}

	var result []*machinev1beta1.MachineSet
	for i := range msList.Items {
		ms := &msList.Items[i]

		if vcenterServer == "" {
			result = append(result, ms)
			continue
		}

		providerSpec, err := extractVSphereProviderSpec(ms)
		if err != nil {
			log.V(3).Info("skipping machineset, cannot extract provider spec", "name", ms.Name, "err", err)
			continue
		}

		if providerSpec.Workspace != nil && providerSpec.Workspace.Server == vcenterServer {
			result = append(result, ms)
		}
	}

	return result, nil
}

// ScaleMachineSet sets the replica count for the named MachineSet.
func (m *MachineManager) ScaleMachineSet(ctx context.Context, name string, replicas int32) error {
	log := klog.FromContext(ctx)
	log.V(2).Info("scaling machineset", "name", name, "replicas", replicas)

	ms, err := m.machineClient.MachineV1beta1().MachineSets(MachineAPINamespace).Get(ctx, name, metav1.GetOptions{})
	if err != nil {
		return fmt.Errorf("getting machineset %q for scaling: %w", name, err)
	}

	ms.Spec.Replicas = &replicas
	if _, err := m.machineClient.MachineV1beta1().MachineSets(MachineAPINamespace).Update(ctx, ms, metav1.UpdateOptions{}); err != nil {
		return fmt.Errorf("scaling machineset %q to %d: %w", name, replicas, err)
	}

	log.V(2).Info("scaled machineset", "name", name, "replicas", replicas)
	return nil
}

// GetControlPlaneMachineSet retrieves the ControlPlaneMachineSet using the dynamic client.
func (m *MachineManager) GetControlPlaneMachineSet(ctx context.Context) (*unstructured.Unstructured, error) {
	cpms, err := m.dynamicClient.Resource(cpmsGVR).Namespace(MachineAPINamespace).Get(ctx, "cluster", metav1.GetOptions{})
	if err != nil {
		return nil, fmt.Errorf("getting ControlPlaneMachineSet: %w", err)
	}
	return cpms, nil
}

// DeleteControlPlaneMachineSet deletes the ControlPlaneMachineSet.
func (m *MachineManager) DeleteControlPlaneMachineSet(ctx context.Context) error {
	log := klog.FromContext(ctx)
	log.V(2).Info("deleting ControlPlaneMachineSet")

	if err := m.dynamicClient.Resource(cpmsGVR).Namespace(MachineAPINamespace).Delete(ctx, "cluster", metav1.DeleteOptions{}); err != nil {
		return fmt.Errorf("deleting ControlPlaneMachineSet: %w", err)
	}

	log.V(2).Info("deleted ControlPlaneMachineSet")
	return nil
}

// UpdateCPMSFailureDomain updates the failure domain name in the ControlPlaneMachineSet
// template and sets its state to Active.
func (m *MachineManager) UpdateCPMSFailureDomain(ctx context.Context, failureDomainName string) error {
	log := klog.FromContext(ctx)
	log.V(2).Info("updating CPMS failure domain", "failureDomain", failureDomainName)

	cpms, err := m.GetControlPlaneMachineSet(ctx)
	if err != nil {
		return err
	}

	// Set the failure domain in the template.
	failureDomains := []map[string]interface{}{
		{
			"name": failureDomainName,
		},
	}
	if err := unstructured.SetNestedSlice(cpms.Object, toInterfaceSlice(failureDomains), "spec", "template", "machines_v1beta1_machine_openshift_io", "failureDomains", "vsphere"); err != nil {
		return fmt.Errorf("setting failure domain in CPMS: %w", err)
	}

	// Set state to Active.
	if err := unstructured.SetNestedField(cpms.Object, "Active", "spec", "state"); err != nil {
		return fmt.Errorf("setting CPMS state to Active: %w", err)
	}

	if _, err := m.dynamicClient.Resource(cpmsGVR).Namespace(MachineAPINamespace).Update(ctx, cpms, metav1.UpdateOptions{}); err != nil {
		return fmt.Errorf("updating ControlPlaneMachineSet: %w", err)
	}

	log.V(2).Info("updated CPMS failure domain", "failureDomain", failureDomainName)
	return nil
}

// CheckControlPlaneRolloutStatus checks the rollout status of the ControlPlaneMachineSet.
// It returns whether the rollout is complete and the replica counts.
func (m *MachineManager) CheckControlPlaneRolloutStatus(ctx context.Context) (complete bool, replicas, updatedReplicas, readyReplicas int32, err error) {
	log := klog.FromContext(ctx)

	cpms, err := m.GetControlPlaneMachineSet(ctx)
	if err != nil {
		return false, 0, 0, 0, err
	}

	statusReplicas, _, _ := unstructured.NestedInt64(cpms.Object, "status", "replicas")
	statusUpdated, _, _ := unstructured.NestedInt64(cpms.Object, "status", "updatedReplicas")
	statusReady, _, _ := unstructured.NestedInt64(cpms.Object, "status", "readyReplicas")

	replicas = int32(statusReplicas)
	updatedReplicas = int32(statusUpdated)
	readyReplicas = int32(statusReady)

	complete = replicas > 0 && updatedReplicas == replicas && readyReplicas == replicas
	log.V(2).Info("CPMS rollout status", "complete", complete, "replicas", replicas, "updatedReplicas", updatedReplicas, "readyReplicas", readyReplicas)

	return complete, replicas, updatedReplicas, readyReplicas, nil
}

// IsCPMSGenerationObserved checks whether the ControlPlaneMachineSet's observed
// generation matches its metadata generation, indicating the controller has processed
// the latest spec change.
func (m *MachineManager) IsCPMSGenerationObserved(ctx context.Context) (bool, error) {
	cpms, err := m.GetControlPlaneMachineSet(ctx)
	if err != nil {
		return false, err
	}

	generation := cpms.GetGeneration()
	observedGeneration, _, _ := unstructured.NestedInt64(cpms.Object, "status", "observedGeneration")

	return generation == observedGeneration, nil
}

// machinesetSelectorLabel returns the label value used to select machines for the
// given MachineSet (from its selector). This matches how Machines are labeled when
// created from the MachineSet, and supports both "name" and legacy "infraID-name" formats.
func (m *MachineManager) machinesetSelectorLabel(ctx context.Context, machineSetName string) (string, error) {
	ms, err := m.machineClient.MachineV1beta1().MachineSets(MachineAPINamespace).Get(ctx, machineSetName, metav1.GetOptions{})
	if err != nil {
		return "", fmt.Errorf("getting machineset %q: %w", machineSetName, err)
	}
	if v, ok := ms.Spec.Selector.MatchLabels["machine.openshift.io/cluster-api-machineset"]; ok && v != "" {
		return v, nil
	}
	return machineSetName, nil
}

// CheckMachinesReady checks whether all machines for the given MachineSet are in
// a Ready state (phase Running and has a NodeRef).
func (m *MachineManager) CheckMachinesReady(ctx context.Context, machineSetName string) (complete bool, ready, total int32, err error) {
	log := klog.FromContext(ctx)

	labelValue, err := m.machinesetSelectorLabel(ctx, machineSetName)
	if err != nil {
		return false, 0, 0, err
	}
	machines, err := m.machineClient.MachineV1beta1().Machines(MachineAPINamespace).List(ctx, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("machine.openshift.io/cluster-api-machineset=%s", labelValue),
	})
	if err != nil {
		return false, 0, 0, fmt.Errorf("listing machines for machineset %q: %w", machineSetName, err)
	}

	total = int32(len(machines.Items))
	for i := range machines.Items {
		machine := &machines.Items[i]
		if machine.Status.Phase != nil && *machine.Status.Phase == "Running" && machine.Status.NodeRef != nil {
			ready++
		}
	}

	complete = total > 0 && ready == total
	log.V(2).Info("machine readiness check", "machineSet", machineSetName, "ready", ready, "total", total, "complete", complete)

	return complete, ready, total, nil
}

// CheckNodesReady checks whether all nodes backing machines of the given MachineSet
// have the Ready condition set to True.
func (m *MachineManager) CheckNodesReady(ctx context.Context, machineSetName string) (complete bool, ready, total int32, err error) {
	log := klog.FromContext(ctx)

	labelValue, err := m.machinesetSelectorLabel(ctx, machineSetName)
	if err != nil {
		return false, 0, 0, err
	}
	machines, err := m.machineClient.MachineV1beta1().Machines(MachineAPINamespace).List(ctx, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("machine.openshift.io/cluster-api-machineset=%s", labelValue),
	})
	if err != nil {
		return false, 0, 0, fmt.Errorf("listing machines for machineset %q: %w", machineSetName, err)
	}

	total = int32(len(machines.Items))
	for i := range machines.Items {
		machine := &machines.Items[i]
		if machine.Status.NodeRef == nil {
			continue
		}

		node, err := m.kubeClient.CoreV1().Nodes().Get(ctx, machine.Status.NodeRef.Name, metav1.GetOptions{})
		if err != nil {
			log.V(3).Info("failed to get node for machine", "machine", machine.Name, "node", machine.Status.NodeRef.Name, "err", err)
			continue
		}

		for _, cond := range node.Status.Conditions {
			if cond.Type == corev1.NodeReady && cond.Status == corev1.ConditionTrue {
				ready++
				break
			}
		}
	}

	complete = total > 0 && ready == total
	log.V(2).Info("node readiness check", "machineSet", machineSetName, "ready", ready, "total", total, "complete", complete)

	return complete, ready, total, nil
}

// CheckMachinesDeleted checks whether all machines for the given MachineSet have
// been deleted.
func (m *MachineManager) CheckMachinesDeleted(ctx context.Context, machineSetName string) (allDeleted bool, remaining int32, err error) {
	log := klog.FromContext(ctx)

	labelValue, err := m.machinesetSelectorLabel(ctx, machineSetName)
	if err != nil {
		return false, 0, err
	}
	machines, err := m.machineClient.MachineV1beta1().Machines(MachineAPINamespace).List(ctx, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("machine.openshift.io/cluster-api-machineset=%s", labelValue),
	})
	if err != nil {
		return false, 0, fmt.Errorf("listing machines for machineset %q: %w", machineSetName, err)
	}

	remaining = int32(len(machines.Items))
	allDeleted = remaining == 0
	log.V(2).Info("machine deletion check", "machineSet", machineSetName, "remaining", remaining, "allDeleted", allDeleted)

	return allDeleted, remaining, nil
}

// CheckNodesDeletedForMachines checks whether all nodes corresponding to machines
// of the given MachineSet have been removed from the cluster.
func (m *MachineManager) CheckNodesDeletedForMachines(ctx context.Context, machineSetName string) (allDeleted bool, remaining int32, err error) {
	log := klog.FromContext(ctx)

	labelValue, err := m.machinesetSelectorLabel(ctx, machineSetName)
	if err != nil {
		return false, 0, err
	}
	machines, err := m.machineClient.MachineV1beta1().Machines(MachineAPINamespace).List(ctx, metav1.ListOptions{
		LabelSelector: fmt.Sprintf("machine.openshift.io/cluster-api-machineset=%s", labelValue),
	})
	if err != nil {
		return false, 0, fmt.Errorf("listing machines for machineset %q: %w", machineSetName, err)
	}

	for i := range machines.Items {
		machine := &machines.Items[i]
		if machine.Status.NodeRef == nil {
			continue
		}

		_, err := m.kubeClient.CoreV1().Nodes().Get(ctx, machine.Status.NodeRef.Name, metav1.GetOptions{})
		if err == nil {
			remaining++
		}
	}

	allDeleted = remaining == 0
	log.V(2).Info("node deletion check for machines", "machineSet", machineSetName, "remaining", remaining, "allDeleted", allDeleted)

	return allDeleted, remaining, nil
}

// updateMachineSetProviderSpec updates the VSphereMachineProviderSpec in the
// MachineSet template with the topology from the given failure domain.
func updateMachineSetProviderSpec(ms *machinev1beta1.MachineSet, fd *configv1.VSpherePlatformFailureDomainSpec) error {
	if ms == nil {
		return fmt.Errorf("machineset must not be nil")
	}
	if fd == nil {
		return fmt.Errorf("failure domain must not be nil")
	}
	if ms.Spec.Template.Spec.ProviderSpec.Value == nil {
		return fmt.Errorf("machineset %q has no provider spec", ms.Name)
	}
	if ms.Spec.Template.Spec.ProviderSpec.Value.Raw == nil {
		return fmt.Errorf("machineset %q provider spec has no raw value", ms.Name)
	}

	providerSpec := &machinev1beta1.VSphereMachineProviderSpec{}
	if err := json.Unmarshal(ms.Spec.Template.Spec.ProviderSpec.Value.Raw, providerSpec); err != nil {
		return fmt.Errorf("unmarshalling provider spec: %w", err)
	}

	if providerSpec.Workspace == nil {
		providerSpec.Workspace = &machinev1beta1.Workspace{}
	}
	providerSpec.Workspace.Server = fd.Server
	providerSpec.Workspace.Datacenter = fd.Topology.Datacenter
	providerSpec.Workspace.Datastore = fd.Topology.Datastore
	providerSpec.Workspace.Folder = fd.Topology.Folder
	providerSpec.Workspace.ResourcePool = fd.Topology.ResourcePool

	// Use the template from the migration manifest (target vCenter path), not the
	// copied source MachineSet's template (old nested path).
	if fd.Topology.Template != "" {
		providerSpec.Template = fd.Topology.Template
	}

	if len(fd.Topology.Networks) > 0 {
		providerSpec.Network = machinev1beta1.NetworkSpec{
			Devices: []machinev1beta1.NetworkDeviceSpec{
				{NetworkName: fd.Topology.Networks[0]},
			},
		}
	}

	raw, err := json.Marshal(providerSpec)
	if err != nil {
		return fmt.Errorf("marshalling updated provider spec: %w", err)
	}

	ms.Spec.Template.Spec.ProviderSpec.Value = &runtime.RawExtension{Raw: raw}
	return nil
}

// extractVSphereProviderSpec extracts the VSphereMachineProviderSpec from a MachineSet.
func extractVSphereProviderSpec(ms *machinev1beta1.MachineSet) (*machinev1beta1.VSphereMachineProviderSpec, error) {
	if ms == nil {
		return nil, fmt.Errorf("machineset must not be nil")
	}
	if ms.Spec.Template.Spec.ProviderSpec.Value == nil {
		return nil, fmt.Errorf("machineset %q has no provider spec", ms.Name)
	}
	if ms.Spec.Template.Spec.ProviderSpec.Value.Raw == nil {
		return nil, fmt.Errorf("machineset %q provider spec has no raw value", ms.Name)
	}

	providerSpec := &machinev1beta1.VSphereMachineProviderSpec{}
	if err := json.Unmarshal(ms.Spec.Template.Spec.ProviderSpec.Value.Raw, providerSpec); err != nil {
		return nil, fmt.Errorf("unmarshalling provider spec from machineset %q: %w", ms.Name, err)
	}

	return providerSpec, nil
}

// toInterfaceSlice converts a slice of maps to a slice of interface{} for use with
// unstructured.SetNestedSlice.
func toInterfaceSlice(in []map[string]interface{}) []interface{} {
	out := make([]interface{}, len(in))
	for i, v := range in {
		out[i] = v
	}
	return out
}
