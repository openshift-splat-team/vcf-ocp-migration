import * as React from 'react';
import {
  Label,
  Spinner,
  Bullseye,
  EmptyState,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateBody,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { CubesIcon } from '@patternfly/react-icons';
import { useK8sWatchResource, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';

const machineSetGVK = {
  group: 'machine.openshift.io',
  version: 'v1beta1',
  kind: 'MachineSet',
};

const machineGVK = {
  group: 'machine.openshift.io',
  version: 'v1beta1',
  kind: 'Machine',
};

const nodeGVK = {
  group: '',
  version: 'v1',
  kind: 'Node',
};

interface MachineSetKind {
  metadata: { name: string; namespace: string };
  spec: { replicas?: number };
  status?: { readyReplicas?: number; availableReplicas?: number };
}

interface MachineKind {
  metadata: { name: string; namespace: string; labels?: Record<string, string> };
  status?: { phase?: string; nodeRef?: { name: string } };
}

interface NodeKind {
  metadata: { name: string };
  status?: {
    conditions?: Array<{ type: string; status: string }>;
  };
}

const machineAPINamespace = 'openshift-machine-api';

export interface MachineTopologyViewProps {
  namespace: string;
}

interface MachineRow {
  machineSetName: string | null;
  machineSetNamespace: string;
  machineName: string;
  machineNamespace: string;
  machinePhase: string;
  nodeName: string | null;
  nodeReady: boolean | null;
  role: string;
}

export const MachineTopologyView: React.FC<MachineTopologyViewProps> = () => {
  const [machineSets, msLoaded] = useK8sWatchResource<MachineSetKind[]>({
    groupVersionKind: machineSetGVK,
    namespace: machineAPINamespace,
    isList: true,
    namespaced: true,
  });
  const [machines, mLoaded] = useK8sWatchResource<MachineKind[]>({
    groupVersionKind: machineGVK,
    namespace: machineAPINamespace,
    isList: true,
    namespaced: true,
  });
  const [nodes, nLoaded] = useK8sWatchResource<NodeKind[]>({
    groupVersionKind: nodeGVK,
    isList: true,
    namespaced: false,
  });

  const loaded = msLoaded && mLoaded && nLoaded;

  const nodeMap = React.useMemo(() => {
    const m: Record<string, NodeKind> = {};
    nodes?.forEach((n) => { m[n.metadata.name] = n; });
    return m;
  }, [nodes]);

  const rows: MachineRow[] = React.useMemo(() => {
    if (!loaded) return [];
    const msNames = new Set(machineSets?.map((ms) => ms.metadata.name) ?? []);
    const result: MachineRow[] = [];

    machines?.forEach((m) => {
      const msLabel = m.metadata.labels?.['machine.openshift.io/cluster-api-machineset'] ?? null;
      const roleLabel = m.metadata.labels?.['machine.openshift.io/cluster-api-machine-role'] ?? '';
      const nodeName = m.status?.nodeRef?.name ?? null;
      let nodeReady: boolean | null = null;
      if (nodeName) {
        const node = nodeMap[nodeName];
        const cond = node?.status?.conditions?.find((c) => c.type === 'Ready');
        nodeReady = cond?.status === 'True';
      }
      result.push({
        machineSetName: msLabel && msNames.has(msLabel) ? msLabel : null,
        machineSetNamespace: machineAPINamespace,
        machineName: m.metadata.name,
        machineNamespace: m.metadata.namespace,
        machinePhase: m.status?.phase ?? 'Unknown',
        nodeName,
        nodeReady,
        role: roleLabel || (msLabel ? 'worker' : 'master'),
      });
    });

    result.sort((a, b) => {
      if (a.role === 'master' && b.role !== 'master') return -1;
      if (a.role !== 'master' && b.role === 'master') return 1;
      return a.machineName.localeCompare(b.machineName);
    });

    return result;
  }, [loaded, machines, machineSets, nodeMap]);

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner size="lg" aria-label="Loading machine topology" />
      </Bullseye>
    );
  }

  if (!machines?.length) {
    return (
      <EmptyState>
        <EmptyStateHeader
          titleText="No machines found"
          headingLevel="h4"
          icon={<EmptyStateIcon icon={CubesIcon} />}
        />
        <EmptyStateBody>
          No machines were found in the openshift-machine-api namespace.
        </EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <Table aria-label="Machines" variant="compact">
      <Thead>
        <Tr>
          <Th>Role</Th>
          <Th>MachineSet</Th>
          <Th>Machine</Th>
          <Th>Phase</Th>
          <Th>Node</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row) => (
          <Tr key={row.machineName}>
            <Td dataLabel="Role">
              <Label color={row.role === 'master' ? 'purple' : 'blue'} isCompact>
                {row.role}
              </Label>
            </Td>
            <Td dataLabel="MachineSet">
              {row.machineSetName ? (
                <ResourceLink
                  groupVersionKind={machineSetGVK}
                  name={row.machineSetName}
                  namespace={row.machineSetNamespace}
                />
              ) : (
                <span className="pf-v5-u-color-200">-</span>
              )}
            </Td>
            <Td dataLabel="Machine">
              <ResourceLink
                groupVersionKind={machineGVK}
                name={row.machineName}
                namespace={row.machineNamespace}
              />
            </Td>
            <Td dataLabel="Phase">
              <Label color={getPhaseColor(row.machinePhase)} isCompact>
                {row.machinePhase}
              </Label>
            </Td>
            <Td dataLabel="Node">
              {row.nodeName ? (
                <ResourceLink
                  groupVersionKind={nodeGVK}
                  name={row.nodeName}
                />
              ) : (
                <span className="pf-v5-u-color-200">-</span>
              )}
            </Td>
            <Td dataLabel="Status">
              {row.nodeReady === null ? (
                <Label color="grey" isCompact>Pending</Label>
              ) : row.nodeReady ? (
                <Label color="green" isCompact>Ready</Label>
              ) : (
                <Label color="red" isCompact>Not Ready</Label>
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const getPhaseColor = (phase: string): 'blue' | 'green' | 'red' | 'grey' => {
  switch (phase) {
    case 'Running':
      return 'green';
    case 'Provisioning':
    case 'Provisioned':
      return 'blue';
    case 'Failed':
    case 'Deleting':
      return 'red';
    default:
      return 'grey';
  }
};
