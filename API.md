# CDK8s Pipelines

This is a construct for creating [Pipelines](https://tekton.dev/docs/getting-started/pipelines/)
using [cdk8s](https://cdk8s.io/docs/latest/).

## Examples

```typescript
const pipeline = new Pipeline(this, 'my-pipeline');
```

## Related projects

This is the core project with the basic Pipeline constructs. There are other
constructs that use this construct to develop richer pipelines and tasks that
are based on tasks available in [Tekton Hub](https://hub.tekton.dev/).

* [cdk8s-pipelines-cdk](TODO) - A construct that allows you to easily create
 Tekton pipelines that use [AWS CDK](https://aws.amazon.com/cdk/) projects from
 GitHub to deploy CDK resources to an AWS account.

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Pipeline <a name="Pipeline" id="cdk8s-pipelines.Pipeline"></a>

#### Initializers <a name="Initializers" id="cdk8s-pipelines.Pipeline.Initializer"></a>

```typescript
import { Pipeline } from 'cdk8s-pipelines'

new Pipeline(scope: Construct, id: string, props?: PipelineProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.Pipeline.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | the scope in which to define this object. |
| <code><a href="#cdk8s-pipelines.Pipeline.Initializer.parameter.id">id</a></code> | <code>string</code> | a scope-local name for the object. |
| <code><a href="#cdk8s-pipelines.Pipeline.Initializer.parameter.props">props</a></code> | <code><a href="#cdk8s-pipelines.PipelineProps">PipelineProps</a></code> | initialization props. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk8s-pipelines.Pipeline.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

the scope in which to define this object.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk8s-pipelines.Pipeline.Initializer.parameter.id"></a>

- *Type:* string

a scope-local name for the object.

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk8s-pipelines.Pipeline.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk8s-pipelines.PipelineProps">PipelineProps</a>

initialization props.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines.Pipeline.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk8s-pipelines.Pipeline.addDependency">addDependency</a></code> | Create a dependency between this ApiObject and other constructs. |
| <code><a href="#cdk8s-pipelines.Pipeline.addJsonPatch">addJsonPatch</a></code> | Applies a set of RFC-6902 JSON-Patch operations to the manifest synthesized for this API object. |
| <code><a href="#cdk8s-pipelines.Pipeline.toJson">toJson</a></code> | Renders the object to Kubernetes JSON. |
| <code><a href="#cdk8s-pipelines.Pipeline.addStringParam">addStringParam</a></code> | *No description.* |
| <code><a href="#cdk8s-pipelines.Pipeline.addTask">addTask</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="cdk8s-pipelines.Pipeline.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addDependency` <a name="addDependency" id="cdk8s-pipelines.Pipeline.addDependency"></a>

```typescript
public addDependency(dependencies: IConstruct): void
```

Create a dependency between this ApiObject and other constructs.

These can be other ApiObjects, Charts, or custom.

###### `dependencies`<sup>Required</sup> <a name="dependencies" id="cdk8s-pipelines.Pipeline.addDependency.parameter.dependencies"></a>

- *Type:* constructs.IConstruct

the dependencies to add.

---

##### `addJsonPatch` <a name="addJsonPatch" id="cdk8s-pipelines.Pipeline.addJsonPatch"></a>

```typescript
public addJsonPatch(ops: JsonPatch): void
```

Applies a set of RFC-6902 JSON-Patch operations to the manifest synthesized for this API object.

*Example*

```typescript
  kubePod.addJsonPatch(JsonPatch.replace('/spec/enableServiceLinks', true));
```


###### `ops`<sup>Required</sup> <a name="ops" id="cdk8s-pipelines.Pipeline.addJsonPatch.parameter.ops"></a>

- *Type:* cdk8s.JsonPatch

The JSON-Patch operations to apply.

---

##### `toJson` <a name="toJson" id="cdk8s-pipelines.Pipeline.toJson"></a>

```typescript
public toJson(): any
```

Renders the object to Kubernetes JSON.

##### `addStringParam` <a name="addStringParam" id="cdk8s-pipelines.Pipeline.addStringParam"></a>

```typescript
public addStringParam(name: string, defaultValue?: string): void
```

###### `name`<sup>Required</sup> <a name="name" id="cdk8s-pipelines.Pipeline.addStringParam.parameter.name"></a>

- *Type:* string

---

###### `defaultValue`<sup>Optional</sup> <a name="defaultValue" id="cdk8s-pipelines.Pipeline.addStringParam.parameter.defaultValue"></a>

- *Type:* string

---

##### `addTask` <a name="addTask" id="cdk8s-pipelines.Pipeline.addTask"></a>

```typescript
public addTask(t: PipelineTaskDef, after?: PipelineTaskDef): void
```

###### `t`<sup>Required</sup> <a name="t" id="cdk8s-pipelines.Pipeline.addTask.parameter.t"></a>

- *Type:* <a href="#cdk8s-pipelines.PipelineTaskDef">PipelineTaskDef</a>

---

###### `after`<sup>Optional</sup> <a name="after" id="cdk8s-pipelines.Pipeline.addTask.parameter.after"></a>

- *Type:* <a href="#cdk8s-pipelines.PipelineTaskDef">PipelineTaskDef</a>

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines.Pipeline.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk8s-pipelines.Pipeline.isApiObject">isApiObject</a></code> | Return whether the given object is an `ApiObject`. |
| <code><a href="#cdk8s-pipelines.Pipeline.of">of</a></code> | Returns the `ApiObject` named `Resource` which is a child of the given construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk8s-pipelines.Pipeline.isConstruct"></a>

```typescript
import { Pipeline } from 'cdk8s-pipelines'

Pipeline.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk8s-pipelines.Pipeline.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isApiObject` <a name="isApiObject" id="cdk8s-pipelines.Pipeline.isApiObject"></a>

```typescript
import { Pipeline } from 'cdk8s-pipelines'

Pipeline.isApiObject(o: any)
```

Return whether the given object is an `ApiObject`.

We do attribute detection since we can't reliably use 'instanceof'.

###### `o`<sup>Required</sup> <a name="o" id="cdk8s-pipelines.Pipeline.isApiObject.parameter.o"></a>

- *Type:* any

The object to check.

---

##### `of` <a name="of" id="cdk8s-pipelines.Pipeline.of"></a>

```typescript
import { Pipeline } from 'cdk8s-pipelines'

Pipeline.of(c: IConstruct)
```

Returns the `ApiObject` named `Resource` which is a child of the given construct.

If `c` is an `ApiObject`, it is returned directly. Throws an
exception if the construct does not have a child named `Default` _or_ if
this child is not an `ApiObject`.

###### `c`<sup>Required</sup> <a name="c" id="cdk8s-pipelines.Pipeline.of.parameter.c"></a>

- *Type:* constructs.IConstruct

The higher-level construct.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.Pipeline.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk8s-pipelines.Pipeline.property.apiGroup">apiGroup</a></code> | <code>string</code> | The group portion of the API version (e.g. `authorization.k8s.io`). |
| <code><a href="#cdk8s-pipelines.Pipeline.property.apiVersion">apiVersion</a></code> | <code>string</code> | The object's API version (e.g. `authorization.k8s.io/v1`). |
| <code><a href="#cdk8s-pipelines.Pipeline.property.chart">chart</a></code> | <code>cdk8s.Chart</code> | The chart in which this object is defined. |
| <code><a href="#cdk8s-pipelines.Pipeline.property.kind">kind</a></code> | <code>string</code> | The object kind. |
| <code><a href="#cdk8s-pipelines.Pipeline.property.metadata">metadata</a></code> | <code>cdk8s.ApiObjectMetadataDefinition</code> | Metadata associated with this API object. |
| <code><a href="#cdk8s-pipelines.Pipeline.property.name">name</a></code> | <code>string</code> | The name of the API object. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk8s-pipelines.Pipeline.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `apiGroup`<sup>Required</sup> <a name="apiGroup" id="cdk8s-pipelines.Pipeline.property.apiGroup"></a>

```typescript
public readonly apiGroup: string;
```

- *Type:* string

The group portion of the API version (e.g. `authorization.k8s.io`).

---

##### `apiVersion`<sup>Required</sup> <a name="apiVersion" id="cdk8s-pipelines.Pipeline.property.apiVersion"></a>

```typescript
public readonly apiVersion: string;
```

- *Type:* string

The object's API version (e.g. `authorization.k8s.io/v1`).

---

##### `chart`<sup>Required</sup> <a name="chart" id="cdk8s-pipelines.Pipeline.property.chart"></a>

```typescript
public readonly chart: Chart;
```

- *Type:* cdk8s.Chart

The chart in which this object is defined.

---

##### `kind`<sup>Required</sup> <a name="kind" id="cdk8s-pipelines.Pipeline.property.kind"></a>

```typescript
public readonly kind: string;
```

- *Type:* string

The object kind.

---

##### `metadata`<sup>Required</sup> <a name="metadata" id="cdk8s-pipelines.Pipeline.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadataDefinition;
```

- *Type:* cdk8s.ApiObjectMetadataDefinition

Metadata associated with this API object.

---

##### `name`<sup>Required</sup> <a name="name" id="cdk8s-pipelines.Pipeline.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the API object.

If a name is specified in `metadata.name` this will be the name returned.
Otherwise, a name will be generated by calling
`Chart.of(this).generatedObjectName(this)`, which by default uses the
construct path to generate a DNS-compatible name for the resource.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.Pipeline.property.GVK">GVK</a></code> | <code>cdk8s.GroupVersionKind</code> | Returns the apiVersion and kind for "Pipeline". |

---

##### `GVK`<sup>Required</sup> <a name="GVK" id="cdk8s-pipelines.Pipeline.property.GVK"></a>

```typescript
public readonly GVK: GroupVersionKind;
```

- *Type:* cdk8s.GroupVersionKind

Returns the apiVersion and kind for "Pipeline".

---

### Task <a name="Task" id="cdk8s-pipelines.Task"></a>

#### Initializers <a name="Initializers" id="cdk8s-pipelines.Task.Initializer"></a>

```typescript
import { Task } from 'cdk8s-pipelines'

new Task(scope: Construct, id: string, props?: TaskProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.Task.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | the scope in which to define this object. |
| <code><a href="#cdk8s-pipelines.Task.Initializer.parameter.id">id</a></code> | <code>string</code> | a scope-local name for the object. |
| <code><a href="#cdk8s-pipelines.Task.Initializer.parameter.props">props</a></code> | <code><a href="#cdk8s-pipelines.TaskProps">TaskProps</a></code> | initialization props. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk8s-pipelines.Task.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

the scope in which to define this object.

---

##### `id`<sup>Required</sup> <a name="id" id="cdk8s-pipelines.Task.Initializer.parameter.id"></a>

- *Type:* string

a scope-local name for the object.

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk8s-pipelines.Task.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk8s-pipelines.TaskProps">TaskProps</a>

initialization props.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines.Task.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk8s-pipelines.Task.addDependency">addDependency</a></code> | Create a dependency between this ApiObject and other constructs. |
| <code><a href="#cdk8s-pipelines.Task.addJsonPatch">addJsonPatch</a></code> | Applies a set of RFC-6902 JSON-Patch operations to the manifest synthesized for this API object. |
| <code><a href="#cdk8s-pipelines.Task.toJson">toJson</a></code> | Renders the object to Kubernetes JSON. |

---

##### `toString` <a name="toString" id="cdk8s-pipelines.Task.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addDependency` <a name="addDependency" id="cdk8s-pipelines.Task.addDependency"></a>

```typescript
public addDependency(dependencies: IConstruct): void
```

Create a dependency between this ApiObject and other constructs.

These can be other ApiObjects, Charts, or custom.

###### `dependencies`<sup>Required</sup> <a name="dependencies" id="cdk8s-pipelines.Task.addDependency.parameter.dependencies"></a>

- *Type:* constructs.IConstruct

the dependencies to add.

---

##### `addJsonPatch` <a name="addJsonPatch" id="cdk8s-pipelines.Task.addJsonPatch"></a>

```typescript
public addJsonPatch(ops: JsonPatch): void
```

Applies a set of RFC-6902 JSON-Patch operations to the manifest synthesized for this API object.

*Example*

```typescript
  kubePod.addJsonPatch(JsonPatch.replace('/spec/enableServiceLinks', true));
```


###### `ops`<sup>Required</sup> <a name="ops" id="cdk8s-pipelines.Task.addJsonPatch.parameter.ops"></a>

- *Type:* cdk8s.JsonPatch

The JSON-Patch operations to apply.

---

##### `toJson` <a name="toJson" id="cdk8s-pipelines.Task.toJson"></a>

```typescript
public toJson(): any
```

Renders the object to Kubernetes JSON.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines.Task.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk8s-pipelines.Task.isApiObject">isApiObject</a></code> | Return whether the given object is an `ApiObject`. |
| <code><a href="#cdk8s-pipelines.Task.of">of</a></code> | Returns the `ApiObject` named `Resource` which is a child of the given construct. |
| <code><a href="#cdk8s-pipelines.Task.manifest">manifest</a></code> | Renders a Kubernetes manifest for "Task". |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk8s-pipelines.Task.isConstruct"></a>

```typescript
import { Task } from 'cdk8s-pipelines'

Task.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk8s-pipelines.Task.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isApiObject` <a name="isApiObject" id="cdk8s-pipelines.Task.isApiObject"></a>

```typescript
import { Task } from 'cdk8s-pipelines'

Task.isApiObject(o: any)
```

Return whether the given object is an `ApiObject`.

We do attribute detection since we can't reliably use 'instanceof'.

###### `o`<sup>Required</sup> <a name="o" id="cdk8s-pipelines.Task.isApiObject.parameter.o"></a>

- *Type:* any

The object to check.

---

##### `of` <a name="of" id="cdk8s-pipelines.Task.of"></a>

```typescript
import { Task } from 'cdk8s-pipelines'

Task.of(c: IConstruct)
```

Returns the `ApiObject` named `Resource` which is a child of the given construct.

If `c` is an `ApiObject`, it is returned directly. Throws an
exception if the construct does not have a child named `Default` _or_ if
this child is not an `ApiObject`.

###### `c`<sup>Required</sup> <a name="c" id="cdk8s-pipelines.Task.of.parameter.c"></a>

- *Type:* constructs.IConstruct

The higher-level construct.

---

##### `manifest` <a name="manifest" id="cdk8s-pipelines.Task.manifest"></a>

```typescript
import { Task } from 'cdk8s-pipelines'

Task.manifest(props?: TaskProps)
```

Renders a Kubernetes manifest for "Task".

This can be used to inline resource manifests inside other objects (e.g. as templates).

###### `props`<sup>Optional</sup> <a name="props" id="cdk8s-pipelines.Task.manifest.parameter.props"></a>

- *Type:* <a href="#cdk8s-pipelines.TaskProps">TaskProps</a>

initialization props.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.Task.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk8s-pipelines.Task.property.apiGroup">apiGroup</a></code> | <code>string</code> | The group portion of the API version (e.g. `authorization.k8s.io`). |
| <code><a href="#cdk8s-pipelines.Task.property.apiVersion">apiVersion</a></code> | <code>string</code> | The object's API version (e.g. `authorization.k8s.io/v1`). |
| <code><a href="#cdk8s-pipelines.Task.property.chart">chart</a></code> | <code>cdk8s.Chart</code> | The chart in which this object is defined. |
| <code><a href="#cdk8s-pipelines.Task.property.kind">kind</a></code> | <code>string</code> | The object kind. |
| <code><a href="#cdk8s-pipelines.Task.property.metadata">metadata</a></code> | <code>cdk8s.ApiObjectMetadataDefinition</code> | Metadata associated with this API object. |
| <code><a href="#cdk8s-pipelines.Task.property.name">name</a></code> | <code>string</code> | The name of the API object. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk8s-pipelines.Task.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `apiGroup`<sup>Required</sup> <a name="apiGroup" id="cdk8s-pipelines.Task.property.apiGroup"></a>

```typescript
public readonly apiGroup: string;
```

- *Type:* string

The group portion of the API version (e.g. `authorization.k8s.io`).

---

##### `apiVersion`<sup>Required</sup> <a name="apiVersion" id="cdk8s-pipelines.Task.property.apiVersion"></a>

```typescript
public readonly apiVersion: string;
```

- *Type:* string

The object's API version (e.g. `authorization.k8s.io/v1`).

---

##### `chart`<sup>Required</sup> <a name="chart" id="cdk8s-pipelines.Task.property.chart"></a>

```typescript
public readonly chart: Chart;
```

- *Type:* cdk8s.Chart

The chart in which this object is defined.

---

##### `kind`<sup>Required</sup> <a name="kind" id="cdk8s-pipelines.Task.property.kind"></a>

```typescript
public readonly kind: string;
```

- *Type:* string

The object kind.

---

##### `metadata`<sup>Required</sup> <a name="metadata" id="cdk8s-pipelines.Task.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadataDefinition;
```

- *Type:* cdk8s.ApiObjectMetadataDefinition

Metadata associated with this API object.

---

##### `name`<sup>Required</sup> <a name="name" id="cdk8s-pipelines.Task.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the API object.

If a name is specified in `metadata.name` this will be the name returned.
Otherwise, a name will be generated by calling
`Chart.of(this).generatedObjectName(this)`, which by default uses the
construct path to generate a DNS-compatible name for the resource.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.Task.property.GVK">GVK</a></code> | <code>cdk8s.GroupVersionKind</code> | Returns the apiVersion and kind for "Task". |

---

##### `GVK`<sup>Required</sup> <a name="GVK" id="cdk8s-pipelines.Task.property.GVK"></a>

```typescript
public readonly GVK: GroupVersionKind;
```

- *Type:* cdk8s.GroupVersionKind

Returns the apiVersion and kind for "Task".

---

## Structs <a name="Structs" id="Structs"></a>

### NamedResource <a name="NamedResource" id="cdk8s-pipelines.NamedResource"></a>

#### Initializer <a name="Initializer" id="cdk8s-pipelines.NamedResource.Initializer"></a>

```typescript
import { NamedResource } from 'cdk8s-pipelines'

const namedResource: NamedResource = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.NamedResource.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.NamedResource.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

### PipelineParam <a name="PipelineParam" id="cdk8s-pipelines.PipelineParam"></a>

A Pipeline parameter.

See https://tekton.dev/docs/pipelines/pipelines/#specifying-parameters

#### Initializer <a name="Initializer" id="cdk8s-pipelines.PipelineParam.Initializer"></a>

```typescript
import { PipelineParam } from 'cdk8s-pipelines'

const pipelineParam: PipelineParam = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineParam.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineParam.property.default">default</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineParam.property.type">type</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.PipelineParam.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `default`<sup>Optional</sup> <a name="default" id="cdk8s-pipelines.PipelineParam.property.default"></a>

```typescript
public readonly default: string;
```

- *Type:* string

---

##### `type`<sup>Optional</sup> <a name="type" id="cdk8s-pipelines.PipelineParam.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* string

---

### PipelineProps <a name="PipelineProps" id="cdk8s-pipelines.PipelineProps"></a>

Properties used to create the Pipelines.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.PipelineProps.Initializer"></a>

```typescript
import { PipelineProps } from 'cdk8s-pipelines'

const pipelineProps: PipelineProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineProps.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.PipelineProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

### PipelineSpec <a name="PipelineSpec" id="cdk8s-pipelines.PipelineSpec"></a>

#### Initializer <a name="Initializer" id="cdk8s-pipelines.PipelineSpec.Initializer"></a>

```typescript
import { PipelineSpec } from 'cdk8s-pipelines'

const pipelineSpec: PipelineSpec = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineSpec.property.params">params</a></code> | <code><a href="#cdk8s-pipelines.PipelineParam">PipelineParam</a>[]</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineSpec.property.tasks">tasks</a></code> | <code><a href="#cdk8s-pipelines.PipelineTask">PipelineTask</a>[]</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineSpec.property.workspaces">workspaces</a></code> | <code><a href="#cdk8s-pipelines.PipelineWorkspace">PipelineWorkspace</a>[]</code> | *No description.* |

---

##### `params`<sup>Optional</sup> <a name="params" id="cdk8s-pipelines.PipelineSpec.property.params"></a>

```typescript
public readonly params: PipelineParam[];
```

- *Type:* <a href="#cdk8s-pipelines.PipelineParam">PipelineParam</a>[]

---

##### `tasks`<sup>Optional</sup> <a name="tasks" id="cdk8s-pipelines.PipelineSpec.property.tasks"></a>

```typescript
public readonly tasks: PipelineTask[];
```

- *Type:* <a href="#cdk8s-pipelines.PipelineTask">PipelineTask</a>[]

---

##### `workspaces`<sup>Optional</sup> <a name="workspaces" id="cdk8s-pipelines.PipelineSpec.property.workspaces"></a>

```typescript
public readonly workspaces: PipelineWorkspace[];
```

- *Type:* <a href="#cdk8s-pipelines.PipelineWorkspace">PipelineWorkspace</a>[]

---

### PipelineTask <a name="PipelineTask" id="cdk8s-pipelines.PipelineTask"></a>

A task in a pipeline.

See https://tekton.dev/docs/pipelines/pipelines/#adding-tasks-to-the-pipeline

#### Initializer <a name="Initializer" id="cdk8s-pipelines.PipelineTask.Initializer"></a>

```typescript
import { PipelineTask } from 'cdk8s-pipelines'

const pipelineTask: PipelineTask = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineTask.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineTask.property.params">params</a></code> | <code><a href="#cdk8s-pipelines.TaskParam">TaskParam</a>[]</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineTask.property.runAfter">runAfter</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineTask.property.taskRef">taskRef</a></code> | <code><a href="#cdk8s-pipelines.TaskRef">TaskRef</a></code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.PipelineTask.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `params`<sup>Optional</sup> <a name="params" id="cdk8s-pipelines.PipelineTask.property.params"></a>

```typescript
public readonly params: TaskParam[];
```

- *Type:* <a href="#cdk8s-pipelines.TaskParam">TaskParam</a>[]

---

##### `runAfter`<sup>Optional</sup> <a name="runAfter" id="cdk8s-pipelines.PipelineTask.property.runAfter"></a>

```typescript
public readonly runAfter: string[];
```

- *Type:* string[]

---

##### `taskRef`<sup>Optional</sup> <a name="taskRef" id="cdk8s-pipelines.PipelineTask.property.taskRef"></a>

```typescript
public readonly taskRef: TaskRef;
```

- *Type:* <a href="#cdk8s-pipelines.TaskRef">TaskRef</a>

---

### PipelineTaskDef <a name="PipelineTaskDef" id="cdk8s-pipelines.PipelineTaskDef"></a>

A.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.PipelineTaskDef.Initializer"></a>

```typescript
import { PipelineTaskDef } from 'cdk8s-pipelines'

const pipelineTaskDef: PipelineTaskDef = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineTaskDef.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineTaskDef.property.params">params</a></code> | <code><a href="#cdk8s-pipelines.TaskParam">TaskParam</a>[]</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineTaskDef.property.runAfter">runAfter</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineTaskDef.property.taskRef">taskRef</a></code> | <code><a href="#cdk8s-pipelines.TaskRef">TaskRef</a></code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineTaskDef.property.refParams">refParams</a></code> | <code><a href="#cdk8s-pipelines.PipelineParam">PipelineParam</a>[]</code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.PipelineTaskDef.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `params`<sup>Optional</sup> <a name="params" id="cdk8s-pipelines.PipelineTaskDef.property.params"></a>

```typescript
public readonly params: TaskParam[];
```

- *Type:* <a href="#cdk8s-pipelines.TaskParam">TaskParam</a>[]

---

##### `runAfter`<sup>Optional</sup> <a name="runAfter" id="cdk8s-pipelines.PipelineTaskDef.property.runAfter"></a>

```typescript
public readonly runAfter: string[];
```

- *Type:* string[]

---

##### `taskRef`<sup>Optional</sup> <a name="taskRef" id="cdk8s-pipelines.PipelineTaskDef.property.taskRef"></a>

```typescript
public readonly taskRef: TaskRef;
```

- *Type:* <a href="#cdk8s-pipelines.TaskRef">TaskRef</a>

---

##### `refParams`<sup>Optional</sup> <a name="refParams" id="cdk8s-pipelines.PipelineTaskDef.property.refParams"></a>

```typescript
public readonly refParams: PipelineParam[];
```

- *Type:* <a href="#cdk8s-pipelines.PipelineParam">PipelineParam</a>[]

---

### PipelineWorkspace <a name="PipelineWorkspace" id="cdk8s-pipelines.PipelineWorkspace"></a>

#### Initializer <a name="Initializer" id="cdk8s-pipelines.PipelineWorkspace.Initializer"></a>

```typescript
import { PipelineWorkspace } from 'cdk8s-pipelines'

const pipelineWorkspace: PipelineWorkspace = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineWorkspace.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineWorkspace.property.workspace">workspace</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.PipelineWorkspace.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `workspace`<sup>Optional</sup> <a name="workspace" id="cdk8s-pipelines.PipelineWorkspace.property.workspace"></a>

```typescript
public readonly workspace: string;
```

- *Type:* string

---

### TaskParam <a name="TaskParam" id="cdk8s-pipelines.TaskParam"></a>

A Task parameter.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskParam.Initializer"></a>

```typescript
import { TaskParam } from 'cdk8s-pipelines'

const taskParam: TaskParam = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskParam.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskParam.property.value">value</a></code> | <code>string</code> | The value of the task parameter. |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskParam.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `value`<sup>Optional</sup> <a name="value" id="cdk8s-pipelines.TaskParam.property.value"></a>

```typescript
public readonly value: string;
```

- *Type:* string

The value of the task parameter.

---

### TaskProps <a name="TaskProps" id="cdk8s-pipelines.TaskProps"></a>

Properties used to create the Pipelines.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskProps.Initializer"></a>

```typescript
import { TaskProps } from 'cdk8s-pipelines'

const taskProps: TaskProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskProps.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

### TaskSpec <a name="TaskSpec" id="cdk8s-pipelines.TaskSpec"></a>

The Task spec.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskSpec.Initializer"></a>

```typescript
import { TaskSpec } from 'cdk8s-pipelines'

const taskSpec: TaskSpec = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskSpec.property.steps">steps</a></code> | <code><a href="#cdk8s-pipelines.TaskStep">TaskStep</a>[]</code> | *No description.* |

---

##### `steps`<sup>Optional</sup> <a name="steps" id="cdk8s-pipelines.TaskSpec.property.steps"></a>

```typescript
public readonly steps: TaskStep[];
```

- *Type:* <a href="#cdk8s-pipelines.TaskStep">TaskStep</a>[]

---

### TaskStep <a name="TaskStep" id="cdk8s-pipelines.TaskStep"></a>

The step for a Task.

See https://tekton.dev/docs/pipelines/tasks/#defining-steps

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskStep.Initializer"></a>

```typescript
import { TaskStep } from 'cdk8s-pipelines'

const taskStep: TaskStep = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskStep.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskStep.property.image">image</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskStep.property.script">script</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskStep.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `image`<sup>Optional</sup> <a name="image" id="cdk8s-pipelines.TaskStep.property.image"></a>

```typescript
public readonly image: string;
```

- *Type:* string

---

##### `script`<sup>Optional</sup> <a name="script" id="cdk8s-pipelines.TaskStep.property.script"></a>

```typescript
public readonly script: string;
```

- *Type:* string

---

### TaskWorkspace <a name="TaskWorkspace" id="cdk8s-pipelines.TaskWorkspace"></a>

A workspace used by a Task.

See https://tekton.dev/docs/pipelines/workspaces/#using-workspaces-in-tasks for more information.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskWorkspace.Initializer"></a>

```typescript
import { TaskWorkspace } from 'cdk8s-pipelines'

const taskWorkspace: TaskWorkspace = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskWorkspace.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskWorkspace.property.description">description</a></code> | <code>string</code> | An informative string describing the purpose of the Workspace. |
| <code><a href="#cdk8s-pipelines.TaskWorkspace.property.mountPath">mountPath</a></code> | <code>string</code> | A path to a location on disk where the workspace will be available to Steps. |
| <code><a href="#cdk8s-pipelines.TaskWorkspace.property.optional">optional</a></code> | <code>boolean</code> | A boolean indicating whether a TaskRun can omit the Workspace. |
| <code><a href="#cdk8s-pipelines.TaskWorkspace.property.readOnly">readOnly</a></code> | <code>boolean</code> | A boolean declaring whether the Task will write to the Workspace. |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskWorkspace.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk8s-pipelines.TaskWorkspace.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

An informative string describing the purpose of the Workspace.

---

##### `mountPath`<sup>Optional</sup> <a name="mountPath" id="cdk8s-pipelines.TaskWorkspace.property.mountPath"></a>

```typescript
public readonly mountPath: string;
```

- *Type:* string

A path to a location on disk where the workspace will be available to Steps.

If a mountPath is not provided the workspace will be placed by
default at /workspace/<name> where <name> is the workspace’s unique name.

---

##### `optional`<sup>Optional</sup> <a name="optional" id="cdk8s-pipelines.TaskWorkspace.property.optional"></a>

```typescript
public readonly optional: boolean;
```

- *Type:* boolean

A boolean indicating whether a TaskRun can omit the Workspace.

Defaults to false.

---

##### `readOnly`<sup>Optional</sup> <a name="readOnly" id="cdk8s-pipelines.TaskWorkspace.property.readOnly"></a>

```typescript
public readonly readOnly: boolean;
```

- *Type:* boolean

A boolean declaring whether the Task will write to the Workspace.

Defaults to false.

---

## Classes <a name="Classes" id="Classes"></a>

### TaskRef <a name="TaskRef" id="cdk8s-pipelines.TaskRef"></a>

#### Initializers <a name="Initializers" id="cdk8s-pipelines.TaskRef.Initializer"></a>

```typescript
import { TaskRef } from 'cdk8s-pipelines'

new TaskRef(name: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskRef.Initializer.parameter.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk8s-pipelines.TaskRef.Initializer.parameter.name"></a>

- *Type:* string

---



#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskRef.property.kind">kind</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskRef.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `kind`<sup>Optional</sup> <a name="kind" id="cdk8s-pipelines.TaskRef.property.kind"></a>

```typescript
public readonly kind: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskRef.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---



