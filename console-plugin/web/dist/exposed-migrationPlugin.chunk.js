"use strict";
(self["webpackChunkvcf_migration_console"] = self["webpackChunkvcf_migration_console"] || []).push([["exposed-migrationPlugin","node_modules_object-assign_index_js-_320c0","node_modules_object-assign_index_js-_320c1","node_modules_object-assign_index_js-_320c2","node_modules_object-assign_index_js-_320c3"],{

/***/ 5228
(module) {

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ },

/***/ 1020
(__unused_webpack_module, exports, __webpack_require__) {

/** @license React v17.0.2
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
__webpack_require__(5228);var f=__webpack_require__(8893),g=60103;exports.Fragment=60107;if("function"===typeof Symbol&&Symbol.for){var h=Symbol.for;g=h("react.element");exports.Fragment=h("react.fragment")}var m=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n=Object.prototype.hasOwnProperty,p={key:!0,ref:!0,__self:!0,__source:!0};
function q(c,a,k){var b,d={},e=null,l=null;void 0!==k&&(e=""+k);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(l=a.ref);for(b in a)n.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:g,type:c,key:e,ref:l,props:d,_owner:m.current}}exports.jsx=q;exports.jsxs=q;


/***/ },

/***/ 4848
(module, __unused_webpack_exports, __webpack_require__) {



if (true) {
  module.exports = __webpack_require__(1020);
} else // removed by dead control flow
{}


/***/ },

/***/ 4706
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  MigrationDetailPage: () => (/* reexport */ MigrationDetailPage),
  MigrationListPage: () => (/* reexport */ MigrationListPage),
  MigrationWizard: () => (/* reexport */ MigrationWizard)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: consume shared module (default) react@^17.0.1 (singleton)
var consume_shared_module_default_react_17_0_singleton_ = __webpack_require__(8893);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Page@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Page/index.js)
var index_js_ = __webpack_require__(2984);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Title@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Title/index.js)
var Title_index_js_ = __webpack_require__(3068);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Button@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Button/index.js)
var Button_index_js_ = __webpack_require__(2982);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Toolbar@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Toolbar/index.js)
var Toolbar_index_js_ = __webpack_require__(1176);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/EmptyState@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/EmptyState/index.js)
var EmptyState_index_js_ = __webpack_require__(5010);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Spinner@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Spinner/index.js)
var Spinner_index_js_ = __webpack_require__(9704);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/layouts/Bullseye@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/layouts/Bullseye/index.js)
var Bullseye_index_js_ = __webpack_require__(5464);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Label@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Label/index.js)
var Label_index_js_ = __webpack_require__(3592);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Alert@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Alert/index.js)
var Alert_index_js_ = __webpack_require__(3780);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-table/dist/dynamic/components/Table@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-table/dist/esm/components/Table/index.js)
var Table_index_js_ = __webpack_require__(8272);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-icons/dist/dynamic/icons/cubes-icon@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-icons/dist/esm/icons/cubes-icon.js)
var cubes_icon_js_ = __webpack_require__(3831);
// EXTERNAL MODULE: consume shared module (default) react-router-dom@~5.3 (singleton)
var consume_shared_module_default_react_router_dom_5_singleton_ = __webpack_require__(9359);
// EXTERNAL MODULE: consume shared module (default) @openshift-console/dynamic-plugin-sdk@^1.8.0 (singleton)
var dynamic_plugin_sdk_1_8_singleton_ = __webpack_require__(2385);
;// ./src/app/pages/MigrationListPage.tsx



























const migrationGVK = {
    group: 'migration.openshift.io',
    version: 'v1alpha1',
    kind: 'VmwareCloudFoundationMigration',
};
const getStateColor = (state) => {
    switch (state) {
        case 'Running':
            return 'blue';
        case 'Paused':
            return 'orange';
        default:
            return 'grey';
    }
};
const getReadyColor = (status) => {
    switch (status) {
        case 'True':
            return 'green';
        case 'False':
            return 'red';
        default:
            return 'grey';
    }
};
const formatAge = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'string')
        return '-';
    const created = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60)
        return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
        return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
};
const MigrationListPage = () => {
    const history = (0,consume_shared_module_default_react_router_dom_5_singleton_.useHistory)();
    const [migrations, loaded, loadError] = (0,dynamic_plugin_sdk_1_8_singleton_.useK8sWatchResource)({
        groupVersionKind: migrationGVK,
        isList: true,
        namespaced: true,
    });
    const getReadyCondition = (m) => {
        const cond = m.status?.conditions?.find((c) => c.type === 'Ready');
        return cond?.status ?? 'Unknown';
    };
    return ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(index_js_.PageSection, { variant: "light", children: (0,jsx_runtime.jsx)(Toolbar_index_js_.Toolbar, { children: (0,jsx_runtime.jsxs)(Toolbar_index_js_.ToolbarContent, { children: [(0,jsx_runtime.jsx)(Toolbar_index_js_.ToolbarItem, { children: (0,jsx_runtime.jsx)(Title_index_js_.Title, { headingLevel: "h1", children: "VCF Migrations" }) }), (0,jsx_runtime.jsx)(Toolbar_index_js_.ToolbarItem, { align: { default: 'alignRight' }, children: (0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "primary", onClick: () => history.push('/vcf-migration/create'), children: "Create migration" }) })] }) }) }), (0,jsx_runtime.jsxs)(index_js_.PageSection, { children: [loadError && ((0,jsx_runtime.jsx)(Alert_index_js_.Alert, { variant: "danger", title: "Failed to load migrations", isInline: true, className: "pf-v5-u-mb-md", children: String(loadError) })), !loaded && !loadError && ((0,jsx_runtime.jsx)(Bullseye_index_js_.Bullseye, { children: (0,jsx_runtime.jsx)(Spinner_index_js_.Spinner, { size: "xl", "aria-label": "Loading migrations" }) })), loaded && !loadError && (!migrations || migrations.length === 0) && ((0,jsx_runtime.jsxs)(EmptyState_index_js_.EmptyState, { children: [(0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateHeader, { titleText: "No migrations", headingLevel: "h4", icon: (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateIcon, { icon: cubes_icon_js_.CubesIcon }) }), (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateBody, { children: "No VCF migrations have been created yet. Create a migration to begin moving your OpenShift cluster to a new vCenter." }), (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateFooter, { children: (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateActions, { children: (0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "primary", onClick: () => history.push('/vcf-migration/create'), children: "Create migration" }) }) })] })), loaded && !loadError && migrations?.length > 0 && ((0,jsx_runtime.jsxs)(Table_index_js_.Table, { "aria-label": "Migrations table", children: [(0,jsx_runtime.jsx)(Table_index_js_.Thead, { children: (0,jsx_runtime.jsxs)(Table_index_js_.Tr, { children: [(0,jsx_runtime.jsx)(Table_index_js_.Th, { children: "Name" }), (0,jsx_runtime.jsx)(Table_index_js_.Th, { children: "Namespace" }), (0,jsx_runtime.jsx)(Table_index_js_.Th, { children: "State" }), (0,jsx_runtime.jsx)(Table_index_js_.Th, { children: "Ready" }), (0,jsx_runtime.jsx)(Table_index_js_.Th, { children: "Age" }), (0,jsx_runtime.jsx)(Table_index_js_.Th, { screenReaderText: "Actions" })] }) }), (0,jsx_runtime.jsx)(Table_index_js_.Tbody, { children: migrations.map((m) => {
                                    const readyStatus = getReadyCondition(m);
                                    return ((0,jsx_runtime.jsxs)(Table_index_js_.Tr, { isClickable: true, onRowClick: () => history.push(`/vcf-migration/ns/${m.metadata.namespace}/${m.metadata.name}`), children: [(0,jsx_runtime.jsx)(Table_index_js_.Td, { dataLabel: "Name", children: m.metadata.name }), (0,jsx_runtime.jsx)(Table_index_js_.Td, { dataLabel: "Namespace", children: m.metadata.namespace }), (0,jsx_runtime.jsx)(Table_index_js_.Td, { dataLabel: "State", children: (0,jsx_runtime.jsx)(Label_index_js_.Label, { color: getStateColor(m.spec.state), children: m.spec.state }) }), (0,jsx_runtime.jsx)(Table_index_js_.Td, { dataLabel: "Ready", children: (0,jsx_runtime.jsx)(Label_index_js_.Label, { color: getReadyColor(readyStatus), children: readyStatus }) }), (0,jsx_runtime.jsx)(Table_index_js_.Td, { dataLabel: "Age", children: formatAge(m.metadata.creationTimestamp) }), (0,jsx_runtime.jsx)(Table_index_js_.Td, { children: (0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "link", isInline: true, onClick: (e) => {
                                                        e.stopPropagation();
                                                        history.push(`/vcf-migration/ns/${m.metadata.namespace}/${m.metadata.name}`);
                                                    }, children: "View" }) })] }, `${m.metadata.namespace}-${m.metadata.name}`));
                                }) })] }))] })] }));
};

// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Wizard@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Wizard/index.js)
var Wizard_index_js_ = __webpack_require__(6544);
;// ./src/models.ts
const VmwareCloudFoundationMigrationModel = {
    kind: 'VmwareCloudFoundationMigration',
    label: 'VmwareCloudFoundationMigration',
    labelPlural: 'VmwareCloudFoundationMigrations',
    apiGroup: 'migration.openshift.io',
    apiVersion: 'v1alpha1',
    plural: 'vmwarecloudfoundationmigrations',
    abbr: 'vcfm',
    namespaced: true,
    crd: true,
};
const MachineSetModel = {
    kind: 'MachineSet',
    label: 'MachineSet',
    labelPlural: 'MachineSets',
    apiGroup: 'machine.openshift.io',
    apiVersion: 'v1beta1',
    plural: 'machinesets',
    abbr: 'ms',
    namespaced: true,
};
const MachineModel = {
    kind: 'Machine',
    label: 'Machine',
    labelPlural: 'Machines',
    apiGroup: 'machine.openshift.io',
    apiVersion: 'v1beta1',
    plural: 'machines',
    abbr: 'm',
    namespaced: true,
};
const NodeModel = {
    kind: 'Node',
    label: 'Node',
    labelPlural: 'Nodes',
    apiGroup: '',
    apiVersion: 'v1',
    plural: 'nodes',
    abbr: 'n',
    namespaced: false,
};

// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Form@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Form/index.js)
var Form_index_js_ = __webpack_require__(7178);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/HelperText@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/HelperText/index.js)
var HelperText_index_js_ = __webpack_require__(8152);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/TextInput@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/TextInput/index.js)
var TextInput_index_js_ = __webpack_require__(3168);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Checkbox@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Checkbox/index.js)
var Checkbox_index_js_ = __webpack_require__(8432);
;// ./src/app/components/wizard/CredentialsStep.tsx










const CredentialsStep = (props) => ((0,jsx_runtime.jsxs)(Form_index_js_.Form, { children: [(0,jsx_runtime.jsxs)(Form_index_js_.FormSection, { title: "Migration details", children: [(0,jsx_runtime.jsxs)(Form_index_js_.FormGroup, { label: "Migration name", isRequired: true, fieldId: "migration-name", children: [(0,jsx_runtime.jsx)(TextInput_index_js_.TextInput, { id: "migration-name", value: props.migrationName, onChange: (_e, v) => props.onMigrationNameChange(v), placeholder: "vcf-migration" }), (0,jsx_runtime.jsx)(Form_index_js_.FormHelperText, { children: (0,jsx_runtime.jsx)(HelperText_index_js_.HelperText, { children: (0,jsx_runtime.jsx)(HelperText_index_js_.HelperTextItem, { children: "A unique name for this migration resource" }) }) })] }), (0,jsx_runtime.jsxs)(Form_index_js_.FormGroup, { label: "Namespace", isRequired: true, fieldId: "migration-namespace", children: [(0,jsx_runtime.jsx)(TextInput_index_js_.TextInput, { id: "migration-namespace", value: props.migrationNamespace, onChange: (_e, v) => props.onMigrationNamespaceChange(v) }), (0,jsx_runtime.jsx)(Form_index_js_.FormHelperText, { children: (0,jsx_runtime.jsx)(HelperText_index_js_.HelperText, { children: (0,jsx_runtime.jsx)(HelperText_index_js_.HelperTextItem, { children: "The namespace where the migration resource will be created" }) }) })] })] }), (0,jsx_runtime.jsxs)(Form_index_js_.FormSection, { title: "Target vCenter", children: [(0,jsx_runtime.jsxs)(Form_index_js_.FormGroup, { label: "vCenter server", isRequired: true, fieldId: "server", children: [(0,jsx_runtime.jsx)(TextInput_index_js_.TextInput, { id: "server", value: props.server, onChange: (_e, v) => props.onServerChange(v), placeholder: "vcenter.example.com" }), (0,jsx_runtime.jsx)(Form_index_js_.FormHelperText, { children: (0,jsx_runtime.jsx)(HelperText_index_js_.HelperText, { children: (0,jsx_runtime.jsx)(HelperText_index_js_.HelperTextItem, { children: "FQDN or IP address of the target vCenter server" }) }) })] }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { fieldId: "use-secret", children: (0,jsx_runtime.jsx)(Checkbox_index_js_.Checkbox, { id: "use-secret", label: "Use existing secret for credentials", isChecked: props.useSecretRef, onChange: (_e, v) => props.onUseSecretRefChange(v), description: "Reference an existing Kubernetes secret containing vCenter credentials" }) }), props.useSecretRef ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Secret name", isRequired: true, fieldId: "secret-name", children: (0,jsx_runtime.jsx)(TextInput_index_js_.TextInput, { id: "secret-name", value: props.secretName, onChange: (_e, v) => props.onSecretNameChange(v) }) }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Secret namespace", fieldId: "secret-namespace", children: (0,jsx_runtime.jsx)(TextInput_index_js_.TextInput, { id: "secret-namespace", value: props.secretNamespace, onChange: (_e, v) => props.onSecretNamespaceChange(v) }) })] })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Username", isRequired: true, fieldId: "username", children: (0,jsx_runtime.jsx)(TextInput_index_js_.TextInput, { id: "username", value: props.username, onChange: (_e, v) => props.onUsernameChange(v) }) }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Password", isRequired: true, fieldId: "password", children: (0,jsx_runtime.jsx)(TextInput_index_js_.TextInput, { id: "password", type: "password", value: props.password, onChange: (_e, v) => props.onPasswordChange(v) }) }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { fieldId: "create-secret", children: (0,jsx_runtime.jsx)(Checkbox_index_js_.Checkbox, { id: "create-secret", label: "Create a secret from these credentials (recommended)", isChecked: props.createSecret, onChange: (_e, v) => props.onCreateSecretChange(v), description: "Stores credentials securely as a Kubernetes secret for the operator to use" }) })] }))] })] }));

// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Card@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Card/index.js)
var Card_index_js_ = __webpack_require__(1414);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/layouts/Stack@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/layouts/Stack/index.js)
var Stack_index_js_ = __webpack_require__(4400);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-icons/dist/dynamic/icons/plus-circle-icon@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-icons/dist/esm/icons/plus-circle-icon.js)
var plus_circle_icon_js_ = __webpack_require__(253);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-icons/dist/dynamic/icons/trash-icon@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-icons/dist/esm/icons/trash-icon.js)
var trash_icon_js_ = __webpack_require__(195);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/FormSelect@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/FormSelect/index.js)
var FormSelect_index_js_ = __webpack_require__(8170);
;// ./src/app/hooks/useVSphereBrowse.ts


const API_BASE = '/api/proxy/plugin/vcf-migration-console/vcf-migration-api';
function useVSphereConnect() {
    const [loading, setLoading] = (0,consume_shared_module_default_react_17_0_singleton_.useState)(false);
    const [error, setError] = (0,consume_shared_module_default_react_17_0_singleton_.useState)(null);
    const connect = (0,consume_shared_module_default_react_17_0_singleton_.useCallback)(async (params) => {
        setLoading(true);
        setError(null);
        try {
            const res = await (0,dynamic_plugin_sdk_1_8_singleton_.consoleFetch)(`${API_BASE}/vsphere/connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || res.statusText);
                return { datacenters: [], error: data.error || res.statusText };
            }
            return data;
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            setError(msg);
            return { datacenters: [], error: msg };
        }
        finally {
            setLoading(false);
        }
    }, []);
    return { connect, loading, error };
}
function useVSphereList(endpoint, params) {
    const [items, setItems] = (0,consume_shared_module_default_react_17_0_singleton_.useState)([]);
    const [loading, setLoading] = (0,consume_shared_module_default_react_17_0_singleton_.useState)(false);
    const [error, setError] = (0,consume_shared_module_default_react_17_0_singleton_.useState)(null);
    const fetchList = (0,consume_shared_module_default_react_17_0_singleton_.useCallback)(async () => {
        if (!params.server || !params.datacenter)
            return;
        setLoading(true);
        setError(null);
        try {
            const searchParams = new URLSearchParams({
                server: params.server,
                datacenter: params.datacenter,
            });
            if (params.secretName) {
                searchParams.set('secretName', params.secretName);
                if (params.secretNamespace)
                    searchParams.set('secretNamespace', params.secretNamespace);
            }
            else if (params.username && params.password) {
                searchParams.set('username', params.username);
                searchParams.set('password', params.password);
            }
            const res = await (0,dynamic_plugin_sdk_1_8_singleton_.consoleFetch)(`${API_BASE}/vsphere/${endpoint}?${searchParams}`);
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || res.statusText);
                setItems([]);
                return;
            }
            setItems(data.items || []);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : String(e));
            setItems([]);
        }
        finally {
            setLoading(false);
        }
    }, [endpoint, params.server, params.datacenter, params.secretName, params.secretNamespace, params.username, params.password]);
    return { items, loading, error, fetchList };
}

;// ./src/app/components/VSphereTreeBrowser.tsx









const VSphereTreeBrowser = (props) => {
    const { connect, loading: connectLoading, error: connectError } = useVSphereConnect();
    const [datacenters, setDatacenters] = consume_shared_module_default_react_17_0_singleton_.useState([]);
    const [connected, setConnected] = consume_shared_module_default_react_17_0_singleton_.useState(false);
    const clusterParams = {
        server: props.server,
        datacenter: props.datacenter,
        secretName: props.secretRef?.name,
        secretNamespace: props.secretRef?.namespace,
        username: props.username,
        password: props.password,
    };
    const { items: clusters, loading: clustersLoading, fetchList: fetchClusters } = useVSphereList('clusters', clusterParams);
    const { items: datastores, loading: dsLoading, fetchList: fetchDatastores } = useVSphereList('datastores', clusterParams);
    const { items: networks, loading: netLoading, fetchList: fetchNetworks } = useVSphereList('networks', clusterParams);
    const { items: resourcePools, loading: rpLoading, fetchList: fetchResourcePools } = useVSphereList('resourcepools', clusterParams);
    const { items: templates, loading: tmplLoading, fetchList: fetchTemplates } = useVSphereList('templates', clusterParams);
    const { items: folders, loading: folderLoading, fetchList: fetchFolders } = useVSphereList('folders', clusterParams);
    const handleConnect = consume_shared_module_default_react_17_0_singleton_.useCallback(async () => {
        const result = await connect({
            server: props.server,
            username: props.username,
            password: props.password,
            secretRef: props.secretRef,
        });
        if (result?.datacenters?.length) {
            setDatacenters(result.datacenters);
            setConnected(true);
            props.onConnectSuccess?.(result.datacenters);
            if (result.datacenters.length && !props.datacenter) {
                props.onDatacenterChange(result.datacenters[0]);
            }
        }
    }, [connect, props]);
    consume_shared_module_default_react_17_0_singleton_.useEffect(() => {
        if (connected && props.datacenter) {
            fetchClusters();
            fetchDatastores();
            fetchNetworks();
            fetchResourcePools();
            fetchTemplates();
            fetchFolders();
        }
    }, [connected, props.datacenter, fetchClusters, fetchDatastores, fetchNetworks, fetchResourcePools, fetchTemplates, fetchFolders]);
    return ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [!connected && ((0,jsx_runtime.jsxs)(Form_index_js_.FormGroup, { label: "Connect to vCenter", fieldId: "vsphere-connect", children: [(0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "secondary", onClick: handleConnect, isDisabled: connectLoading || !props.server, children: connectLoading ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(Spinner_index_js_.Spinner, { size: "sm", className: "pf-v5-u-mr-sm" }), " Connecting..."] })) : ('Test connection & load datacenters') }), connectError && ((0,jsx_runtime.jsx)(Alert_index_js_.Alert, { variant: "danger", title: connectError, isInline: true, className: "pf-v5-u-mt-sm" }))] })), connected && ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Datacenter", isRequired: true, fieldId: "vsphere-datacenter", children: (0,jsx_runtime.jsxs)(FormSelect_index_js_.FormSelect, { id: "vsphere-datacenter", value: props.datacenter, onChange: (_e, v) => props.onDatacenterChange(v), "aria-label": "Datacenter", children: [(0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: "", label: "Select datacenter" }), datacenters.map((dc) => ((0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: dc, label: dc }, dc)))] }) }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Compute cluster", isRequired: true, fieldId: "vsphere-cluster", children: (0,jsx_runtime.jsxs)(FormSelect_index_js_.FormSelect, { id: "vsphere-cluster", value: props.cluster, onChange: (_e, v) => props.onClusterChange(v), "aria-label": "Cluster", isDisabled: clustersLoading, children: [(0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: "", label: clustersLoading ? 'Loading...' : 'Select cluster' }), clusters.map((c) => ((0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: c, label: c }, c)))] }) }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Datastore", isRequired: true, fieldId: "vsphere-datastore", children: (0,jsx_runtime.jsxs)(FormSelect_index_js_.FormSelect, { id: "vsphere-datastore", value: props.datastore, onChange: (_e, v) => props.onDatastoreChange(v), "aria-label": "Datastore", isDisabled: dsLoading, children: [(0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: "", label: dsLoading ? 'Loading...' : 'Select datastore' }), datastores.map((d) => ((0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: d, label: d }, d)))] }) }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Network", isRequired: true, fieldId: "vsphere-network", children: (0,jsx_runtime.jsxs)(FormSelect_index_js_.FormSelect, { id: "vsphere-network", value: props.network, onChange: (_e, v) => props.onNetworkChange(v), "aria-label": "Network", isDisabled: netLoading, children: [(0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: "", label: netLoading ? 'Loading...' : 'Select network' }), networks.map((n) => ((0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: n, label: n }, n)))] }) }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Resource pool", fieldId: "vsphere-resource-pool", children: (0,jsx_runtime.jsxs)(FormSelect_index_js_.FormSelect, { id: "vsphere-resource-pool", value: props.resourcePool, onChange: (_e, v) => props.onResourcePoolChange(v), "aria-label": "Resource pool", isDisabled: rpLoading, children: [(0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: "", label: rpLoading ? 'Loading...' : 'Select resource pool' }), resourcePools.map((rp) => ((0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: rp, label: rp }, rp)))] }) }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Template (RHCOS)", isRequired: true, fieldId: "vsphere-template", children: (0,jsx_runtime.jsxs)(FormSelect_index_js_.FormSelect, { id: "vsphere-template", value: props.template, onChange: (_e, v) => props.onTemplateChange(v), "aria-label": "Template", isDisabled: tmplLoading, children: [(0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: "", label: tmplLoading ? 'Loading...' : 'Select template' }), templates.map((t) => ((0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: t, label: t }, t)))] }) }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Folder", fieldId: "vsphere-folder", children: (0,jsx_runtime.jsxs)(FormSelect_index_js_.FormSelect, { id: "vsphere-folder", value: props.folder, onChange: (_e, v) => props.onFolderChange(v), "aria-label": "Folder", isDisabled: folderLoading, children: [(0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: "", label: folderLoading ? 'Loading...' : 'Select folder' }), folders.map((f) => ((0,jsx_runtime.jsx)(FormSelect_index_js_.FormSelectOption, { value: f, label: f }, f)))] }) })] }))] }));
};

;// ./src/app/components/wizard/FailureDomainStep.tsx






















const emptyFailureDomain = () => ({
    name: '',
    region: '',
    zone: '',
    server: '',
    topology: {
        datacenter: '',
        computeCluster: '',
        datastore: '',
        networks: [],
        template: '',
        folder: '',
    },
});
const FailureDomainStep = (props) => {
    const addDomain = () => {
        props.onFailureDomainsChange([
            ...props.failureDomains,
            { ...emptyFailureDomain(), server: props.server },
        ]);
    };
    const removeDomain = (index) => {
        props.onFailureDomainsChange(props.failureDomains.filter((_, i) => i !== index));
    };
    const updateDomain = (index, fd) => {
        const next = [...props.failureDomains];
        next[index] = fd;
        props.onFailureDomainsChange(next);
    };
    if (props.failureDomains.length === 0) {
        return ((0,jsx_runtime.jsxs)(Stack_index_js_.Stack, { hasGutter: true, children: [(0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsxs)(EmptyState_index_js_.EmptyState, { children: [(0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateHeader, { titleText: "No failure domains configured", headingLevel: "h4", icon: (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateIcon, { icon: cubes_icon_js_.CubesIcon }) }), (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateBody, { children: "Connect to the target vCenter and add at least one failure domain to define the datacenter, cluster, datastore, and network topology for the migration." }), (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateFooter, { children: (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateActions, { children: (0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "primary", icon: (0,jsx_runtime.jsx)(plus_circle_icon_js_.PlusCircleIcon, {}), onClick: addDomain, children: "Add failure domain" }) }) })] }) }), (0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsx)(VSphereTreeBrowser, { server: props.server, username: props.username, password: props.password, secretRef: props.secretRef, datacenter: "", onDatacenterChange: () => { }, cluster: "", onClusterChange: () => { }, datastore: "", onDatastoreChange: () => { }, network: "", onNetworkChange: () => { }, resourcePool: "", onResourcePoolChange: () => { }, template: "", onTemplateChange: () => { }, folder: "", onFolderChange: () => { }, onConnectSuccess: () => {
                            props.onFailureDomainsChange([{ ...emptyFailureDomain(), server: props.server }]);
                        } }) })] }));
    }
    return ((0,jsx_runtime.jsxs)(Stack_index_js_.Stack, { hasGutter: true, children: [(0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "secondary", icon: (0,jsx_runtime.jsx)(plus_circle_icon_js_.PlusCircleIcon, {}), onClick: addDomain, children: "Add failure domain" }) }), props.failureDomains.map((fd, index) => ((0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsxs)(Card_index_js_.Card, { isCompact: true, children: [(0,jsx_runtime.jsx)(Card_index_js_.CardHeader, { actions: {
                                actions: ((0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "plain", icon: (0,jsx_runtime.jsx)(trash_icon_js_.TrashIcon, {}), onClick: () => removeDomain(index), "aria-label": "Remove failure domain" })),
                            }, children: (0,jsx_runtime.jsxs)(Card_index_js_.CardTitle, { children: ["Failure domain ", index + 1, fd.name ? `: ${fd.name}` : ''] }) }), (0,jsx_runtime.jsx)(Card_index_js_.CardBody, { children: (0,jsx_runtime.jsxs)(Form_index_js_.Form, { children: [(0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Name", isRequired: true, fieldId: `fd-name-${index}`, children: (0,jsx_runtime.jsx)(TextInput_index_js_.TextInput, { id: `fd-name-${index}`, value: fd.name, onChange: (_e, v) => updateDomain(index, { ...fd, name: v }), placeholder: "fd-1" }) }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Region", isRequired: true, fieldId: `fd-region-${index}`, children: (0,jsx_runtime.jsx)(TextInput_index_js_.TextInput, { id: `fd-region-${index}`, value: fd.region, onChange: (_e, v) => updateDomain(index, { ...fd, region: v }), placeholder: "region1" }) }), (0,jsx_runtime.jsx)(Form_index_js_.FormGroup, { label: "Zone", isRequired: true, fieldId: `fd-zone-${index}`, children: (0,jsx_runtime.jsx)(TextInput_index_js_.TextInput, { id: `fd-zone-${index}`, value: fd.zone, onChange: (_e, v) => updateDomain(index, { ...fd, zone: v }), placeholder: "zone1" }) }), (0,jsx_runtime.jsx)(VSphereTreeBrowser, { server: props.server, username: props.username, password: props.password, secretRef: props.secretRef, datacenter: fd.topology.datacenter, onDatacenterChange: (v) => updateDomain(index, {
                                            ...fd,
                                            topology: { ...fd.topology, datacenter: v },
                                        }), cluster: fd.topology.computeCluster, onClusterChange: (v) => updateDomain(index, {
                                            ...fd,
                                            topology: { ...fd.topology, computeCluster: v },
                                        }), datastore: fd.topology.datastore, onDatastoreChange: (v) => updateDomain(index, {
                                            ...fd,
                                            topology: { ...fd.topology, datastore: v },
                                        }), network: fd.topology.networks?.[0] ?? '', onNetworkChange: (v) => updateDomain(index, {
                                            ...fd,
                                            topology: {
                                                ...fd.topology,
                                                networks: v ? [v] : [],
                                            },
                                        }), resourcePool: fd.topology.resourcePool ?? '', onResourcePoolChange: (v) => updateDomain(index, {
                                            ...fd,
                                            topology: { ...fd.topology, resourcePool: v || undefined },
                                        }), template: fd.topology.template, onTemplateChange: (v) => updateDomain(index, {
                                            ...fd,
                                            topology: { ...fd.topology, template: v },
                                        }), folder: fd.topology.folder ?? '', onFolderChange: (v) => updateDomain(index, {
                                            ...fd,
                                            topology: { ...fd.topology, folder: v || undefined },
                                        }) })] }) })] }) }, index)))] }));
};

// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/DescriptionList@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/DescriptionList/index.js)
var DescriptionList_index_js_ = __webpack_require__(7472);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Text@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Text/index.js)
var Text_index_js_ = __webpack_require__(208);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Divider@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Divider/index.js)
var Divider_index_js_ = __webpack_require__(2832);
;// ./src/app/components/wizard/ReviewStep.tsx
















const ReviewStep = ({ migration }) => ((0,jsx_runtime.jsxs)(Stack_index_js_.Stack, { hasGutter: true, children: [(0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsx)(Text_index_js_.TextContent, { children: (0,jsx_runtime.jsx)(Text_index_js_.Text, { component: Text_index_js_.TextVariants.p, children: "Review the migration configuration before creating the resource." }) }) }), (0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsxs)(Card_index_js_.Card, { isPlain: true, isCompact: true, children: [(0,jsx_runtime.jsx)(Card_index_js_.CardTitle, { children: "General" }), (0,jsx_runtime.jsx)(Card_index_js_.CardBody, { children: (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionList, { isHorizontal: true, termWidth: "12ch", children: [(0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Name" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: migration.metadata.name })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Namespace" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: migration.metadata.namespace })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "State" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: (0,jsx_runtime.jsx)(Label_index_js_.Label, { color: "blue", children: migration.spec.state }) })] })] }) })] }) }), (0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsx)(Divider_index_js_.Divider, {}) }), (0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsxs)(Card_index_js_.Card, { isPlain: true, isCompact: true, children: [(0,jsx_runtime.jsx)(Card_index_js_.CardTitle, { children: "Credentials" }), (0,jsx_runtime.jsx)(Card_index_js_.CardBody, { children: (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionList, { isHorizontal: true, termWidth: "12ch", children: [(0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Secret name" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: migration.spec.targetVCenterCredentialsSecret.name || '(not set)' })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Secret namespace" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: migration.spec.targetVCenterCredentialsSecret.namespace || '(default)' })] })] }) })] }) }), migration.spec.failureDomains?.length > 0 && ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsx)(Divider_index_js_.Divider, {}) }), (0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsx)(Text_index_js_.TextContent, { children: (0,jsx_runtime.jsxs)(Text_index_js_.Text, { component: Text_index_js_.TextVariants.h3, children: ["Failure domains (", migration.spec.failureDomains.length, ")"] }) }) }), migration.spec.failureDomains.map((fd, i) => ((0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsxs)(Card_index_js_.Card, { isCompact: true, children: [(0,jsx_runtime.jsx)(Card_index_js_.CardTitle, { children: fd.name || `Failure domain ${i + 1}` }), (0,jsx_runtime.jsx)(Card_index_js_.CardBody, { children: (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionList, { isHorizontal: true, isCompact: true, termWidth: "14ch", children: [(0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Server" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: fd.server || '-' })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Region" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: fd.region || '-' })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Zone" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: fd.zone || '-' })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Datacenter" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: fd.topology.datacenter || '-' })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Compute cluster" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: fd.topology.computeCluster || '-' })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Datastore" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: fd.topology.datastore || '-' })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Network" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: fd.topology.networks?.join(', ') || '-' })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Template" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: fd.topology.template || '-' })] }), fd.topology.folder && ((0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Folder" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: fd.topology.folder })] })), fd.topology.resourcePool && ((0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Resource pool" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: fd.topology.resourcePool })] }))] }) })] }) }, i)))] }))] }));

;// ./src/app/pages/MigrationWizard.tsx
















const CreateMigrationFooter = ({ onCreate, isCreating }) => {
    const { goToPrevStep, close } = (0,Wizard_index_js_.useWizardContext)();
    return ((0,jsx_runtime.jsxs)(Wizard_index_js_.WizardFooterWrapper, { children: [(0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "primary", onClick: onCreate, isLoading: isCreating, isDisabled: isCreating, children: "Create migration" }), (0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "secondary", onClick: goToPrevStep, isDisabled: isCreating, children: "Back" }), (0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "link", onClick: close, isDisabled: isCreating, children: "Cancel" })] }));
};
const MigrationWizard = () => {
    const history = (0,consume_shared_module_default_react_router_dom_5_singleton_.useHistory)();
    const [migrationName, setMigrationName] = consume_shared_module_default_react_17_0_singleton_.useState('');
    const [migrationNamespace, setMigrationNamespace] = consume_shared_module_default_react_17_0_singleton_.useState('default');
    const [server, setServer] = consume_shared_module_default_react_17_0_singleton_.useState('');
    const [username, setUsername] = consume_shared_module_default_react_17_0_singleton_.useState('');
    const [password, setPassword] = consume_shared_module_default_react_17_0_singleton_.useState('');
    const [useSecretRef, setUseSecretRef] = consume_shared_module_default_react_17_0_singleton_.useState(false);
    const [secretName, setSecretName] = consume_shared_module_default_react_17_0_singleton_.useState('');
    const [secretNamespace, setSecretNamespace] = consume_shared_module_default_react_17_0_singleton_.useState('openshift-config');
    const [createSecret, setCreateSecret] = consume_shared_module_default_react_17_0_singleton_.useState(false);
    const [failureDomains, setFailureDomains] = consume_shared_module_default_react_17_0_singleton_.useState([]);
    const [createError, setCreateError] = consume_shared_module_default_react_17_0_singleton_.useState(null);
    const [isCreating, setIsCreating] = consume_shared_module_default_react_17_0_singleton_.useState(false);
    const buildMigration = consume_shared_module_default_react_17_0_singleton_.useCallback(() => ({
        apiVersion: `${VmwareCloudFoundationMigrationModel.apiGroup}/${VmwareCloudFoundationMigrationModel.apiVersion}`,
        kind: VmwareCloudFoundationMigrationModel.kind,
        metadata: {
            name: migrationName || 'vcf-migration',
            namespace: migrationNamespace,
        },
        spec: {
            state: 'Pending',
            targetVCenterCredentialsSecret: {
                name: useSecretRef ? secretName : (createSecret ? `${migrationName}-vcenter-creds` : secretName),
                namespace: useSecretRef ? secretNamespace : (createSecret ? migrationNamespace : secretNamespace),
            },
            failureDomains,
        },
    }), [migrationName, migrationNamespace, useSecretRef, secretName, secretNamespace, createSecret, failureDomains]);
    const handleCreate = consume_shared_module_default_react_17_0_singleton_.useCallback(async () => {
        setCreateError(null);
        setIsCreating(true);
        const obj = buildMigration();
        try {
            await (0,dynamic_plugin_sdk_1_8_singleton_.k8sCreate)({
                model: VmwareCloudFoundationMigrationModel,
                data: obj,
            });
            history.push(`/vcf-migration/ns/${obj.metadata.namespace}/${obj.metadata.name}`);
        }
        catch (e) {
            setCreateError(e instanceof Error ? e.message : String(e));
        }
        finally {
            setIsCreating(false);
        }
    }, [buildMigration, history]);
    const handleClose = consume_shared_module_default_react_17_0_singleton_.useCallback(() => {
        history.push('/vcf-migration');
    }, [history]);
    return ((0,jsx_runtime.jsx)(index_js_.PageSection, { isFilled: true, padding: { default: 'noPadding' }, children: (0,jsx_runtime.jsxs)(Wizard_index_js_.Wizard, { header: (0,jsx_runtime.jsx)(Wizard_index_js_.WizardHeader, { title: "Create VCF Migration", description: "Configure target vCenter credentials and failure domains for the migration", onClose: handleClose, closeButtonAriaLabel: "Close wizard" }), onClose: handleClose, children: [(0,jsx_runtime.jsx)(Wizard_index_js_.WizardStep, { name: "Credentials", id: "credentials", children: (0,jsx_runtime.jsx)(CredentialsStep, { server: server, onServerChange: setServer, username: username, onUsernameChange: setUsername, password: password, onPasswordChange: setPassword, useSecretRef: useSecretRef, onUseSecretRefChange: setUseSecretRef, secretName: secretName, onSecretNameChange: setSecretName, secretNamespace: secretNamespace, onSecretNamespaceChange: setSecretNamespace, createSecret: createSecret, onCreateSecretChange: setCreateSecret, migrationName: migrationName, migrationNamespace: migrationNamespace, onMigrationNameChange: setMigrationName, onMigrationNamespaceChange: setMigrationNamespace }) }), (0,jsx_runtime.jsx)(Wizard_index_js_.WizardStep, { name: "Failure domains", id: "failure-domains", children: (0,jsx_runtime.jsx)(FailureDomainStep, { server: server, username: username, password: password, secretRef: useSecretRef ? { name: secretName, namespace: secretNamespace } : undefined, failureDomains: failureDomains, onFailureDomainsChange: setFailureDomains }) }), (0,jsx_runtime.jsxs)(Wizard_index_js_.WizardStep, { name: "Review", id: "review", footer: (0,jsx_runtime.jsx)(CreateMigrationFooter, { onCreate: handleCreate, isCreating: isCreating }), children: [createError && ((0,jsx_runtime.jsx)(Alert_index_js_.Alert, { variant: "danger", title: "Migration creation failed", isInline: true, className: "pf-v5-u-mb-md", children: createError })), (0,jsx_runtime.jsx)(ReviewStep, { migration: buildMigration() })] })] }) }));
};

// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/Breadcrumb@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/Breadcrumb/index.js)
var Breadcrumb_index_js_ = __webpack_require__(9592);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/ProgressStepper@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/ProgressStepper/index.js)
var ProgressStepper_index_js_ = __webpack_require__(9396);
// EXTERNAL MODULE: consume shared module (default) @patternfly/react-icons/dist/dynamic/icons/info-circle-icon@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-icons/dist/esm/icons/info-circle-icon.js)
var info_circle_icon_js_ = __webpack_require__(1769);
;// ./src/app/hooks/useMigrationEvents.ts

function useMigrationEvents(namespace, name) {
    const [events, setEvents] = (0,consume_shared_module_default_react_17_0_singleton_.useState)([]);
    const [error, setError] = (0,consume_shared_module_default_react_17_0_singleton_.useState)(null);
    const eventSourceRef = (0,consume_shared_module_default_react_17_0_singleton_.useRef)(null);
    (0,consume_shared_module_default_react_17_0_singleton_.useEffect)(() => {
        if (!namespace || !name) {
            setEvents([]);
            return;
        }
        const url = `/api/proxy/plugin/vcf-migration-console/vcf-migration-api/events?namespace=${encodeURIComponent(namespace)}&name=${encodeURIComponent(name)}`;
        const es = new EventSource(url);
        eventSourceRef.current = es;
        es.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                setEvents((prev) => {
                    const next = [...prev];
                    const idx = next.findIndex((ev) => ev.reason === data.reason &&
                        ev.message === data.message &&
                        ev.lastTimestamp === data.lastTimestamp);
                    if (idx >= 0) {
                        next[idx] = data;
                    }
                    else {
                        next.unshift(data);
                    }
                    return next.slice(0, 100);
                });
            }
            catch {
                // ignore parse errors
            }
        };
        es.onerror = () => {
            setError('Event stream connection failed');
        };
        return () => {
            es.close();
            eventSourceRef.current = null;
        };
    }, [namespace, name]);
    return { events, error };
}

;// ./src/app/components/EventStream.tsx
















const formatTimestamp = (ts) => {
    if (!ts)
        return '-';
    const d = new Date(ts);
    return d.toLocaleString();
};
const getEventColor = (type) => {
    switch (type) {
        case 'Normal':
            return 'blue';
        case 'Warning':
            return 'orange';
        default:
            return 'grey';
    }
};
const EventStream = (props) => {
    const { events, error } = useMigrationEvents(props.namespace, props.name);
    if (error) {
        return ((0,jsx_runtime.jsx)(Alert_index_js_.Alert, { variant: "warning", title: "Event stream unavailable", isInline: true, children: error }));
    }
    if (events.length === 0) {
        return ((0,jsx_runtime.jsxs)(EmptyState_index_js_.EmptyState, { children: [(0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateHeader, { titleText: "No events", headingLevel: "h4", icon: (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateIcon, { icon: info_circle_icon_js_.InfoCircleIcon }) }), (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateBody, { children: "No events have been recorded for this migration yet." })] }));
    }
    return ((0,jsx_runtime.jsxs)(Table_index_js_.Table, { "aria-label": "Migration events", variant: "compact", children: [(0,jsx_runtime.jsx)(Table_index_js_.Thead, { children: (0,jsx_runtime.jsxs)(Table_index_js_.Tr, { children: [(0,jsx_runtime.jsx)(Table_index_js_.Th, { children: "Type" }), (0,jsx_runtime.jsx)(Table_index_js_.Th, { children: "Reason" }), (0,jsx_runtime.jsx)(Table_index_js_.Th, { children: "Message" }), (0,jsx_runtime.jsx)(Table_index_js_.Th, { children: "Last seen" }), (0,jsx_runtime.jsx)(Table_index_js_.Th, { children: "Count" })] }) }), (0,jsx_runtime.jsx)(Table_index_js_.Tbody, { children: events.map((ev, i) => ((0,jsx_runtime.jsxs)(Table_index_js_.Tr, { children: [(0,jsx_runtime.jsx)(Table_index_js_.Td, { dataLabel: "Type", children: (0,jsx_runtime.jsx)(Label_index_js_.Label, { color: getEventColor(ev.type), isCompact: true, children: ev.type }) }), (0,jsx_runtime.jsx)(Table_index_js_.Td, { dataLabel: "Reason", children: ev.reason }), (0,jsx_runtime.jsx)(Table_index_js_.Td, { dataLabel: "Message", children: ev.message }), (0,jsx_runtime.jsx)(Table_index_js_.Td, { dataLabel: "Last seen", children: formatTimestamp(ev.lastTimestamp) }), (0,jsx_runtime.jsx)(Table_index_js_.Td, { dataLabel: "Count", children: ev.count })] }, `${ev.lastTimestamp}-${ev.reason}-${i}`))) })] }));
};

// EXTERNAL MODULE: consume shared module (default) @patternfly/react-core/dist/dynamic/components/ExpandableSection@^5.0.0 (strict) (fallback: ./node_modules/@patternfly/react-core/dist/esm/components/ExpandableSection/index.js)
var ExpandableSection_index_js_ = __webpack_require__(8408);
;// ./src/app/components/MachineTopologyView.tsx


















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
const machineAPINamespace = 'openshift-machine-api';
const getPhaseColor = (phase) => {
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
const MachineTopologyView = () => {
    const [machineSets, msLoaded] = (0,dynamic_plugin_sdk_1_8_singleton_.useK8sWatchResource)({
        groupVersionKind: machineSetGVK,
        namespace: machineAPINamespace,
        isList: true,
        namespaced: true,
    });
    const [machines, mLoaded] = (0,dynamic_plugin_sdk_1_8_singleton_.useK8sWatchResource)({
        groupVersionKind: machineGVK,
        namespace: machineAPINamespace,
        isList: true,
        namespaced: true,
    });
    const [nodes, nLoaded] = (0,dynamic_plugin_sdk_1_8_singleton_.useK8sWatchResource)({
        groupVersionKind: nodeGVK,
        isList: true,
        namespaced: false,
    });
    const loaded = msLoaded && mLoaded && nLoaded;
    const nodeMap = consume_shared_module_default_react_17_0_singleton_.useMemo(() => {
        const m = {};
        nodes?.forEach((n) => {
            m[n.metadata.name] = n;
        });
        return m;
    }, [nodes]);
    const getNodeReady = (nodeName) => {
        const node = nodeMap[nodeName];
        if (!node?.status?.conditions)
            return 'Unknown';
        const ready = node.status.conditions.find((c) => c.type === 'Ready');
        return ready?.status ?? 'Unknown';
    };
    if (!loaded) {
        return ((0,jsx_runtime.jsx)(Bullseye_index_js_.Bullseye, { children: (0,jsx_runtime.jsx)(Spinner_index_js_.Spinner, { size: "lg", "aria-label": "Loading machine topology" }) }));
    }
    if (!machineSets?.length) {
        return ((0,jsx_runtime.jsxs)(EmptyState_index_js_.EmptyState, { children: [(0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateHeader, { titleText: "No MachineSets found", headingLevel: "h4", icon: (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateIcon, { icon: cubes_icon_js_.CubesIcon }) }), (0,jsx_runtime.jsx)(EmptyState_index_js_.EmptyStateBody, { children: "No MachineSets were found in the openshift-machine-api namespace." })] }));
    }
    return ((0,jsx_runtime.jsx)(Stack_index_js_.Stack, { hasGutter: true, children: machineSets.map((ms) => {
            const msMachines = machines?.filter((m) => m.metadata.labels?.['machine.openshift.io/cluster-api-machineset'] === ms.metadata.name) ?? [];
            const desired = ms.spec.replicas ?? 0;
            const ready = ms.status?.readyReplicas ?? 0;
            return ((0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsx)(ExpandableSection_index_js_.ExpandableSection, { toggleContent: (0,jsx_runtime.jsxs)("span", { children: [(0,jsx_runtime.jsx)("strong", { children: ms.metadata.name }), ' ', (0,jsx_runtime.jsxs)(Label_index_js_.Label, { color: ready === desired ? 'green' : 'blue', isCompact: true, children: [ready, "/", desired, " ready"] })] }), isExpanded: true, children: (0,jsx_runtime.jsxs)("div", { className: "pf-v5-u-pl-lg pf-v5-u-pt-sm", children: [(0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionList, { isCompact: true, isHorizontal: true, children: [(0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Desired replicas" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: desired })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Ready replicas" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: ready })] })] }), (0,jsx_runtime.jsxs)("div", { className: "pf-v5-u-mt-md", children: [(0,jsx_runtime.jsx)("strong", { children: "Machines" }), msMachines.length === 0 && ((0,jsx_runtime.jsx)("div", { className: "pf-v5-u-color-200 pf-v5-u-mt-sm", children: "No machines" })), (0,jsx_runtime.jsx)(Stack_index_js_.Stack, { className: "pf-v5-u-mt-sm", children: msMachines.map((m) => ((0,jsx_runtime.jsxs)(Stack_index_js_.StackItem, { className: "pf-v5-u-pl-md pf-v5-u-pb-sm", style: { borderLeft: '2px solid var(--pf-v5-global--BorderColor--100)' }, children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("strong", { children: m.metadata.name }), ' ', (0,jsx_runtime.jsx)(Label_index_js_.Label, { color: getPhaseColor(m.status?.phase ?? ''), isCompact: true, children: m.status?.phase ?? 'Unknown' })] }), m.status?.nodeRef && ((0,jsx_runtime.jsxs)("div", { className: "pf-v5-u-font-size-sm pf-v5-u-mt-xs", children: ["Node: ", m.status.nodeRef.name, ' ', (0,jsx_runtime.jsx)(Label_index_js_.Label, { color: getNodeReady(m.status.nodeRef.name) === 'True' ? 'green' : 'red', isCompact: true, children: getNodeReady(m.status.nodeRef.name) === 'True' ? 'Ready' : 'Not Ready' })] }))] }, m.metadata.name))) })] })] }) }) }, ms.metadata.name));
        }) }));
};

;// ./src/app/pages/MigrationDetailPage.tsx


























const MigrationDetailPage_migrationGVK = {
    group: 'migration.openshift.io',
    version: 'v1alpha1',
    kind: 'VmwareCloudFoundationMigration',
};
const conditionOrder = [
    'InfrastructurePrepared',
    'DestinationInitialized',
    'MultiSiteConfigured',
    'WorkloadMigrated',
    'SourceCleaned',
    'Ready',
];
const conditionLabels = {
    InfrastructurePrepared: 'Infrastructure prepared',
    DestinationInitialized: 'Destination initialized',
    MultiSiteConfigured: 'Multi-site configured',
    WorkloadMigrated: 'Workload migrated',
    SourceCleaned: 'Source cleaned',
    Ready: 'Ready',
};
const MigrationDetailPage = () => {
    const { ns, name } = (0,consume_shared_module_default_react_router_dom_5_singleton_.useParams)();
    const history = (0,consume_shared_module_default_react_router_dom_5_singleton_.useHistory)();
    const [migration, loaded, loadError] = (0,dynamic_plugin_sdk_1_8_singleton_.useK8sWatchResource)(ns && name
        ? {
            groupVersionKind: MigrationDetailPage_migrationGVK,
            name,
            namespace: ns,
            namespaced: true,
            isList: false,
        }
        : null);
    if (!ns || !name) {
        return ((0,jsx_runtime.jsxs)(index_js_.PageSection, { children: [(0,jsx_runtime.jsx)(Title_index_js_.Title, { headingLevel: "h1", children: "Migration not found" }), (0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "link", onClick: () => history.push('/vcf-migration'), children: "Back to list" })] }));
    }
    if (loadError) {
        return ((0,jsx_runtime.jsxs)(index_js_.PageSection, { children: [(0,jsx_runtime.jsx)(Alert_index_js_.Alert, { variant: "danger", title: "Error loading migration", isInline: true, children: String(loadError) }), (0,jsx_runtime.jsx)(Button_index_js_.Button, { variant: "link", onClick: () => history.push('/vcf-migration'), className: "pf-v5-u-mt-md", children: "Back to list" })] }));
    }
    if (!loaded || !migration) {
        return ((0,jsx_runtime.jsx)(Bullseye_index_js_.Bullseye, { children: (0,jsx_runtime.jsx)(Spinner_index_js_.Spinner, { size: "xl", "aria-label": "Loading migration" }) }));
    }
    const getCondition = (type) => migration.status?.conditions?.find((c) => c.type === type);
    const isConditionTrue = (type) => getCondition(type)?.status === 'True';
    const getStateColor = (state) => {
        switch (state) {
            case 'Running':
                return 'blue';
            case 'Paused':
                return 'orange';
            default:
                return 'grey';
        }
    };
    return ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)(index_js_.PageSection, { variant: "light", children: [(0,jsx_runtime.jsxs)(Breadcrumb_index_js_.Breadcrumb, { children: [(0,jsx_runtime.jsx)(Breadcrumb_index_js_.BreadcrumbItem, { onClick: () => history.push('/vcf-migration'), children: "Migrations" }), (0,jsx_runtime.jsx)(Breadcrumb_index_js_.BreadcrumbItem, { isActive: true, children: migration.metadata.name })] }), (0,jsx_runtime.jsx)(Title_index_js_.Title, { headingLevel: "h1", className: "pf-v5-u-mt-sm", children: migration.metadata.name }), (0,jsx_runtime.jsx)(Label_index_js_.Label, { color: getStateColor(migration.spec.state), className: "pf-v5-u-mt-sm", children: migration.spec.state })] }), (0,jsx_runtime.jsx)(index_js_.PageSection, { children: (0,jsx_runtime.jsxs)(Stack_index_js_.Stack, { hasGutter: true, children: [(0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsxs)(Card_index_js_.Card, { children: [(0,jsx_runtime.jsx)(Card_index_js_.CardTitle, { children: "Overview" }), (0,jsx_runtime.jsx)(Card_index_js_.CardBody, { children: (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionList, { isHorizontal: true, columnModifier: { default: '2Col' }, children: [(0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Namespace" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: migration.metadata.namespace })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "State" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: (0,jsx_runtime.jsx)(Label_index_js_.Label, { color: getStateColor(migration.spec.state), children: migration.spec.state }) })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Start time" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: migration.status?.startTime
                                                                ? new Date(migration.status.startTime).toLocaleString()
                                                                : '-' })] }), (0,jsx_runtime.jsxs)(DescriptionList_index_js_.DescriptionListGroup, { children: [(0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListTerm, { children: "Completion time" }), (0,jsx_runtime.jsx)(DescriptionList_index_js_.DescriptionListDescription, { children: migration.status?.completionTime
                                                                ? new Date(migration.status.completionTime).toLocaleString()
                                                                : '-' })] })] }) })] }) }), (0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsxs)(Card_index_js_.Card, { children: [(0,jsx_runtime.jsx)(Card_index_js_.CardTitle, { children: "Migration progress" }), (0,jsx_runtime.jsx)(Card_index_js_.CardBody, { children: (0,jsx_runtime.jsx)(ProgressStepper_index_js_.ProgressStepper, { isVertical: true, children: conditionOrder.map((type) => {
                                                const cond = getCondition(type);
                                                const isDone = isConditionTrue(type);
                                                const isCurrent = cond?.status === 'False' &&
                                                    cond?.reason !== 'Failed';
                                                let variant = 'default';
                                                if (isDone)
                                                    variant = 'success';
                                                else if (cond?.reason === 'Failed')
                                                    variant = 'danger';
                                                else if (isCurrent)
                                                    variant = 'info';
                                                return ((0,jsx_runtime.jsx)(ProgressStepper_index_js_.ProgressStep, { variant: variant, id: type, titleId: `${type}-title`, "aria-label": conditionLabels[type] || type, description: cond?.message ?? (isDone ? 'Complete' : 'Pending'), children: conditionLabels[type] || type }, type));
                                            }) }) })] }) }), (0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsxs)(Card_index_js_.Card, { children: [(0,jsx_runtime.jsx)(Card_index_js_.CardTitle, { children: "Events" }), (0,jsx_runtime.jsx)(Card_index_js_.CardBody, { children: (0,jsx_runtime.jsx)(EventStream, { namespace: ns, name: name }) })] }) }), (migration.spec.state === 'Running' || isConditionTrue('WorkloadMigrated')) && ((0,jsx_runtime.jsx)(Stack_index_js_.StackItem, { children: (0,jsx_runtime.jsxs)(Card_index_js_.Card, { children: [(0,jsx_runtime.jsx)(Card_index_js_.CardTitle, { children: "Machine topology" }), (0,jsx_runtime.jsx)(Card_index_js_.CardBody, { children: (0,jsx_runtime.jsx)(MachineTopologyView, { namespace: ns }) })] }) }))] }) })] }));
};

;// ./src/app/index.ts






/***/ }

}]);
//# sourceMappingURL=exposed-migrationPlugin.chunk.js.map