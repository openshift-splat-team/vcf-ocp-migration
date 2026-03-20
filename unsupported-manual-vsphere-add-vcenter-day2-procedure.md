# Adding Additional vCenters to Single-vCenter OpenShift Clusters (Day 2 Operation)

## Overview
This guide helps you add additional vCenter servers to your existing OpenShift cluster running on vSphere after installation (Day 2). Use this guide if your cluster was originally installed with a single vCenter. You'll learn how to convert your cloud configuration to YAML format, bypass API validation, configure failure domains, and update Machine API MachineSets.

**Before you start:** Review the Prerequisites section below to ensure your environment meets all requirements, including YAML format cloud config, stretched Layer 2 networking, and low network latency between vCenters.

**Note:** OpenShift fully supports multiple vCenters when you configure them during installation (Day 0). This guide covers adding vCenters after installation, which is currently available for testing only.

### Current support status

**Important:** Adding vCenters as a Day 2 operation isn't currently supported for production use. This procedure is for testing and evaluation purposes.

While OpenShift supports clusters installed with multiple vCenters from the beginning (Day 0), adding vCenters to a cluster that was originally installed with only one vCenter is not currently supported. This procedure is provided for testing and development purposes as support for this Day 2 operation is actively being developed. Use this procedure at your own risk in non-production environments only.

### Resources that need updates

Adding a new vCenter requires updating **two separate resources**:

| Resource | What to Update | Requires CVO Bypass? |
|----------|----------------|---------------------|
| **Infrastructure CR**<br/>`infrastructure.config.openshift.io/cluster` | • `spec.platformSpec.vsphere.vcenters` stanza<br/>• `spec.platformSpec.vsphere.failureDomains` | **YES** - when adding second vCenter only |
| **Cloud Config ConfigMap**<br/>`cloud-conf` in `openshift-cloud-controller-manager` | • `vcenter:` section<br/>• `labels:` section | **NO** - can be updated independently |

### Day 2 operation workflow

To enable additional vCenters in an existing single-vCenter OpenShift cluster, follow this complete workflow:

1. **Verify Prerequisites** - Confirm platform type VSphere and check OpenShift version
2. **Bypass API Validation** (if only one vCenter is currently defined) - Disable CVO and apply validation patch to Infrastructure CRD
3. **Convert Cloud Config to YAML** (required if using INI format) - Convert to YAML format before adding a second vCenter
4. **Add vCenter Configuration**:
   - Label vCenter datacenters and clusters in vSphere with zone/region tags
   - Update the Infrastructure CR (vcenters stanza and failure domains)
   - **Delete the machine-config-controller ControllerConfig** (required after Infrastructure CR update)
   - **Re-enable CVO** after Infrastructure CR is updated with second vCenter
   - Update cloud config (vcenter section and labels) - CVO must be running
   - Update credentials for new vCenter in vsphere-creds secret (required for each vCenter)
5. **Update MachineSets and ControlPlaneMachineSet** - Configure both worker MachineSets (Machine API) and ControlPlaneMachineSet (control plane) for the new vCenter
6. **Verify Operation** - Check CCM logs and node registration

This document covers all steps in the workflow above.

## Prerequisites
- An OpenShift cluster installed as platform type: VSphere
- A cluster originally installed with a single vCenter (clusters installed with multiple vCenters already support this configuration)
- YAML format cloud configuration - you need to convert to YAML format if you're currently using INI
- Access to your current cloud configuration (INI or YAML format)
- Stretched Layer 2 network between vCenters - all cluster nodes (existing and new) need to be on the same L2 network/subnet regardless of vCenter location
- Low network latency - round-trip latency between vCenter locations needs to be under 100ms for etcd to work properly
- Knowledge of your vSphere infrastructure - datacenters, clusters, networks, and datastores on both existing and new vCenters
- Identified failure domains - zones and regions for both existing and new vCenter infrastructure
- Understanding of your OpenShift cluster's infrastructure configuration
- Permission to apply vSphere category tags to datacenters and compute clusters

### Verify this is a vSphere platform cluster

Before you continue, confirm your cluster was installed with platform type VSphere:

```bash
# Check the platform type
oc get infrastructure cluster -o jsonpath='{.status.platform}{"\n"}'
# Should return: VSphere

# Verify the vsphere-creds secret exists
oc get secret vsphere-creds -n kube-system
# If this secret does not exist, this cluster was not installed as platform VSphere and these instructions do not apply
```

---

## Workflow step 1: Verify prerequisites

See the "Prerequisites" section above to check your platform type and OpenShift version.

---

## Workflow step 2: Bypassing API Validation for Multiple vCenters

When adding a **second vCenter** to a cluster that currently has only one vCenter defined, you must bypass the Infrastructure API validation. The Infrastructure CRD includes validation rules that prevent adding multiple vCenters until full support is available.

**Important:** This validation bypass only applies to the Infrastructure resource, not the cloud configuration. You can update the cloud config (ConfigMap) without bypassing validation. Use the bypass only when updating the Infrastructure CR's `vcenters` stanza.

**Once more than one vCenter is defined in the Infrastructure resource, this bypass is no longer required for subsequent vCenter additions.**

**Important:** This procedure is for testing only and isn't currently supported for production use.

### What you need for the validation bypass

- Cluster administrator access
- Permission to scale the Cluster Version Operator
- Note: This temporarily disables cluster update reconciliation

### How to bypass validation

1. **Create the validation patch file** (`patch.json`):

   ```json
   [
     {
       "op": "remove",
       "path": "/spec/versions/0/schema/openAPIV3Schema/properties/spec/properties/platformSpec/properties/vsphere/x-kubernetes-validations"
     },
     {
       "op": "remove",
       "path": "/spec/versions/0/schema/openAPIV3Schema/properties/spec/properties/platformSpec/properties/vsphere/properties/vcenters/x-kubernetes-validations"
     },
     {
       "op": "remove",
       "path": "/spec/versions/0/schema/openAPIV3Schema/properties/spec/properties/platformSpec/x-kubernetes-validations"
     }
   ]
   ```

2. **Disable the Cluster Version Operator** to prevent reconciliation:

   ```bash
   oc scale deploy -n openshift-cluster-version cluster-version-operator --replicas=0
   ```

3. **Apply the validation patch** to the Infrastructure CRD:

   ```bash
   oc patch crd infrastructures.config.openshift.io --type=json --patch-file patch.json
   ```

4. **Label vSphere resources and update the Infrastructure resource** - First label vCenter datacenters and clusters in vSphere, then add the new vCenter to the `vcenters` stanza and configure failure domains (see "Adding New vCenters to Existing Configuration" section below)

5. **Re-enable the Cluster Version Operator** after the Infrastructure resource is updated:

   ```bash
   oc scale deploy -n openshift-cluster-version cluster-version-operator --replicas=1
   ```

   **CRITICAL:** The CVO must be re-enabled after the second vCenter is added to the Infrastructure resource. Once two or more vCenters are defined in the Infrastructure CR, the validation bypass is no longer needed.

### Important things to know

- **You only need this bypass when adding a second vCenter** to a cluster that has one vCenter
- **The bypass only applies to the Infrastructure resource**, not the cloud config (ConfigMap)
- Once you have two or more vCenters in the Infrastructure resource, you don't need this bypass anymore
- **Keep the CVO disabled only until you update the Infrastructure resource** - after you add the second vCenter to the Infrastructure CR, re-enable the CVO before updating the cloud config
- **Re-enable the CVO right after updating the Infrastructure CR** - don't leave it disabled for the remaining steps
- Leaving the CVO disabled prevents cluster updates and reconciliation
- The CVO will restore the validation when it reconciles the CRD
- This bypass is temporary and for testing only
- **You don't need the bypass for cloud config updates** - update the cloud-conf ConfigMap with the CVO running normally

---

## Workflow step 3: Convert Cloud Config to YAML Format

**Before you continue:** Your cloud configuration needs to be in YAML format to add a second vCenter. If your cluster uses INI format, convert it to YAML first.

**Check your current format:**
```bash
# Check the cloud config format
oc get configmap cloud-conf -n openshift-cloud-controller-manager -o jsonpath='{.data.cloud\.conf}' | head -5

# If it starts with sections like [Global], it's INI format - CONVERSION REQUIRED
# If it starts with 'global:', it's already YAML format - SKIP TO WORKFLOW STEP 4
```

**You can skip this section if:**
- Your cluster was installed with OpenShift 4.18 or later (uses YAML by default)
- Your cluster already uses YAML format cloud config

**You need to complete this section if:**
- Your cloud config is currently in INI format (regardless of OpenShift version)
- You're adding a second vCenter to a cluster using INI format

This section contains the detailed steps for converting INI-format cloud configuration to YAML format.

---

### Step 3.1: Identify Current INI Configuration Sections

### Retrieving the Current INI Cloud Config

First, extract your existing vSphere cloud configuration from the cluster:

```bash
# Check if cloud config exists in openshift-cloud-controller-manager namespace
oc get configmap cloud-conf -n openshift-cloud-controller-manager -o yaml

# Extract just the INI configuration content
oc get configmap cloud-conf -n openshift-cloud-controller-manager -o jsonpath='{.data.cloud\.conf}' > current-cloud-config.ini

# If not found in cloud-controller-manager, check the legacy location
oc get configmap cloud-provider-config -n openshift-config -o jsonpath='{.data.config}' > current-cloud-config.ini

# View the configuration
cat current-cloud-config.ini
```

### Common INI Configuration Sections

Your existing INI configuration may contain these sections:

```ini
[Global]
secret-name = "vsphere-creds"
secret-namespace = "kube-system"
insecure-flag = "1"

[Workspace]
server = "vcenter.example.com"
datacenter = "DC1"

[VirtualCenter "vcenter.example.com"]
datacenters = "DC1,DC2"
port = "443"
```

### Check Configuration Format

**Important:** Check your current format first. You need YAML format to add a second vCenter.

```bash
# Check the cloud config format
oc get configmap cloud-conf -n openshift-cloud-controller-manager -o jsonpath='{.data.cloud\.conf}' | head -5

# Check your OpenShift version
oc get clusterversion -o jsonpath='{.items[0].status.desired.version}{"\n"}'
```

**What the output means:**
- Sections like `[Global]` → INI format - convert to YAML (you can't add a second vCenter with INI format)
- Content starting with `global:` → YAML format - skip this step and go to Workflow step 4

**Important:** If your cloud config is in INI format, convert it to YAML before adding a second vCenter. YAML format is required for multi-vCenter configurations, regardless of your OpenShift version.

If your configuration is already in YAML format, skip the rest of this step and go to Workflow step 4 to add the vCenter configuration.

---

### Step 3.2: Create YAML Structure with Global Settings

Convert the `[Global]` section fields using these mappings:

| INI Field (kebab-case) | YAML Field (camelCase) | Type | Notes |
|------------------------|------------------------|------|-------|
| `user` | `user` | string | vCenter username |
| `password` | `password` | string | vCenter password |
| `server` | `server` | string | vCenter hostname/IP |
| `port` | `port` | integer | vCenter port (default: 443) |
| `insecure-flag` | `insecureFlag` | boolean | Convert "1"→true, "0"→false |
| `datacenters` | `datacenters` | array | Split comma-separated values |
| `secret-name` | `secretName` | string | Kubernetes secret name |
| `secret-namespace` | `secretNamespace` | string | Kubernetes secret namespace |

**Example conversion:**

```yaml
global:
  secretName: vsphere-creds
  secretNamespace: kube-system
  insecureFlag: true
```

---

### Step 3.3: Convert VirtualCenter Sections

For each `[VirtualCenter "hostname"]` section:

1. Use the hostname as the dictionary key under `vcenter:`
2. Convert the section properties to YAML fields
3. Split comma-separated datacenters into arrays

**INI:**
```ini
[VirtualCenter "vcenter1.example.com"]
datacenters = "DC1,DC2,DC3"
port = "443"

[VirtualCenter "vcenter2.example.com"]
datacenters = "DC4"
```

**YAML:**
```yaml
vcenter:
  vcenter1.example.com:
    server: vcenter1.example.com
    port: 443
    datacenters:
    - DC1
    - DC2
    - DC3
  vcenter2.example.com:
    server: vcenter2.example.com
    datacenters:
    - DC4
```

---

### Step 3.4: Add Failure Domain Support

**IMPORTANT:** When adding a new vCenter (Workflow Step 4), failure domains are **required**. If your existing cluster doesn't already use failure domains, you must configure them as part of adding the new vCenter. This step ensures the cloud config includes the necessary labels.

If your cluster already uses failure domains for topology awareness:

1. **Check if failure domains are defined** in your Infrastructure CR:
   ```bash
   oc get infrastructure cluster -o jsonpath='{.spec.platformSpec.vsphere.failureDomains}' | jq .
   ```

2. **Add the labels section** - This is required when using failure domains:

   ```yaml
   labels:
     zone: openshift-zone
     region: openshift-region
   ```

3. **For each failure domain**, ensure its datacenter appears in the corresponding vCenter's datacenter list:
   - Extract server and datacenter from each failure domain
   - Add datacenter to that vCenter's datacenter array (avoid duplicates)

**Example with failure domains:**
```yaml
global:
  secretName: vsphere-creds
  secretNamespace: kube-system
vcenter:
  vcenter.example.com:
    server: vcenter.example.com
    datacenters:
    - DC1    # From original config
    - DC2    # Added from failure domain
    - DC3    # Added from failure domain
labels:
  zone: openshift-zone
  region: openshift-region
```

---

### Step 3.5: Add Node Networking Configuration (Optional)

If your cluster requires specific network settings for nodes, add the `nodes:` section. **IMPORTANT:** Both the `internalNetworkSubnetCidr` and `externalNetworkSubnetCidr` values must align with the `machineCIDR` defined in your install-config.yaml.

**CRITICAL for Multi-vCenter:** When adding a second vCenter, the network specified here must be the same Layer 2 network stretched between both vCenters. All nodes, regardless of vCenter location, must use the same `machineCIDR` subnet.

### Checking Your Cluster's Machine CIDR

First, identify your cluster's machine network CIDR:

```bash
# From install-config.yaml (if available)
grep -A 5 "^networking:" install-config.yaml

# Or from the deployed cluster
oc get network.config.openshift.io cluster -o jsonpath='{.status.clusterNetwork[*].cidr}{"\n"}'
oc get network.config.openshift.io cluster -o jsonpath='{.status.serviceNetwork[*]}{"\n"}'

# Check the actual node IP addresses
oc get nodes -o wide
```

### Configuring Node Networking

Both `internalNetworkSubnetCidr` and `externalNetworkSubnetCidr` must match or be subsets of your install-config.yaml's `machineCIDR`. This ensures that the cloud controller manager correctly identifies and manages node IP addresses.

```yaml
nodes:
  # Internal network - MUST align with install-config.yaml machineCIDR
  internalVmNetworkName: "VM Network"
  internalNetworkSubnetCidr: "10.0.0.0/24"        # Must match/subset of machineCIDR
  
  # External network - MUST also align with install-config.yaml machineCIDR
  externalVmNetworkName: "VM Network"
  externalNetworkSubnetCidr: "10.0.0.0/24"        # Must match/subset of machineCIDR
```

### Example Alignment

**install-config.yaml:**
```yaml
networking:
  machineCIDR: 10.0.0.0/24
  clusterNetwork:
  - cidr: 10.128.0.0/14
    hostPrefix: 23
  serviceNetwork:
  - 172.30.0.0/16
```

**cloud-config.yaml nodes section:**
```yaml
nodes:
  internalVmNetworkName: "VM Network"
  internalNetworkSubnetCidr: "10.0.0.0/24"        # Matches machineCIDR
  externalVmNetworkName: "VM Network"
  externalNetworkSubnetCidr: "10.0.0.0/24"        # Also matches machineCIDR
```

### Field Descriptions

| Field | Description | Example |
|-------|-------------|---------|
| `internalVmNetworkName` | vSphere network name for node traffic | "VM Network" |
| `internalNetworkSubnetCidr` | Subnet CIDR - must align with machineCIDR | "10.0.0.0/24" |
| `externalVmNetworkName` | vSphere network name for external traffic | "VM Network" |
| `externalNetworkSubnetCidr` | External subnet CIDR - must align with machineCIDR | "10.0.0.0/24" |

---

### Step 3.6: Remove Deprecated Sections

The following INI sections should **NOT** be converted to YAML (they're deprecated):

- `[Workspace]` - This section is obsolete and should be omitted
- `[Disk]` - Disk settings are no longer used in external CCM
- `[SCSI]` - SCSI controller settings are handled elsewhere

---

### Step 3.7: Validate the Final YAML

Your final YAML should follow this structure:

```yaml
global:
  # Global vCenter connection settings
  secretName: vsphere-creds
  secretNamespace: kube-system
  insecureFlag: true

vcenter:
  # Map of vCenter servers
  vcenter1.example.com:
    server: vcenter1.example.com
    port: 443
    datacenters:
    - DC1
    - DC2

labels:
  # Required when adding a new vCenter (failure domains required)
  zone: openshift-zone
  region: openshift-region

nodes:
  # Only if custom networking is required
  internalVmNetworkName: "Internal Network"
  internalNetworkSubnetCidr: "192.168.0.0/24"
```

**Important:** When adding a new vCenter, the `labels` section is required because failure domains must be configured for multi-vCenter support.

---

### Step 3.8: Apply the Converted Configuration

1. **Backup the original configuration:**
   ```bash
   oc get cm/cloud-conf -n openshift-cloud-controller-manager -o yaml > cloud-conf-backup.yaml
   ```

2. **Update the ConfigMap with new YAML:**
   ```bash
   oc create configmap cloud-conf \
     --from-file=cloud.conf=vsphere-config.yaml \
     -n openshift-cloud-controller-manager \
     --dry-run=client -o yaml | oc apply -f -
   ```

3. **Restart the cloud controller manager pods:**
   ```bash
   oc delete pods -n openshift-cloud-controller-manager -l app=cloud-controller-manager
   ```

### Complete Conversion Example

**Before (INI):**
```ini
[Global]
secret-name = "vsphere-creds"
secret-namespace = "kube-system"
insecure-flag = "1"

[VirtualCenter "vcenter.example.com"]
datacenters = "DC1,DC2"
port = "443"
```

**After (YAML):**
```yaml
global:
  secretName: vsphere-creds
  secretNamespace: kube-system
  insecureFlag: true

vcenter:
  vcenter.example.com:
    server: vcenter.example.com
    port: 443
    datacenters:
    - DC1
    - DC2

labels:
  zone: openshift-zone
  region: openshift-region
```

### Key Conversion Rules Summary

1. **Naming**: Convert kebab-case (`secret-name`) to camelCase (`secretName`)
2. **Booleans**: Convert string flags ("1"/"0") to boolean (true/false)
3. **Arrays**: Convert comma-separated strings to YAML arrays
4. **Structure**: Flatten `[VirtualCenter "name"]` sections into `vcenter:` dictionary
5. **Zones**: Add `labels` section only when failure domains are configured
6. **Datacenters**: Merge datacenters from both VCenter configs and failure domains, removing duplicates
7. **Multiple vCenters**: Each vCenter is a separate key in the `vcenter:` dictionary
8. **Credentials**: Always use the global `vsphere-creds` secret in the `kube-system` namespace for all vCenters

---

## Workflow step 4: Adding New vCenters to Existing Configuration

**⚠️ PREREQUISITES FOR THIS STEP:**
1. **Cloud config needs to be in YAML format** - If you skipped Workflow step 3, check that your cloud config is in YAML format. You can't continue with INI format.
2. **API validation bypass (for Infrastructure resource only)** - If your cluster currently has only one vCenter defined and you are adding a second one, you must first complete the "Bypassing API Validation for Multiple vCenters" (Workflow Step 2) above. This bypass is only required for updating the Infrastructure resource, not the cloud config. Once two or more vCenters are defined in the Infrastructure resource, the bypass is not needed for subsequent additions.

**Verify YAML format before proceeding:**
```bash
oc get configmap cloud-conf -n openshift-cloud-controller-manager -o jsonpath='{.data.cloud\.conf}' | head -1
# Output should start with "global:" not "[Global]"
```

### When to Add New vCenters

You may need to add new vCenters to your configuration when:
- Expanding your infrastructure to additional datacenters
- Implementing multi-datacenter disaster recovery
- Adding capacity through new vSphere environments
- Configuring stretched clusters across multiple vCenter instances

### Procedure for Adding a New vCenter

This procedure includes three main steps:
1. Update the Infrastructure resource (requires CVO bypass if adding second vCenter)
2. Update the cloud config ConfigMap (does not require CVO bypass)
3. Update credentials in the vsphere-creds secret

#### Step 4.1: Update Infrastructure Resource (Requires CVO Bypass)

**Note:** You need to disable the CVO for this step if you're adding a second vCenter. See the "Before you start" note above.

Follow the detailed instructions in the "Adding vCenters with Failure Domains (Required)" section below to:
1. Label vCenter datacenters and clusters in vSphere
2. Add the new vCenter to the `vcenters` stanza
3. Add failure domains for the new vCenter
4. Delete the machine-config-controller ControllerConfig (required after Infrastructure resource update)
5. Re-enable the CVO right after you complete the Infrastructure resource update

#### Step 4.2: Update Cloud Config YAML (No CVO Bypass Required)

**Note:** The cloud config doesn't require the CVO bypass. The CVO should already be re-enabled at this point (from step 4.1 above).

1. **Edit your existing cloud config YAML** to add a new entry under the `vcenter:` section:

   ```yaml
   vcenter:
     # Existing vCenter
     vcenter1.example.com:
       server: vcenter1.example.com
       port: 443
       datacenters:
       - DC1
       - DC2

     # NEW vCenter being added
     vcenter2.example.com:
       server: vcenter2.example.com
       port: 443
       datacenters:
       - DC3
       - DC4
   ```

2. **Update the ConfigMap with the new configuration:**

   ```bash
   # Backup current cloud config
   oc get cm cloud-conf -n openshift-cloud-controller-manager -o yaml > cloud-conf-backup.yaml

   # Edit the cloud config
   oc edit cm cloud-conf -n openshift-cloud-controller-manager
   # Add the new vCenter to the vcenter: section as shown above

   # Restart cloud controller manager to apply changes
   oc delete pods -n openshift-cloud-controller-manager -l app=cloud-controller-manager
   ```

#### Step 4.3: Update Credentials (Required)

3. **Update the existing `vsphere-creds` secret** to add credentials for the new vCenter:

   ```bash
   # View current secret to see existing credentials
   oc get secret vsphere-creds -n kube-system -o yaml

   # Edit the secret to add new vCenter credentials
   # The secret already contains credentials for existing vCenters
   # Add entries for vcenter2.example.com.username and vcenter2.example.com.password
   oc edit secret vsphere-creds -n kube-system
   ```

   **Important:** Each vCenter requires its own credential entries in the secret, even if all vCenters use the same username and password. You must add `<vcenter-hostname>.username` and `<vcenter-hostname>.password` entries for the new vCenter.

---

### Required fields for new vCenters

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `server` | Yes | - | vCenter hostname or IP address |
| `datacenters` | Yes | - | List of datacenters to manage |
| `port` | No | 443 | vCenter API port |

**Note:** Credentials are always managed through the existing `vsphere-creds` secret in the `kube-system` namespace, which is automatically created during installation.

### Adding vCenters with Failure Domains (Required)

**Important:** You need to configure failure domains when adding a new vCenter. Define failure domains for both your existing and new vCenter infrastructure.

**Before you start:** If you're adding a second vCenter to a cluster that currently has only one vCenter, disable the CVO and apply the CRD validation bypass first (see Workflow Step 2: Bypassing API Validation). Keep the CVO disabled while you complete steps 1-2 below (labeling and Infrastructure CR update), then re-enable it in step 3 before updating the cloud config.

When you add a new vCenter:

1. **Label vCenter datacenters and clusters first** - In vSphere, apply category tags to match the failure domain topology you plan to configure:

   For each failure domain, label both the datacenter and compute cluster in vSphere with the appropriate zone and region tags.

   **In vSphere (via UI or API):**
   - Create tag categories: `openshift-zone` and `openshift-region`
   - Create tags matching your failure domain zones/regions (e.g., `us-east-1a`, `us-east`, `us-west-1a`, `us-west`)
   - Apply tags to datacenters:
     - DC1 → tags: `openshift-zone: us-east-1a`, `openshift-region: us-east`
     - DC3 → tags: `openshift-zone: us-west-1a`, `openshift-region: us-west`
   - Apply the same tags to compute clusters within those datacenters:
     - /DC1/host/Cluster1 → tags: `openshift-zone: us-east-1a`, `openshift-region: us-east`
     - /DC3/host/Cluster1 → tags: `openshift-zone: us-west-1a`, `openshift-region: us-west`

   **Using govc CLI:**
   ```bash
   # Create tag categories
   govc tags.category.create -t Datacenter openshift-region
   govc tags.category.create -t Datacenter openshift-zone
   govc tags.category.create -t ClusterComputeResource openshift-region
   govc tags.category.create -t ClusterComputeResource openshift-zone

   # Create tags
   govc tags.create -c openshift-region us-east
   govc tags.create -c openshift-region us-west
   govc tags.create -c openshift-zone us-east-1a
   govc tags.create -c openshift-zone us-west-1a

   # Apply tags to datacenter DC1
   govc tags.attach -c openshift-region us-east /DC1
   govc tags.attach -c openshift-zone us-east-1a /DC1

   # Apply tags to compute cluster in DC1
   govc tags.attach -c openshift-region us-east /DC1/host/Cluster1
   govc tags.attach -c openshift-zone us-east-1a /DC1/host/Cluster1

   # Apply tags to datacenter DC3 (new vCenter)
   govc tags.attach -c openshift-region us-west /DC3
   govc tags.attach -c openshift-zone us-west-1a /DC3

   # Apply tags to compute cluster in DC3 (new vCenter)
   govc tags.attach -c openshift-region us-west /DC3/host/Cluster1
   govc tags.attach -c openshift-zone us-west-1a /DC3/host/Cluster1
   ```

   **Important:** The tag category names (`openshift-zone` and `openshift-region`) need to match the labels in your cloud config. The tag values need to match the zone and region values in your failure domains.

   **Why label first?** When you label vSphere resources before updating the Infrastructure CR, the topology information is already available when the cluster reconciles the new configuration. This prevents potential scheduling or placement issues.

2. **Update the Infrastructure CR** to add the new vCenter and failure domains:

   ```bash
   oc edit infrastructure cluster
   ```

   **Update these two sections in the Infrastructure resource:**

   **a) Add the new vCenter to the `vcenters` stanza:**

   ```yaml
   spec:
     platformSpec:
       type: VSphere
       vsphere:
         vcenters:
         # Existing vCenter
         - server: vcenter1.example.com
           port: 443
           datacenters:
           - DC1
           - DC2

         # NEW vCenter being added
         - server: vcenter2.example.com
           port: 443
           datacenters:
           - DC3
           - DC4
   ```

   **b) Add failure domain entries for the new vCenter:**

   ```yaml
         failureDomains:
         # Existing failure domains
         - name: us-east-1a
           region: us-east
           zone: us-east-1a
           server: vcenter1.example.com
           topology:
             datacenter: DC1
             computeCluster: /DC1/host/Cluster1
             networks: [VM Network]
             datastore: /DC1/datastore/vsanDatastore

         # NEW failure domain on new vCenter
         - name: us-west-1a
           region: us-west
           zone: us-west-1a
           server: vcenter2.example.com
           topology:
             datacenter: DC3
             computeCluster: /DC3/host/Cluster1
             networks: [VM Network]
             datastore: /DC3/datastore/vsanDatastore
   ```

   **Important:** The server names in the `vcenters` stanza need to match the server names in the `failureDomains` entries.

3. **Delete the machine-config-controller ControllerConfig:**

   After updating the Infrastructure resource, the machine-config-operator is unable to patch the machine-config-controller ControllerConfig. You must delete this ControllerConfig to allow the operator to recreate it with the updated infrastructure information.

   ```bash
   oc delete controllerconfig machine-config-controller -n openshift-machine-config-operator
   ```

   The machine-config-operator will automatically recreate the ControllerConfig with the correct configuration based on the updated Infrastructure resource.

   **Note:** This is safe to do - the ControllerConfig will be automatically recreated by the machine-config-operator.

4. **Re-enable the Cluster Version Operator** (if you disabled it for CRD validation bypass):

   ```bash
   oc scale deploy -n openshift-cluster-version cluster-version-operator --replicas=1
   ```

   **Important:** After you add the second vCenter to the Infrastructure resource and delete the machine-config-controller ControllerConfig, you can re-enable the CVO. You don't need the validation bypass for the cloud config update.

4. **Update the cloud config** to include the new vCenter and its datacenters:

   ```yaml
   vcenter:
     vcenter1.example.com:
       server: vcenter1.example.com
       datacenters:
       - DC1
       - DC2

     vcenter2.example.com:  # New vCenter
       server: vcenter2.example.com
       datacenters:
       - DC3  # From failure domain
       - DC4

   labels:
     zone: openshift-zone      # Must match vSphere tag category
     region: openshift-region  # Must match vSphere tag category
   ```

### Complete Example: Adding a New vCenter

This example shows the changes needed in both the Infrastructure resource and cloud config when adding `vcenter2.example.com` to an existing cluster.

#### Infrastructure Resource (requires CVO bypass for second vCenter)

**Before:**
```yaml
apiVersion: config.openshift.io/v1
kind: Infrastructure
metadata:
  name: cluster
spec:
  platformSpec:
    type: VSphere
    vsphere:
      vcenters:
      - server: vcenter1.example.com
        port: 443
        datacenters:
        - DC1
        - DC2

      failureDomains:
      - name: us-east-1a
        region: us-east
        zone: us-east-1a
        server: vcenter1.example.com
        topology:
          datacenter: DC1
          computeCluster: /DC1/host/Cluster1
          networks: [VM Network]
          datastore: /DC1/datastore/vsanDatastore
```

**After (adding vcenter2.example.com):**
```yaml
apiVersion: config.openshift.io/v1
kind: Infrastructure
metadata:
  name: cluster
spec:
  platformSpec:
    type: VSphere
    vsphere:
      vcenters:
      - server: vcenter1.example.com
        port: 443
        datacenters:
        - DC1
        - DC2

      # NEW vCenter added
      - server: vcenter2.example.com
        port: 443
        datacenters:
        - DC3
        - DC4

      failureDomains:
      - name: us-east-1a
        region: us-east
        zone: us-east-1a
        server: vcenter1.example.com
        topology:
          datacenter: DC1
          computeCluster: /DC1/host/Cluster1
          networks: [VM Network]
          datastore: /DC1/datastore/vsanDatastore

      # NEW failure domain on new vCenter
      - name: us-west-1a
        region: us-west
        zone: us-west-1a
        server: vcenter2.example.com
        topology:
          datacenter: DC3
          computeCluster: /DC3/host/Cluster1
          networks: [VM Network]
          datastore: /DC3/datastore/vsanDatastore
```

#### Cloud Config (does NOT require CVO bypass)

**Before:**
```yaml
global:
  secretName: vsphere-creds
  secretNamespace: kube-system
  insecureFlag: true

vcenter:
  vcenter1.example.com:
    server: vcenter1.example.com
    port: 443
    datacenters:
    - DC1
    - DC2

labels:
  zone: openshift-zone
  region: openshift-region
```

**After (adding vcenter2.example.com):**
```yaml
global:
  secretName: vsphere-creds
  secretNamespace: kube-system
  insecureFlag: true

vcenter:
  vcenter1.example.com:
    server: vcenter1.example.com
    port: 443
    datacenters:
    - DC1
    - DC2

  # NEW vCenter added
  vcenter2.example.com:
    server: vcenter2.example.com
    port: 443
    datacenters:
    - DC3
    - DC4

labels:
  zone: openshift-zone
  region: openshift-region
```

**Key points:**
- You need to bypass the CVO when adding the second vCenter to the Infrastructure resource (disable the CVO first)
- Re-enable the CVO right after you update the Infrastructure resource with the second vCenter
- The cloud config doesn't require the CVO bypass - update it with the CVO running
- Label your vSphere resources (datacenters and clusters) before updating the Infrastructure resource
- Server names need to match between the Infrastructure resource and cloud config
- Update both resources for the new vCenter to work properly

---

## Workflow step 5: Update MachineSets and ControlPlaneMachineSet for New vCenters

After adding the new vCenter to the cloud configuration and Infrastructure CR, you must update both worker MachineSets and the ControlPlaneMachineSet to provision machines on the new vCenter infrastructure.

**This step covers two distinct components:**
1. **Worker MachineSets** (Machine API) - For compute/worker nodes
2. **ControlPlaneMachineSet** (Cluster control plane) - For control plane/master nodes

These are separate resources managed by different operators and have different configuration structures.

---

## Part A: Updating Worker MachineSets (Machine API)

This section covers creating and configuring MachineSets for worker/compute nodes on the new vCenter.

### Understanding MachineSets and vCenters

- Each MachineSet defines how to provision machines in a specific location (datacenter, cluster, datastore, network)
- To use a new vCenter, you must create MachineSets that reference its infrastructure resources
- **When adding a new vCenter, MachineSets must reference failure domains** (configured in Workflow Step 4)

### Using Failure Domains (Required for New vCenters)

You must configure failure domains in the Infrastructure CR (see "Adding vCenters with Failure Domains" in Workflow Step 4) and reference them in your MachineSets:

1. **Check existing MachineSets:**

   ```bash
   oc get machinesets -n openshift-machine-api
   ```

2. **Create a new MachineSet using a failure domain** on the new vCenter:

   ```bash
   # Get an existing MachineSet as a template
   oc get machineset -n openshift-machine-api <existing-machineset-name> -o yaml > new-machineset.yaml
   ```

3. **Edit the new MachineSet** to reference the new vCenter's failure domain:

   ```yaml
   apiVersion: machine.openshift.io/v1beta1
   kind: MachineSet
   metadata:
     name: <cluster-name>-worker-new-vcenter-0
     namespace: openshift-machine-api
   spec:
     replicas: 1
     selector:
       matchLabels:
         machine.openshift.io/cluster-api-cluster: <cluster-name>
         machine.openshift.io/cluster-api-machineset: <cluster-name>-worker-new-vcenter-0
     template:
       metadata:
         labels:
           machine.openshift.io/cluster-api-cluster: <cluster-name>
           machine.openshift.io/cluster-api-machine-role: worker
           machine.openshift.io/cluster-api-machine-type: worker
           machine.openshift.io/cluster-api-machineset: <cluster-name>-worker-new-vcenter-0
       spec:
         providerSpec:
           value:
             apiVersion: machine.openshift.io/v1beta1
             kind: VSphereMachineProviderSpec
             # Reference the failure domain from the new vCenter
             failureDomain:
               name: us-west-1a  # Failure domain on new vCenter
             template: <cluster-name>-rhcos-generated-region-generated-zone
             workspace:
               server: ""  # Empty when using failure domains
   ```

   **Key changes:**
   - Update `metadata.name` to a unique name
   - Update all `matchLabels` and `labels` to match the new name
   - Set `spec.providerSpec.value.failureDomain.name` to the failure domain on the new vCenter
   - Set `spec.providerSpec.value.workspace.server` to empty string (failure domain provides this)

4. **Apply the new MachineSet:**

   ```bash
   oc apply -f new-machineset.yaml
   ```

### Alternative: Direct vCenter Resource Specification (Not Recommended for New vCenters)

**Note:** This approach is provided for reference only. When adding a new vCenter as a Day 2 operation, you should use failure domains as shown above. Direct resource specification without failure domains is not recommended for multi-vCenter configurations.

If you need to understand direct vCenter resource specification:

1. **Create a new MachineSet** with explicit vCenter configuration:

   ```yaml
   apiVersion: machine.openshift.io/v1beta1
   kind: MachineSet
   metadata:
     name: <cluster-name>-worker-vcenter2-0
     namespace: openshift-machine-api
   spec:
     replicas: 1
     selector:
       matchLabels:
         machine.openshift.io/cluster-api-cluster: <cluster-name>
         machine.openshift.io/cluster-api-machineset: <cluster-name>-worker-vcenter2-0
     template:
       metadata:
         labels:
           machine.openshift.io/cluster-api-cluster: <cluster-name>
           machine.openshift.io/cluster-api-machine-role: worker
           machine.openshift.io/cluster-api-machine-type: worker
           machine.openshift.io/cluster-api-machineset: <cluster-name>-worker-vcenter2-0
       spec:
         providerSpec:
           value:
             apiVersion: machine.openshift.io/v1beta1
             kind: VSphereMachineProviderSpec
             template: <cluster-name>-rhcos
             workspace:
               server: vcenter2.example.com      # New vCenter server
               datacenter: DC3                    # Datacenter on new vCenter
               datastore: /DC3/datastore/datastore1
               folder: /DC3/vm/<cluster-name>
               resourcePool: /DC3/host/Cluster1/Resources
             network:
               devices:
               - networkName: "VM Network"        # Network name on new vCenter
             numCPUs: 4
             memoryMiB: 16384
             diskGiB: 120
   ```

   **Key fields to configure for the new vCenter:**
   - `workspace.server`: New vCenter hostname
   - `workspace.datacenter`: Datacenter on the new vCenter
   - `workspace.datastore`: Datastore path on the new vCenter
   - `workspace.folder`: VM folder path (typically `/DC/vm/<cluster-name>`)
   - `workspace.resourcePool`: Resource pool path on the new vCenter
   - `network.devices[].networkName`: Network name on the new vCenter
   - `template`: VM template name (must exist on the new vCenter)

### Creating the VM Template on the New vCenter

Before machines can be provisioned, the RHCOS VM template must exist on the new vCenter:

1. **Check existing template name:**

   ```bash
   oc get machineset -n openshift-machine-api -o jsonpath='{.items[0].spec.template.spec.providerSpec.value.template}{"\n"}'
   ```

2. **Clone or create the template on the new vCenter:**
   - Option A: Manually clone an existing RHCOS template from the original vCenter to the new vCenter
   - Option B: Download and import the RHCOS OVA for your OpenShift version to the new vCenter
   - Ensure the template name matches what's configured in the MachineSet

3. **Verify template location:**
   - Template must be in the correct datacenter on the new vCenter
   - Template should be marked as a template (not a VM)

### Scaling MachineSets

After creating the MachineSets for the new vCenter:

1. **Verify the MachineSet is created:**

   ```bash
   oc get machinesets -n openshift-machine-api
   ```

2. **Scale up the new MachineSet:**

   ```bash
   oc scale machineset <cluster-name>-worker-new-vcenter-0 -n openshift-machine-api --replicas=2
   ```

3. **Monitor machine provisioning:**

   ```bash
   # Watch machines being created
   oc get machines -n openshift-machine-api -w

   # Check machine status
   oc get machines -n openshift-machine-api -o wide
   ```

4. **Verify nodes join the cluster:**

   ```bash
   # Wait for nodes to appear
   oc get nodes

   # Check node labels to confirm vCenter/zone placement
   oc get nodes -o custom-columns=NAME:.metadata.name,ZONE:.metadata.labels.topology\.kubernetes\.io/zone,REGION:.metadata.labels.topology\.kubernetes\.io/region
   ```

### Important Considerations

- **Control Plane Deployment**: Adding control plane nodes to a new vCenter is covered in Part B below. Control plane expansion across vCenters requires careful planning and network validation.
- **L2 Network Requirement**: ALL cluster nodes must reside on the same Layer 2 network/subnet regardless of vCenter. The network must be stretched between vCenters. This is a mandatory requirement.
- **Network Latency**: Round-trip latency between vCenters must not exceed 100ms for control plane nodes (etcd requirement). Measure actual latency before proceeding.
- **Storage Classes**: If using vSphere storage classes, verify they work across both vCenters or create separate storage classes for each
- **Load Balancing**: Ensure your load balancers can route traffic to nodes on both vCenters (all on the same subnet)
- **Template Synchronization**: Keep RHCOS templates synchronized across vCenters when upgrading OpenShift versions

### Troubleshooting Machine Provisioning

**Issue: Machines stuck in Provisioning state**
- Check Machine API operator logs: `oc logs -n openshift-machine-api -l api=clusterapi -c machine-controller --tail=50`
- Verify vCenter credentials are correct in vsphere-creds secret
- Ensure the VM template exists on the new vCenter
- Check that the datacenter, datastore, and resource pool paths are correct

**Issue: Template not found**
- Verify template name matches exactly (case-sensitive)
- Ensure template exists in the correct datacenter on the new vCenter
- Check template permissions for the vCenter service account

**Issue: Network or datastore not found**
- Verify network name matches exactly as it appears in vCenter
- Ensure datastore path is correct (use full path: `/DC/datastore/name`)
- Check that the vCenter service account has access to these resources

---

## Part B: Updating ControlPlaneMachineSet (Control Plane)

**IMPORTANT:** ControlPlaneMachineSet is a separate resource from worker MachineSets. It is managed by the Control Plane Machine Set Operator, not the Machine API Operator.

After configuring worker MachineSets (Part A above), you should update the ControlPlaneMachineSet to include the new vCenter's failure domain. This will enable control plane machines to be created on the new vCenter, providing true multi-vCenter high availability.

**Key Differences from Worker MachineSets:**

| Aspect | Worker MachineSets | ControlPlaneMachineSet |
|--------|-------------------|------------------------|
| Resource type | `MachineSet` | `ControlPlaneMachineSet` |
| Managed by | Machine API Operator | Control Plane Machine Set Operator |
| Purpose | Compute/worker nodes | Control plane/master nodes |
| Namespace | `openshift-machine-api` | `openshift-machine-api` |
| Configuration | Multiple MachineSets | Single ControlPlaneMachineSet |
| Scaling | Manual scaling per MachineSet | Managed replicas across failure domains |

**Important Considerations:**

- **This is a critical operation** - Control plane changes affect cluster availability
- **Requires careful planning** - Control plane nodes must maintain quorum during updates
- **Failure domains are mandatory** - ControlPlaneMachineSet requires failure domain configuration
- **Load balancer updates may be needed** - Ensure API and ingress load balancers can reach control plane nodes on both vCenters
- **Different from worker MachineSets** - Uses different resource type and operator

#### Understanding ControlPlaneMachineSet

The ControlPlaneMachineSet (CPMS) manages control plane machines in a declarative way. When you add a new failure domain to the CPMS, the cluster will automatically provision control plane machines in that failure domain.

**Key behaviors:**
- CPMS ensures control plane machines are spread across configured failure domains
- Adding a failure domain triggers creation of control plane machines in that location
- The cluster maintains the desired number of control plane replicas (typically 3)
- Control plane machines are replaced gradually to maintain quorum

#### Check if ControlPlaneMachineSet Exists

First, verify if your cluster uses ControlPlaneMachineSet:

```bash
# Check for ControlPlaneMachineSet
oc get controlplanemachineset -n openshift-machine-api

# If it exists, view the current configuration
oc get controlplanemachineset cluster -n openshift-machine-api -o yaml
```

**If ControlPlaneMachineSet does not exist:**
- Your cluster may be using static control plane machines (not managed by Machine API)
- This is common in clusters upgraded from older versions
- You'll need to manually create control plane machines on the new vCenter (advanced procedure not covered here)
- Consider if you need control plane presence on the new vCenter for your use case

**If ControlPlaneMachineSet exists**, proceed with the following steps.

#### Backup the Current ControlPlaneMachineSet

```bash
oc get controlplanemachineset cluster -n openshift-machine-api -o yaml > cpms-backup.yaml
```

#### Update ControlPlaneMachineSet with New Failure Domain

1. **Edit the ControlPlaneMachineSet:**

   ```bash
   oc edit controlplanemachineset cluster -n openshift-machine-api
   ```

2. **Add the new vCenter's failure domain** to the `spec.template.machines_v1beta1_machine_openshift_io.failureDomains.platform.vsphere.failureDomains` list:

   ```yaml
   apiVersion: machine.openshift.io/v1
   kind: ControlPlaneMachineSet
   metadata:
     name: cluster
     namespace: openshift-machine-api
   spec:
     replicas: 3
     selector:
       matchLabels:
         machine.openshift.io/cluster-api-cluster: <cluster-name>
         machine.openshift.io/cluster-api-machine-role: master
         machine.openshift.io/cluster-api-machine-type: master
     state: Active
     strategy:
       type: RollingUpdate
     template:
       machineType: machines_v1beta1_machine_openshift_io
       machines_v1beta1_machine_openshift_io:
         failureDomains:
           platform: VSphere
           vsphere:
           - name: us-east-1a        # Existing failure domain
           - name: us-west-1a        # NEW failure domain on new vCenter
         metadata:
           labels:
             machine.openshift.io/cluster-api-cluster: <cluster-name>
             machine.openshift.io/cluster-api-machine-role: master
             machine.openshift.io/cluster-api-machine-type: master
         spec:
           providerSpec:
             value:
               apiVersion: machine.openshift.io/v1beta1
               kind: VSphereMachineProviderSpec
               template: <cluster-name>-rhcos-generated-region-generated-zone
               workspace:
                 server: ""  # Empty when using failure domains
   ```

   **Key points:**
   - Add the new failure domain name (e.g., `us-west-1a`) to the `failureDomains.vsphere` list
   - The failure domain name must match what you configured in the Infrastructure CR
   - Keep `workspace.server` empty - failure domains provide the vCenter server
   - Ensure the template reference is correct

3. **Verify the CPMS state is Active:**

   The `spec.state` field should be set to `Active`. If it's `Inactive`, the CPMS won't manage control plane machines.

   ```yaml
   spec:
     state: Active
   ```

#### Monitor Control Plane Machine Creation

After updating the ControlPlaneMachineSet, new control plane machines will be created on the new vCenter:

1. **Watch control plane machines being created:**

   ```bash
   # Monitor machine creation
   oc get machines -n openshift-machine-api -l machine.openshift.io/cluster-api-machine-role=master -w
   ```

2. **Check the rollout status:**

   ```bash
   # View CPMS status
   oc get controlplanemachineset cluster -n openshift-machine-api -o jsonpath='{.status}' | jq .
   ```

3. **Verify control plane nodes are appearing:**

   ```bash
   # Check for new control plane nodes
   oc get nodes -l node-role.kubernetes.io/master

   # Check node topology labels
   oc get nodes -l node-role.kubernetes.io/master -o custom-columns=NAME:.metadata.name,ZONE:.metadata.labels.topology\.kubernetes\.io/zone,REGION:.metadata.labels.topology\.kubernetes\.io/region
   ```

4. **Monitor cluster operators:**

   ```bash
   # Ensure cluster operators remain healthy during rollout
   oc get clusteroperators
   ```

#### Expected Behavior and Timeline

- **Gradual rollout**: The CPMS will replace control plane machines one at a time
- **Maintains quorum**: At least 2 of 3 control plane machines remain available during updates
- **Time per machine**: Each control plane machine replacement can take 10-20 minutes
- **Total time**: For a 3-node control plane adding one failure domain, expect 30-60 minutes

#### Verification Steps

After the control plane machines are provisioned:

1. **Verify control plane machines are spread across vCenters:**

   ```bash
   oc get machines -n openshift-machine-api -l machine.openshift.io/cluster-api-machine-role=master -o wide
   ```

2. **Check that control plane nodes have correct topology labels:**

   ```bash
   oc get nodes -l node-role.kubernetes.io/master --show-labels | grep -E "topology.kubernetes.io/(zone|region)"
   ```

3. **Verify etcd cluster health:**

   ```bash
   oc get etcd cluster -o jsonpath='{.status.conditions}' | jq .
   ```

4. **Check API server availability:**

   ```bash
   oc get clusteroperator kube-apiserver
   ```

#### Important Warnings

**⚠️ CRITICAL:**
- **Do not interrupt the rollout** - Let the CPMS complete the control plane machine replacements
- **Ensure RHCOS templates exist on new vCenter** - Control plane machines cannot be created without the template
- **Review network requirements below** - Ensure L2 network and latency requirements are met (see "Critical network requirements" section)
- **Load balancer configuration** - Your API load balancer must be able to reach control plane nodes on both vCenters
- **Backup before proceeding** - Have a cluster backup before making control plane changes

**Rollback procedure:**
If you need to remove the new failure domain from the CPMS:

```bash
# Restore the backup
oc apply -f cpms-backup.yaml

# Or manually edit to remove the failure domain
oc edit controlplanemachineset cluster -n openshift-machine-api
# Remove the new failure domain from the list
```

The CPMS will then replace control plane machines to match the updated configuration.

#### Control Plane Considerations for Multi-vCenter

**Critical network requirements:**

**Important: All cluster nodes need to be on the same Layer 2 network/subnet**
- All nodes (control plane and worker) need to be on the same Layer 2 network segment, regardless of which vCenter they're running on
- This is a fundamental requirement for OpenShift cluster networking
- Nodes need to communicate directly without routing between them
- The network needs to be stretched/extended between the vCenters
- All nodes need to use the same `machineCIDR` subnet (configured in install-config.yaml)

**etcd Network Latency Requirements:**
- **Round-trip latency** between control plane nodes must not exceed **100ms** (etcd requirement)
- Latency higher than 100ms will cause etcd performance degradation and cluster instability
- **Measure actual latency** between vCenter locations before proceeding
- If latency exceeds 100ms, do not proceed with multi-vCenter control plane deployment
- This applies to all control plane nodes regardless of their vCenter location

**For production deployments:**
- Use the standard 3 control plane machines (OpenShift default)
- Ensure sufficient bandwidth between vCenters for etcd replication (minimum 1 Gbps recommended)
- Configure monitoring for control plane health across both vCenters
- Monitor etcd latency metrics continuously

**API Load Balancing:**
Your load balancer configuration must account for control plane nodes on multiple vCenters:
- Update API load balancer backends to include IPs from both vCenters
- All control plane node IPs must be on the same subnet (due to L2 requirement above)
- Ensure load balancer health checks can reach nodes on both vCenters
- Load balancer must be able to reach the stretched L2 network

**Storage Considerations:**
- Control plane nodes require persistent storage for etcd
- Ensure storage classes work correctly across both vCenters
- Plan for storage availability if one vCenter becomes unavailable

---

## Workflow step 6: Verify Operation After Adding vCenters

### Verify Cloud Configuration

1. **Verify the ConfigMap was updated:**
   ```bash
   oc get cm cloud-conf -n openshift-cloud-controller-manager -o yaml
   ```

2. **Check CCM logs for connection to new vCenter:**
   ```bash
   oc logs -n openshift-cloud-controller-manager -l app=cloud-controller-manager --tail=100
   ```

   Look for log entries indicating successful connection to the new vCenter server.

### Verify Infrastructure Configuration

3. **Verify the Infrastructure CR includes the new vCenter in the vcenters stanza:**
   ```bash
   # Check the vcenters stanza
   oc get infrastructure cluster -o jsonpath='{.spec.platformSpec.vsphere.vcenters}' | jq .
   ```

   You should see both vCenter servers listed with their datacenters.

4. **Verify failure domains are configured:**
   ```bash
   oc get infrastructure cluster -o jsonpath='{.spec.platformSpec.vsphere.failureDomains}' | jq .
   ```

   You should see failure domains for both the original and new vCenter.

### Verify Machine API Configuration

5. **Check that MachineSets for the new vCenter exist:**
   ```bash
   oc get machinesets -n openshift-machine-api
   ```

6. **Verify machines are being provisioned on the new vCenter:**
   ```bash
   # Check machine status
   oc get machines -n openshift-machine-api -o wide

   # Look for machines referencing the new vCenter
   oc get machines -n openshift-machine-api -o yaml | grep -A 5 "server: vcenter2.example.com"
   ```

7. **Monitor machine provisioning progress:**
   ```bash
   # Watch machines transition to Running state
   oc get machines -n openshift-machine-api -w
   ```

### Verify Node Registration

8. **Verify nodes can register from the new vCenter's datacenters:**
   ```bash
   oc get nodes -o wide
   ```

9. **Check node topology labels** (if using failure domains):
   ```bash
   oc get nodes -o custom-columns=NAME:.metadata.name,ZONE:.metadata.labels.topology\.kubernetes\.io/zone,REGION:.metadata.labels.topology\.kubernetes\.io/region
   ```

10. **Verify zone/region labels are applied correctly:**
    ```bash
    oc get nodes --show-labels | grep openshift-zone
    ```

11. **Check node provider IDs** to confirm vCenter assignment:
    ```bash
    oc get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.providerID}{"\n"}{end}'
    ```

    Provider IDs should include the vCenter server hostname for nodes on the new vCenter.

### Verify Workload Scheduling

12. **Create a test workload** to verify scheduling across vCenters:
    ```bash
    oc create deployment test-multi-vcenter --image=registry.access.redhat.com/ubi9/ubi-minimal:latest --replicas=4
    oc set command deployment/test-multi-vcenter -- sleep infinity
    ```

13. **Verify pods are scheduled across both vCenters:**
    ```bash
    oc get pods -o wide -l app=test-multi-vcenter
    ```

14. **Clean up the test workload:**
    ```bash
    oc delete deployment test-multi-vcenter
    ```

### Troubleshooting

**Issue: CCM cannot connect to new vCenter**
- Verify the server hostname/IP is reachable from the cluster
- Check credentials in the vsphere-creds secret: `oc get secret vsphere-creds -n kube-system -o yaml`
- Ensure the secret contains entries for `<vcenter-hostname>.username` and `<vcenter-hostname>.password`
- Verify the port (default 443)
- Check `insecureFlag` if using self-signed certificates

**Issue: Nodes not appearing from new datacenters**
- Ensure datacenter names match exactly (case-sensitive)
- Verify the datacenters are listed in the vCenter configuration
- Check that nodes have the correct vCenter in their provider ID

**Issue: Zone labels not applied**
- Verify failure domains are defined in Infrastructure CR
- Ensure `labels.zone` and `labels.region` are set in cloud config
- Confirm datacenter from failure domain is in vCenter's datacenter list
