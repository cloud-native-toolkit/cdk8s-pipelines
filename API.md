# CDK8s Pipelines

This is a construct for creating [Pipelines](https://tekton.dev/docs/getting-started/pipelines/)
using [cdk8s](https://cdk8s.io/docs/latest/).

## Examples

```typescript
const pipeline = new Pipeline(this, 'my-pipeline');
```

## Pipeline objects and builders

Tekton [Pipelines](https://tekton.dev/docs/pipelines/),
[Tasks](https://tekton.dev/docs/pipelines/tasks/),
[Workspaces](https://tekton.dev/docs/pipelines/tasks/#specifying-workspaces),
[Parameters](https://tekton.dev/docs/pipelines/tasks/#specifying-parameters),
and other resources refer to one another within a pipeline. For example, a
Task may have a `params` that a value that is `$(params.foo)`, meaning it uses
the `param` named `foo` at the pipeline level within the task.

It is a goal of the _builders_ within this library to simplify that
cross-referencing during the process of defining a Pipeline and its `tasks`,
`workspaces`, and `params`.

Therefore, within this library there are objects that strictly define the
structure of the construct itself and can be `synth()`'ed to create the
Kubernetes resources. You are free to use the constructs and define all the
cross-references yourself. For example, here is a `Pipeline` that defines all
resources to create a Pipeline that closely matches the
[example here](https://tekton.dev/docs/how-to-guides/kaniko-build-push/):

```typescript
new Pipeline(this, 'test-pipeline', {
  metadata: {
    name: 'clone-build-push',
  },
  spec: {
    description: 'This pipeline closes a repository, builds a Docker image, etc.',
    params: [
      {
        name: 'repo-url',
        type: 'string',
      },
    ],
    workspaces: [
      {
        name: 'shared-data',
      },
    ],
    tasks: [
      {
        name: 'fetch-source',
        taskRef: {
          name: 'git-clone',
        },
        workspaces: [
          {
            name: 'output',
            workspace: 'shared-data',
          },
        ],
        params: [
          {
            name: 'url',
            value: '$(params.repo-url)',
          },
        ],
      },
    ],
  },
});
```

Alternatively, using the _builders_ (e.g., `PipelineBuilder`) for the resources
provides a fluid syntax that you can use to add the resources with cross-references
made for you automatically. Here is the same construct, but defined using the
`PipelineBuilder`.

```typescript
new PipelineBuilder(this, 'my-pipeline')
    .withName('clone-build-push')
    .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
    .withTask(new PipelineTaskBuilder()
            .withName('fetch-source')
            .withTaskReference('git-clone')
            .withWorkspace('output', 'shared-data', 'The files cloned by the task')
            .withStringParam('url', 'repo-url', '$(params.repo-url)'))
    .buildPipeline();
```

The `build` method on the builders will validate the parameters and, if the
object is valid, will create the construct, making sure to add `workspace`
and `param` resources to the Task as well as the

Any resources that the `task` requires that needs to be defined at the `pipeline`

## Related projects

This is the core project with the basic Pipeline constructs. There are other
constructs that use this construct to develop richer pipelines and tasks that
are based on tasks available in [Tekton Hub](https://hub.tekton.dev/).

* [cdk8s-pipelines-lib](https://github.com/cloud-native-toolkit/cdk8s-pipelines-lib) - A library of
constructs that allows you to easily create Tekton pipelines that use tasks from
Tekton Hub and also provides some basic, reusable pipelines.

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Pipeline <a name="Pipeline" id="cdk8s-pipelines.Pipeline"></a>

The Pipeline allows you to specify Tasks that use Parameters and Workspaces to accomplish complex tasks on the cluster.

> [https://tekton.dev/docs/pipelines/pipelines/#configuring-a-pipeline](https://tekton.dev/docs/pipelines/pipelines/#configuring-a-pipeline)

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

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines.Pipeline.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk8s-pipelines.Pipeline.isApiObject">isApiObject</a></code> | Return whether the given object is an `ApiObject`. |
| <code><a href="#cdk8s-pipelines.Pipeline.of">of</a></code> | Returns the `ApiObject` named `Resource` which is a child of the given construct. |
| <code><a href="#cdk8s-pipelines.Pipeline.manifest">manifest</a></code> | Renders a Kubernetes manifest for "Pipeline". |

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

##### `manifest` <a name="manifest" id="cdk8s-pipelines.Pipeline.manifest"></a>

```typescript
import { Pipeline } from 'cdk8s-pipelines'

Pipeline.manifest(props?: PipelineProps)
```

Renders a Kubernetes manifest for "Pipeline".

This can be used to inline resource manifests inside other objects (e.g. as templates).

###### `props`<sup>Optional</sup> <a name="props" id="cdk8s-pipelines.Pipeline.manifest.parameter.props"></a>

- *Type:* <a href="#cdk8s-pipelines.PipelineProps">PipelineProps</a>

initialization props.

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

A Tekton Task, which is > a collection of Steps that you define and arrange in > a specific order of execution as part of your continuous integration flow.

A
> Task executes as a Pod on your Kubernetes cluster. A Task is available within a
> specific namespace, while a ClusterTask is available across the entire
> cluster.

> [https://tekton.dev/docs/pipelines/tasks/](https://tekton.dev/docs/pipelines/tasks/)

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

### BuilderOptions <a name="BuilderOptions" id="cdk8s-pipelines.BuilderOptions"></a>

#### Initializer <a name="Initializer" id="cdk8s-pipelines.BuilderOptions.Initializer"></a>

```typescript
import { BuilderOptions } from 'cdk8s-pipelines'

const builderOptions: BuilderOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.BuilderOptions.property.buildDependencies">buildDependencies</a></code> | <code>boolean</code> | *No description.* |

---

##### `buildDependencies`<sup>Required</sup> <a name="buildDependencies" id="cdk8s-pipelines.BuilderOptions.property.buildDependencies"></a>

```typescript
public readonly buildDependencies: boolean;
```

- *Type:* boolean

---

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

### NameKeyPair <a name="NameKeyPair" id="cdk8s-pipelines.NameKeyPair"></a>

#### Initializer <a name="Initializer" id="cdk8s-pipelines.NameKeyPair.Initializer"></a>

```typescript
import { NameKeyPair } from 'cdk8s-pipelines'

const nameKeyPair: NameKeyPair = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.NameKeyPair.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.NameKeyPair.property.key">key</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.NameKeyPair.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `key`<sup>Optional</sup> <a name="key" id="cdk8s-pipelines.NameKeyPair.property.key"></a>

```typescript
public readonly key: string;
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
| <code><a href="#cdk8s-pipelines.PipelineProps.property.metadata">metadata</a></code> | <code>cdk8s.ApiObjectMetadata</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineProps.property.spec">spec</a></code> | <code><a href="#cdk8s-pipelines.PipelineSpec">PipelineSpec</a></code> | *No description.* |

---

##### `metadata`<sup>Optional</sup> <a name="metadata" id="cdk8s-pipelines.PipelineProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* cdk8s.ApiObjectMetadata

---

##### `spec`<sup>Optional</sup> <a name="spec" id="cdk8s-pipelines.PipelineProps.property.spec"></a>

```typescript
public readonly spec: PipelineSpec;
```

- *Type:* <a href="#cdk8s-pipelines.PipelineSpec">PipelineSpec</a>

---

### PipelineSpec <a name="PipelineSpec" id="cdk8s-pipelines.PipelineSpec"></a>

The `spec` part of the Pipeline.

> [https://tekton.dev/docs/pipelines/pipelines/](https://tekton.dev/docs/pipelines/pipelines/)

#### Initializer <a name="Initializer" id="cdk8s-pipelines.PipelineSpec.Initializer"></a>

```typescript
import { PipelineSpec } from 'cdk8s-pipelines'

const pipelineSpec: PipelineSpec = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineSpec.property.tasks">tasks</a></code> | <code><a href="#cdk8s-pipelines.PipelineTask">PipelineTask</a>[]</code> | The `tasks` are required on the Pipeline. |
| <code><a href="#cdk8s-pipelines.PipelineSpec.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineSpec.property.params">params</a></code> | <code><a href="#cdk8s-pipelines.PipelineParam">PipelineParam</a>[]</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineSpec.property.workspaces">workspaces</a></code> | <code><a href="#cdk8s-pipelines.PipelineWorkspace">PipelineWorkspace</a>[]</code> | Pipeline workspaces. |

---

##### `tasks`<sup>Required</sup> <a name="tasks" id="cdk8s-pipelines.PipelineSpec.property.tasks"></a>

```typescript
public readonly tasks: PipelineTask[];
```

- *Type:* <a href="#cdk8s-pipelines.PipelineTask">PipelineTask</a>[]

The `tasks` are required on the Pipeline.

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk8s-pipelines.PipelineSpec.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `params`<sup>Optional</sup> <a name="params" id="cdk8s-pipelines.PipelineSpec.property.params"></a>

```typescript
public readonly params: PipelineParam[];
```

- *Type:* <a href="#cdk8s-pipelines.PipelineParam">PipelineParam</a>[]

---

##### `workspaces`<sup>Optional</sup> <a name="workspaces" id="cdk8s-pipelines.PipelineSpec.property.workspaces"></a>

```typescript
public readonly workspaces: PipelineWorkspace[];
```

- *Type:* <a href="#cdk8s-pipelines.PipelineWorkspace">PipelineWorkspace</a>[]

Pipeline workspaces.

Workspaces allow you to specify one or more volumes that each Task in the
Pipeline requires during execution. You specify one or more Workspaces in
the workspaces field.

> [https://tekton.dev/docs/pipelines/pipelines/#specifying-workspaces](https://tekton.dev/docs/pipelines/pipelines/#specifying-workspaces)

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
| <code><a href="#cdk8s-pipelines.PipelineTask.property.workspaces">workspaces</a></code> | <code><a href="#cdk8s-pipelines.PipelineTaskWorkspace">PipelineTaskWorkspace</a>[]</code> | *No description.* |

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

##### `workspaces`<sup>Optional</sup> <a name="workspaces" id="cdk8s-pipelines.PipelineTask.property.workspaces"></a>

```typescript
public readonly workspaces: PipelineTaskWorkspace[];
```

- *Type:* <a href="#cdk8s-pipelines.PipelineTaskWorkspace">PipelineTaskWorkspace</a>[]

---

### PipelineTaskDef <a name="PipelineTaskDef" id="cdk8s-pipelines.PipelineTaskDef"></a>

A task definition at the pipeline level.

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
| <code><a href="#cdk8s-pipelines.PipelineTaskDef.property.workspaces">workspaces</a></code> | <code><a href="#cdk8s-pipelines.PipelineTaskWorkspace">PipelineTaskWorkspace</a>[]</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineTaskDef.property.refParams">refParams</a></code> | <code><a href="#cdk8s-pipelines.PipelineParam">PipelineParam</a>[]</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineTaskDef.property.refWorkspaces">refWorkspaces</a></code> | <code><a href="#cdk8s-pipelines.PipelineTaskWorkspace">PipelineTaskWorkspace</a>[]</code> | *No description.* |

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

##### `workspaces`<sup>Optional</sup> <a name="workspaces" id="cdk8s-pipelines.PipelineTaskDef.property.workspaces"></a>

```typescript
public readonly workspaces: PipelineTaskWorkspace[];
```

- *Type:* <a href="#cdk8s-pipelines.PipelineTaskWorkspace">PipelineTaskWorkspace</a>[]

---

##### `refParams`<sup>Optional</sup> <a name="refParams" id="cdk8s-pipelines.PipelineTaskDef.property.refParams"></a>

```typescript
public readonly refParams: PipelineParam[];
```

- *Type:* <a href="#cdk8s-pipelines.PipelineParam">PipelineParam</a>[]

---

##### `refWorkspaces`<sup>Optional</sup> <a name="refWorkspaces" id="cdk8s-pipelines.PipelineTaskDef.property.refWorkspaces"></a>

```typescript
public readonly refWorkspaces: PipelineTaskWorkspace[];
```

- *Type:* <a href="#cdk8s-pipelines.PipelineTaskWorkspace">PipelineTaskWorkspace</a>[]

---

### PipelineTaskWorkspace <a name="PipelineTaskWorkspace" id="cdk8s-pipelines.PipelineTaskWorkspace"></a>

#### Initializer <a name="Initializer" id="cdk8s-pipelines.PipelineTaskWorkspace.Initializer"></a>

```typescript
import { PipelineTaskWorkspace } from 'cdk8s-pipelines'

const pipelineTaskWorkspace: PipelineTaskWorkspace = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineTaskWorkspace.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineTaskWorkspace.property.workspace">workspace</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.PipelineTaskWorkspace.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `workspace`<sup>Optional</sup> <a name="workspace" id="cdk8s-pipelines.PipelineTaskWorkspace.property.workspace"></a>

```typescript
public readonly workspace: string;
```

- *Type:* string

---

### PipelineWorkspace <a name="PipelineWorkspace" id="cdk8s-pipelines.PipelineWorkspace"></a>

A workspace for a pipeline.

See https://tekton.dev/docs/pipelines/pipelines/#specifying-workspaces
and https://tekton.dev/docs/pipelines/workspaces/#using-workspaces-in-pipelines.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.PipelineWorkspace.Initializer"></a>

```typescript
import { PipelineWorkspace } from 'cdk8s-pipelines'

const pipelineWorkspace: PipelineWorkspace = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineWorkspace.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineWorkspace.property.description">description</a></code> | <code>string</code> | The description of the workspace. |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.PipelineWorkspace.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk8s-pipelines.PipelineWorkspace.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

The description of the workspace.

---

### TaskEnvValueSource <a name="TaskEnvValueSource" id="cdk8s-pipelines.TaskEnvValueSource"></a>

The source for a `env` `valueFrom`.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskEnvValueSource.Initializer"></a>

```typescript
import { TaskEnvValueSource } from 'cdk8s-pipelines'

const taskEnvValueSource: TaskEnvValueSource = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskEnvValueSource.property.secretKeyRef">secretKeyRef</a></code> | <code><a href="#cdk8s-pipelines.NameKeyPair">NameKeyPair</a></code> | *No description.* |

---

##### `secretKeyRef`<sup>Required</sup> <a name="secretKeyRef" id="cdk8s-pipelines.TaskEnvValueSource.property.secretKeyRef"></a>

```typescript
public readonly secretKeyRef: NameKeyPair;
```

- *Type:* <a href="#cdk8s-pipelines.NameKeyPair">NameKeyPair</a>

---

### TaskParam <a name="TaskParam" id="cdk8s-pipelines.TaskParam"></a>

A Task parameter value.

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

Properties used to create the Task.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskProps.Initializer"></a>

```typescript
import { TaskProps } from 'cdk8s-pipelines'

const taskProps: TaskProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskProps.property.metadata">metadata</a></code> | <code>cdk8s.ApiObjectMetadata</code> | The object [metadata](https://kubernetes.io/docs/concepts/overview/working-with-objects/#required-fields) that conforms to standard Kubernetes metadata. |
| <code><a href="#cdk8s-pipelines.TaskProps.property.spec">spec</a></code> | <code><a href="#cdk8s-pipelines.TaskSpec">TaskSpec</a></code> | The `spec` is the configuration of the `Task` object. |

---

##### `metadata`<sup>Optional</sup> <a name="metadata" id="cdk8s-pipelines.TaskProps.property.metadata"></a>

```typescript
public readonly metadata: ApiObjectMetadata;
```

- *Type:* cdk8s.ApiObjectMetadata

The object [metadata](https://kubernetes.io/docs/concepts/overview/working-with-objects/#required-fields) that conforms to standard Kubernetes metadata.

---

##### `spec`<sup>Optional</sup> <a name="spec" id="cdk8s-pipelines.TaskProps.property.spec"></a>

```typescript
public readonly spec: TaskSpec;
```

- *Type:* <a href="#cdk8s-pipelines.TaskSpec">TaskSpec</a>

The `spec` is the configuration of the `Task` object.

---

### TaskSpec <a name="TaskSpec" id="cdk8s-pipelines.TaskSpec"></a>

The Task spec.

> [https://tekton.dev/docs/pipelines/tasks/#configuring-a-task](https://tekton.dev/docs/pipelines/tasks/#configuring-a-task)

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskSpec.Initializer"></a>

```typescript
import { TaskSpec } from 'cdk8s-pipelines'

const taskSpec: TaskSpec = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskSpec.property.description">description</a></code> | <code>string</code> | The description of the `Task`. |
| <code><a href="#cdk8s-pipelines.TaskSpec.property.params">params</a></code> | <code><a href="#cdk8s-pipelines.TaskSpecParam">TaskSpecParam</a>[]</code> | The `Task`'s parameters. |
| <code><a href="#cdk8s-pipelines.TaskSpec.property.steps">steps</a></code> | <code><a href="#cdk8s-pipelines.TaskStep">TaskStep</a>[]</code> | The steps that will be executed as part of the Task. |
| <code><a href="#cdk8s-pipelines.TaskSpec.property.workspaces">workspaces</a></code> | <code><a href="#cdk8s-pipelines.TaskWorkspace">TaskWorkspace</a>[]</code> | *No description.* |

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk8s-pipelines.TaskSpec.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

The description of the `Task`.

> [https://tekton.dev/docs/pipelines/tasks/#adding-a-description](https://tekton.dev/docs/pipelines/tasks/#adding-a-description)

---

##### `params`<sup>Optional</sup> <a name="params" id="cdk8s-pipelines.TaskSpec.property.params"></a>

```typescript
public readonly params: TaskSpecParam[];
```

- *Type:* <a href="#cdk8s-pipelines.TaskSpecParam">TaskSpecParam</a>[]

The `Task`'s parameters.

> [https://tekton.dev/docs/pipelines/tasks/#specifying-parameters](https://tekton.dev/docs/pipelines/tasks/#specifying-parameters)

---

##### `steps`<sup>Optional</sup> <a name="steps" id="cdk8s-pipelines.TaskSpec.property.steps"></a>

```typescript
public readonly steps: TaskStep[];
```

- *Type:* <a href="#cdk8s-pipelines.TaskStep">TaskStep</a>[]

The steps that will be executed as part of the Task.

The `Step` should
fit the (container contract)[https://tekton.dev/docs/pipelines/container-contract/]

> [https://tekton.dev/docs/pipelines/tasks/#defining-steps](https://tekton.dev/docs/pipelines/tasks/#defining-steps)

---

##### `workspaces`<sup>Optional</sup> <a name="workspaces" id="cdk8s-pipelines.TaskSpec.property.workspaces"></a>

```typescript
public readonly workspaces: TaskWorkspace[];
```

- *Type:* <a href="#cdk8s-pipelines.TaskWorkspace">TaskWorkspace</a>[]

---

### TaskSpecParam <a name="TaskSpecParam" id="cdk8s-pipelines.TaskSpecParam"></a>

Specifies execution parameters for the Task.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskSpecParam.Initializer"></a>

```typescript
import { TaskSpecParam } from 'cdk8s-pipelines'

const taskSpecParam: TaskSpecParam = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskSpecParam.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskSpecParam.property.default">default</a></code> | <code>string</code> | The default value for a parameter. |
| <code><a href="#cdk8s-pipelines.TaskSpecParam.property.description">description</a></code> | <code>string</code> | The parameter's description. |
| <code><a href="#cdk8s-pipelines.TaskSpecParam.property.type">type</a></code> | <code>string</code> | The parameter's type. |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskSpecParam.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `default`<sup>Optional</sup> <a name="default" id="cdk8s-pipelines.TaskSpecParam.property.default"></a>

```typescript
public readonly default: string;
```

- *Type:* string

The default value for a parameter.

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk8s-pipelines.TaskSpecParam.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

The parameter's description.

---

##### `type`<sup>Optional</sup> <a name="type" id="cdk8s-pipelines.TaskSpecParam.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* string

The parameter's type.

---

### TaskStep <a name="TaskStep" id="cdk8s-pipelines.TaskStep"></a>

The step for a Task.

See https://tekton.dev/docs/pipelines/tasks/#defining-steps

> [https://tekton.dev/docs/pipelines/container-contract/](https://tekton.dev/docs/pipelines/container-contract/)

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskStep.Initializer"></a>

```typescript
import { TaskStep } from 'cdk8s-pipelines'

const taskStep: TaskStep = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskStep.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskStep.property.args">args</a></code> | <code>string[]</code> | Alternatively, you can supply `args` to the `command` value here. |
| <code><a href="#cdk8s-pipelines.TaskStep.property.command">command</a></code> | <code>string[]</code> | The command and its arguments (provided in the form of an array) to execute on the container. |
| <code><a href="#cdk8s-pipelines.TaskStep.property.env">env</a></code> | <code><a href="#cdk8s-pipelines.TaskStepEnv">TaskStepEnv</a>[]</code> | Environment variables for the `Step` on the `Task`. |
| <code><a href="#cdk8s-pipelines.TaskStep.property.image">image</a></code> | <code>string</code> | The name of the container image to use for the Step. |
| <code><a href="#cdk8s-pipelines.TaskStep.property.script">script</a></code> | <code>string</code> | A script that will be executed on the image. |
| <code><a href="#cdk8s-pipelines.TaskStep.property.volumeMounts">volumeMounts</a></code> | <code><a href="#cdk8s-pipelines.TaskVolumeMount">TaskVolumeMount</a>[]</code> | The volume mounts to use for the task. |
| <code><a href="#cdk8s-pipelines.TaskStep.property.workingDir">workingDir</a></code> | <code>string</code> | The name of the working directory for the step. |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskStep.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `args`<sup>Optional</sup> <a name="args" id="cdk8s-pipelines.TaskStep.property.args"></a>

```typescript
public readonly args: string[];
```

- *Type:* string[]

Alternatively, you can supply `args` to the `command` value here.

---

##### `command`<sup>Optional</sup> <a name="command" id="cdk8s-pipelines.TaskStep.property.command"></a>

```typescript
public readonly command: string[];
```

- *Type:* string[]

The command and its arguments (provided in the form of an array) to execute on the container.

If `command` is supplied, you should not supply
`script`.

---

##### `env`<sup>Optional</sup> <a name="env" id="cdk8s-pipelines.TaskStep.property.env"></a>

```typescript
public readonly env: TaskStepEnv[];
```

- *Type:* <a href="#cdk8s-pipelines.TaskStepEnv">TaskStepEnv</a>[]

Environment variables for the `Step` on the `Task`.

---

##### `image`<sup>Optional</sup> <a name="image" id="cdk8s-pipelines.TaskStep.property.image"></a>

```typescript
public readonly image: string;
```

- *Type:* string

The name of the container image to use for the Step.

---

##### `script`<sup>Optional</sup> <a name="script" id="cdk8s-pipelines.TaskStep.property.script"></a>

```typescript
public readonly script: string;
```

- *Type:* string

A script that will be executed on the image.

If `script` is specified,
then the `command` value should not be specified.

---

##### `volumeMounts`<sup>Optional</sup> <a name="volumeMounts" id="cdk8s-pipelines.TaskStep.property.volumeMounts"></a>

```typescript
public readonly volumeMounts: TaskVolumeMount[];
```

- *Type:* <a href="#cdk8s-pipelines.TaskVolumeMount">TaskVolumeMount</a>[]

The volume mounts to use for the task.

---

##### `workingDir`<sup>Optional</sup> <a name="workingDir" id="cdk8s-pipelines.TaskStep.property.workingDir"></a>

```typescript
public readonly workingDir: string;
```

- *Type:* string

The name of the working directory for the step.

---

### TaskStepEnv <a name="TaskStepEnv" id="cdk8s-pipelines.TaskStepEnv"></a>

An `env` for a `Step` on a `Task`.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskStepEnv.Initializer"></a>

```typescript
import { TaskStepEnv } from 'cdk8s-pipelines'

const taskStepEnv: TaskStepEnv = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskStepEnv.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskStepEnv.property.valueFrom">valueFrom</a></code> | <code><a href="#cdk8s-pipelines.TaskEnvValueSource">TaskEnvValueSource</a></code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskStepEnv.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `valueFrom`<sup>Optional</sup> <a name="valueFrom" id="cdk8s-pipelines.TaskStepEnv.property.valueFrom"></a>

```typescript
public readonly valueFrom: TaskEnvValueSource;
```

- *Type:* <a href="#cdk8s-pipelines.TaskEnvValueSource">TaskEnvValueSource</a>

---

### TaskVolumeMount <a name="TaskVolumeMount" id="cdk8s-pipelines.TaskVolumeMount"></a>

The volume mount for the task.

#### Initializer <a name="Initializer" id="cdk8s-pipelines.TaskVolumeMount.Initializer"></a>

```typescript
import { TaskVolumeMount } from 'cdk8s-pipelines'

const taskVolumeMount: TaskVolumeMount = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskVolumeMount.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskVolumeMount.property.mountPath">mountPath</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskVolumeMount.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `mountPath`<sup>Optional</sup> <a name="mountPath" id="cdk8s-pipelines.TaskVolumeMount.property.mountPath"></a>

```typescript
public readonly mountPath: string;
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
| <code><a href="#cdk8s-pipelines.TaskWorkspace.property.description">description</a></code> | <code>string</code> | The description of the workspace. |
| <code><a href="#cdk8s-pipelines.TaskWorkspace.property.logicalID">logicalID</a></code> | <code>string</code> | *No description.* |

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

The description of the workspace.

---

##### `logicalID`<sup>Optional</sup> <a name="logicalID" id="cdk8s-pipelines.TaskWorkspace.property.logicalID"></a>

```typescript
public readonly logicalID: string;
```

- *Type:* string

---

## Classes <a name="Classes" id="Classes"></a>

### ParameterBuilder <a name="ParameterBuilder" id="cdk8s-pipelines.ParameterBuilder"></a>

#### Initializers <a name="Initializers" id="cdk8s-pipelines.ParameterBuilder.Initializer"></a>

```typescript
import { ParameterBuilder } from 'cdk8s-pipelines'

new ParameterBuilder(id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `id`<sup>Required</sup> <a name="id" id="cdk8s-pipelines.ParameterBuilder.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.ofType">ofType</a></code> | Sets the type of the parameter. |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.withDefaultValue">withDefaultValue</a></code> | Sets the default value for the parameter. |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.withDescription">withDescription</a></code> | Sets the description of the parameter. |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.withName">withName</a></code> | Sets the name of the parameter. |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.withPiplineParameter">withPiplineParameter</a></code> | Sets the default value for the parameter. |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.withValue">withValue</a></code> | Sets the value for the parameter. |

---

##### `ofType` <a name="ofType" id="cdk8s-pipelines.ParameterBuilder.ofType"></a>

```typescript
public ofType(type: string): ParameterBuilder
```

Sets the type of the parameter.

###### `type`<sup>Required</sup> <a name="type" id="cdk8s-pipelines.ParameterBuilder.ofType.parameter.type"></a>

- *Type:* string

---

##### `withDefaultValue` <a name="withDefaultValue" id="cdk8s-pipelines.ParameterBuilder.withDefaultValue"></a>

```typescript
public withDefaultValue(val: string): ParameterBuilder
```

Sets the default value for the parameter.

###### `val`<sup>Required</sup> <a name="val" id="cdk8s-pipelines.ParameterBuilder.withDefaultValue.parameter.val"></a>

- *Type:* string

---

##### `withDescription` <a name="withDescription" id="cdk8s-pipelines.ParameterBuilder.withDescription"></a>

```typescript
public withDescription(desc: string): ParameterBuilder
```

Sets the description of the parameter.

###### `desc`<sup>Required</sup> <a name="desc" id="cdk8s-pipelines.ParameterBuilder.withDescription.parameter.desc"></a>

- *Type:* string

---

##### `withName` <a name="withName" id="cdk8s-pipelines.ParameterBuilder.withName"></a>

```typescript
public withName(name: string): ParameterBuilder
```

Sets the name of the parameter.

###### `name`<sup>Required</sup> <a name="name" id="cdk8s-pipelines.ParameterBuilder.withName.parameter.name"></a>

- *Type:* string

---

##### `withPiplineParameter` <a name="withPiplineParameter" id="cdk8s-pipelines.ParameterBuilder.withPiplineParameter"></a>

```typescript
public withPiplineParameter(pipelineParamName: string, defaultValue?: string): ParameterBuilder
```

Sets the default value for the parameter.

###### `pipelineParamName`<sup>Required</sup> <a name="pipelineParamName" id="cdk8s-pipelines.ParameterBuilder.withPiplineParameter.parameter.pipelineParamName"></a>

- *Type:* string

---

###### `defaultValue`<sup>Optional</sup> <a name="defaultValue" id="cdk8s-pipelines.ParameterBuilder.withPiplineParameter.parameter.defaultValue"></a>

- *Type:* string

---

##### `withValue` <a name="withValue" id="cdk8s-pipelines.ParameterBuilder.withValue"></a>

```typescript
public withValue(val: string): ParameterBuilder
```

Sets the value for the parameter.

###### `val`<sup>Required</sup> <a name="val" id="cdk8s-pipelines.ParameterBuilder.withValue.parameter.val"></a>

- *Type:* string

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.property.requiresPipelineParameter">requiresPipelineParameter</a></code> | <code>boolean</code> | Returns true if this parameter expects input at the pipeline level. |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.property.defaultValue">defaultValue</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.property.logicalID">logicalID</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.property.type">type</a></code> | <code>string</code> | Gets the type of the parameter. |
| <code><a href="#cdk8s-pipelines.ParameterBuilder.property.value">value</a></code> | <code>string</code> | Gets the value of the parameter. |

---

##### `description`<sup>Required</sup> <a name="description" id="cdk8s-pipelines.ParameterBuilder.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `requiresPipelineParameter`<sup>Required</sup> <a name="requiresPipelineParameter" id="cdk8s-pipelines.ParameterBuilder.property.requiresPipelineParameter"></a>

```typescript
public readonly requiresPipelineParameter: boolean;
```

- *Type:* boolean

Returns true if this parameter expects input at the pipeline level.

---

##### `defaultValue`<sup>Optional</sup> <a name="defaultValue" id="cdk8s-pipelines.ParameterBuilder.property.defaultValue"></a>

```typescript
public readonly defaultValue: string;
```

- *Type:* string

---

##### `logicalID`<sup>Optional</sup> <a name="logicalID" id="cdk8s-pipelines.ParameterBuilder.property.logicalID"></a>

```typescript
public readonly logicalID: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.ParameterBuilder.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `type`<sup>Optional</sup> <a name="type" id="cdk8s-pipelines.ParameterBuilder.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* string

Gets the type of the parameter.

---

##### `value`<sup>Optional</sup> <a name="value" id="cdk8s-pipelines.ParameterBuilder.property.value"></a>

```typescript
public readonly value: string;
```

- *Type:* string

Gets the value of the parameter.

---


### PipelineBuilder <a name="PipelineBuilder" id="cdk8s-pipelines.PipelineBuilder"></a>

#### Initializers <a name="Initializers" id="cdk8s-pipelines.PipelineBuilder.Initializer"></a>

```typescript
import { PipelineBuilder } from 'cdk8s-pipelines'

new PipelineBuilder(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineBuilder.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.PipelineBuilder.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk8s-pipelines.PipelineBuilder.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk8s-pipelines.PipelineBuilder.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineBuilder.buildPipeline">buildPipeline</a></code> | Builds the actual [Pipeline]() from the settings configured using the fluid syntax. |
| <code><a href="#cdk8s-pipelines.PipelineBuilder.withDescription">withDescription</a></code> | Provides the name for the pipeline task and will be rendered as the `name` property. |
| <code><a href="#cdk8s-pipelines.PipelineBuilder.withName">withName</a></code> | Provides the name for the pipeline task and will be rendered as the `name` property. |
| <code><a href="#cdk8s-pipelines.PipelineBuilder.withTask">withTask</a></code> | *No description.* |

---

##### `buildPipeline` <a name="buildPipeline" id="cdk8s-pipelines.PipelineBuilder.buildPipeline"></a>

```typescript
public buildPipeline(opts?: BuilderOptions): void
```

Builds the actual [Pipeline]() from the settings configured using the fluid syntax.

###### `opts`<sup>Optional</sup> <a name="opts" id="cdk8s-pipelines.PipelineBuilder.buildPipeline.parameter.opts"></a>

- *Type:* <a href="#cdk8s-pipelines.BuilderOptions">BuilderOptions</a>

---

##### `withDescription` <a name="withDescription" id="cdk8s-pipelines.PipelineBuilder.withDescription"></a>

```typescript
public withDescription(description: string): PipelineBuilder
```

Provides the name for the pipeline task and will be rendered as the `name` property.

###### `description`<sup>Required</sup> <a name="description" id="cdk8s-pipelines.PipelineBuilder.withDescription.parameter.description"></a>

- *Type:* string

---

##### `withName` <a name="withName" id="cdk8s-pipelines.PipelineBuilder.withName"></a>

```typescript
public withName(name: string): PipelineBuilder
```

Provides the name for the pipeline task and will be rendered as the `name` property.

###### `name`<sup>Required</sup> <a name="name" id="cdk8s-pipelines.PipelineBuilder.withName.parameter.name"></a>

- *Type:* string

---

##### `withTask` <a name="withTask" id="cdk8s-pipelines.PipelineBuilder.withTask"></a>

```typescript
public withTask(taskB: TaskBuilder): PipelineBuilder
```

###### `taskB`<sup>Required</sup> <a name="taskB" id="cdk8s-pipelines.PipelineBuilder.withTask.parameter.taskB"></a>

- *Type:* <a href="#cdk8s-pipelines.TaskBuilder">TaskBuilder</a>

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.PipelineBuilder.property.name">name</a></code> | <code>string</code> | Gets the name of the pipeline. |

---

##### `name`<sup>Required</sup> <a name="name" id="cdk8s-pipelines.PipelineBuilder.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Gets the name of the pipeline.

---


### TaskBuilder <a name="TaskBuilder" id="cdk8s-pipelines.TaskBuilder"></a>

This is the builder for creating Tekton `Task` objects that are independent of a `Pipeline`. They.

To use a builder for tasks that will be used in a Pipeline, use the
`PipelineBuilder` instead.

#### Initializers <a name="Initializers" id="cdk8s-pipelines.TaskBuilder.Initializer"></a>

```typescript
import { TaskBuilder } from 'cdk8s-pipelines'

new TaskBuilder(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskBuilder.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskBuilder.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk8s-pipelines.TaskBuilder.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk8s-pipelines.TaskBuilder.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines.TaskBuilder.buildTask">buildTask</a></code> | Builds the `Task`. |
| <code><a href="#cdk8s-pipelines.TaskBuilder.withDescription">withDescription</a></code> | Sets the `description` of the `Task` being built. |
| <code><a href="#cdk8s-pipelines.TaskBuilder.withName">withName</a></code> | Sets the name of the `Task` being built. |
| <code><a href="#cdk8s-pipelines.TaskBuilder.withStep">withStep</a></code> | Adds the given `step` (`TaskStepBuilder`) to the `Task`. |
| <code><a href="#cdk8s-pipelines.TaskBuilder.withStringParam">withStringParam</a></code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskBuilder.withWorkspace">withWorkspace</a></code> | Adds the specified workspace to the `Task`. |

---

##### `buildTask` <a name="buildTask" id="cdk8s-pipelines.TaskBuilder.buildTask"></a>

```typescript
public buildTask(): void
```

Builds the `Task`.

##### `withDescription` <a name="withDescription" id="cdk8s-pipelines.TaskBuilder.withDescription"></a>

```typescript
public withDescription(description: string): TaskBuilder
```

Sets the `description` of the `Task` being built.

###### `description`<sup>Required</sup> <a name="description" id="cdk8s-pipelines.TaskBuilder.withDescription.parameter.description"></a>

- *Type:* string

---

##### `withName` <a name="withName" id="cdk8s-pipelines.TaskBuilder.withName"></a>

```typescript
public withName(name: string): TaskBuilder
```

Sets the name of the `Task` being built.

###### `name`<sup>Required</sup> <a name="name" id="cdk8s-pipelines.TaskBuilder.withName.parameter.name"></a>

- *Type:* string

---

##### `withStep` <a name="withStep" id="cdk8s-pipelines.TaskBuilder.withStep"></a>

```typescript
public withStep(step: TaskStepBuilder): TaskBuilder
```

Adds the given `step` (`TaskStepBuilder`) to the `Task`.

###### `step`<sup>Required</sup> <a name="step" id="cdk8s-pipelines.TaskBuilder.withStep.parameter.step"></a>

- *Type:* <a href="#cdk8s-pipelines.TaskStepBuilder">TaskStepBuilder</a>

---

##### `withStringParam` <a name="withStringParam" id="cdk8s-pipelines.TaskBuilder.withStringParam"></a>

```typescript
public withStringParam(param: ParameterBuilder): TaskBuilder
```

###### `param`<sup>Required</sup> <a name="param" id="cdk8s-pipelines.TaskBuilder.withStringParam.parameter.param"></a>

- *Type:* <a href="#cdk8s-pipelines.ParameterBuilder">ParameterBuilder</a>

---

##### `withWorkspace` <a name="withWorkspace" id="cdk8s-pipelines.TaskBuilder.withWorkspace"></a>

```typescript
public withWorkspace(workspace: WorkspaceBuilder): TaskBuilder
```

Adds the specified workspace to the `Task`.

###### `workspace`<sup>Required</sup> <a name="workspace" id="cdk8s-pipelines.TaskBuilder.withWorkspace.parameter.workspace"></a>

- *Type:* <a href="#cdk8s-pipelines.WorkspaceBuilder">WorkspaceBuilder</a>

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskBuilder.property.logicalID">logicalID</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskBuilder.property.description">description</a></code> | <code>string</code> | Gets the `description` of the `Task`. |
| <code><a href="#cdk8s-pipelines.TaskBuilder.property.name">name</a></code> | <code>string</code> | Gets the name of the `Task` built by the `TaskBuilder`. |
| <code><a href="#cdk8s-pipelines.TaskBuilder.property.parameters">parameters</a></code> | <code><a href="#cdk8s-pipelines.ParameterBuilder">ParameterBuilder</a>[]</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskBuilder.property.workspaces">workspaces</a></code> | <code><a href="#cdk8s-pipelines.WorkspaceBuilder">WorkspaceBuilder</a>[]</code> | *No description.* |

---

##### `logicalID`<sup>Required</sup> <a name="logicalID" id="cdk8s-pipelines.TaskBuilder.property.logicalID"></a>

```typescript
public readonly logicalID: string;
```

- *Type:* string

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk8s-pipelines.TaskBuilder.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

Gets the `description` of the `Task`.

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskBuilder.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Gets the name of the `Task` built by the `TaskBuilder`.

---

##### `parameters`<sup>Optional</sup> <a name="parameters" id="cdk8s-pipelines.TaskBuilder.property.parameters"></a>

```typescript
public readonly parameters: ParameterBuilder[];
```

- *Type:* <a href="#cdk8s-pipelines.ParameterBuilder">ParameterBuilder</a>[]

---

##### `workspaces`<sup>Optional</sup> <a name="workspaces" id="cdk8s-pipelines.TaskBuilder.property.workspaces"></a>

```typescript
public readonly workspaces: WorkspaceBuilder[];
```

- *Type:* <a href="#cdk8s-pipelines.WorkspaceBuilder">WorkspaceBuilder</a>[]

---


### TaskRef <a name="TaskRef" id="cdk8s-pipelines.TaskRef"></a>

A `Task` reference.

Will be generated as a `taskRef`.

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
| <code><a href="#cdk8s-pipelines.TaskRef.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskRef.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---


### TaskStepBuilder <a name="TaskStepBuilder" id="cdk8s-pipelines.TaskStepBuilder"></a>

#### Initializers <a name="Initializers" id="cdk8s-pipelines.TaskStepBuilder.Initializer"></a>

```typescript
import { TaskStepBuilder } from 'cdk8s-pipelines'

new TaskStepBuilder()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.buildTaskStep">buildTaskStep</a></code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.fromScriptObject">fromScriptObject</a></code> | If supplied, uses the cdk8s `ApiObject` supplied as the body of the `script` for the `Task`. |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.fromScriptUrl">fromScriptUrl</a></code> | If supplied, uses the content found at the given URL for the `script` value of the step. |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.withArgs">withArgs</a></code> | The args to use with the `command`. |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.withCommand">withCommand</a></code> | The name of the command to use when running the `Step` of the `Task`. |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.withEnv">withEnv</a></code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.withImage">withImage</a></code> | The name of the image to use when executing the `Step` on the `Task`. |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.withName">withName</a></code> | *No description.* |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.withWorkingDir">withWorkingDir</a></code> | The `workingDir` of the `Task`. |

---

##### `buildTaskStep` <a name="buildTaskStep" id="cdk8s-pipelines.TaskStepBuilder.buildTaskStep"></a>

```typescript
public buildTaskStep(): TaskStep
```

##### `fromScriptObject` <a name="fromScriptObject" id="cdk8s-pipelines.TaskStepBuilder.fromScriptObject"></a>

```typescript
public fromScriptObject(obj: any): TaskStepBuilder
```

If supplied, uses the cdk8s `ApiObject` supplied as the body of the `script` for the `Task`.

This is most useful when used with `oc apply` or
other tasks in which you want to apply the object during the step in the
pipeline.

If you supply this, do not supply a value for `fromScriptUrl`.

###### `obj`<sup>Required</sup> <a name="obj" id="cdk8s-pipelines.TaskStepBuilder.fromScriptObject.parameter.obj"></a>

- *Type:* any

---

##### `fromScriptUrl` <a name="fromScriptUrl" id="cdk8s-pipelines.TaskStepBuilder.fromScriptUrl"></a>

```typescript
public fromScriptUrl(url: string): TaskStepBuilder
```

If supplied, uses the content found at the given URL for the `script` value of the step.

Use this as an alternative to "heredoc", which
is embedding hard-coded shell or other scripts in the step.

If you supply this, do not supply a value for `fromScriptObject`.

###### `url`<sup>Required</sup> <a name="url" id="cdk8s-pipelines.TaskStepBuilder.fromScriptUrl.parameter.url"></a>

- *Type:* string

---

##### `withArgs` <a name="withArgs" id="cdk8s-pipelines.TaskStepBuilder.withArgs"></a>

```typescript
public withArgs(args: string[]): TaskStepBuilder
```

The args to use with the `command`.

###### `args`<sup>Required</sup> <a name="args" id="cdk8s-pipelines.TaskStepBuilder.withArgs.parameter.args"></a>

- *Type:* string[]

---

##### `withCommand` <a name="withCommand" id="cdk8s-pipelines.TaskStepBuilder.withCommand"></a>

```typescript
public withCommand(cmd: string[]): TaskStepBuilder
```

The name of the command to use when running the `Step` of the `Task`.

If
`command` is specified, do not specify `script`.

###### `cmd`<sup>Required</sup> <a name="cmd" id="cdk8s-pipelines.TaskStepBuilder.withCommand.parameter.cmd"></a>

- *Type:* string[]

---

##### `withEnv` <a name="withEnv" id="cdk8s-pipelines.TaskStepBuilder.withEnv"></a>

```typescript
public withEnv(name: string, valueFrom: TaskEnvValueSource): TaskStepBuilder
```

###### `name`<sup>Required</sup> <a name="name" id="cdk8s-pipelines.TaskStepBuilder.withEnv.parameter.name"></a>

- *Type:* string

---

###### `valueFrom`<sup>Required</sup> <a name="valueFrom" id="cdk8s-pipelines.TaskStepBuilder.withEnv.parameter.valueFrom"></a>

- *Type:* <a href="#cdk8s-pipelines.TaskEnvValueSource">TaskEnvValueSource</a>

---

##### `withImage` <a name="withImage" id="cdk8s-pipelines.TaskStepBuilder.withImage"></a>

```typescript
public withImage(img: string): TaskStepBuilder
```

The name of the image to use when executing the `Step` on the `Task`.

###### `img`<sup>Required</sup> <a name="img" id="cdk8s-pipelines.TaskStepBuilder.withImage.parameter.img"></a>

- *Type:* string

---

##### `withName` <a name="withName" id="cdk8s-pipelines.TaskStepBuilder.withName"></a>

```typescript
public withName(name: string): TaskStepBuilder
```

###### `name`<sup>Required</sup> <a name="name" id="cdk8s-pipelines.TaskStepBuilder.withName.parameter.name"></a>

- *Type:* string

---

##### `withWorkingDir` <a name="withWorkingDir" id="cdk8s-pipelines.TaskStepBuilder.withWorkingDir"></a>

```typescript
public withWorkingDir(dir: string): TaskStepBuilder
```

The `workingDir` of the `Task`.

###### `dir`<sup>Required</sup> <a name="dir" id="cdk8s-pipelines.TaskStepBuilder.withWorkingDir.parameter.dir"></a>

- *Type:* string

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.property.args">args</a></code> | <code>string[]</code> | Gets the command-line arguments that will be supplied to the `command`. |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.property.command">command</a></code> | <code>string[]</code> | Gets the command used for the `Step` on the `Task`. |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.property.image">image</a></code> | <code>string</code> | The name of the container `image` used to execute the `Step` of the `Task`. |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.property.name">name</a></code> | <code>string</code> | The name of the `Step` of the `Task`. |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.property.scriptObj">scriptObj</a></code> | <code>cdk8s.ApiObject</code> | Gets the object that is used for the `script` value, if there is one defined. |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.property.scriptUrl">scriptUrl</a></code> | <code>string</code> | Gets the URL from which the script data should be loaded, if it is defined. |
| <code><a href="#cdk8s-pipelines.TaskStepBuilder.property.workingDir">workingDir</a></code> | <code>string</code> | *No description.* |

---

##### `args`<sup>Optional</sup> <a name="args" id="cdk8s-pipelines.TaskStepBuilder.property.args"></a>

```typescript
public readonly args: string[];
```

- *Type:* string[]

Gets the command-line arguments that will be supplied to the `command`.

---

##### `command`<sup>Optional</sup> <a name="command" id="cdk8s-pipelines.TaskStepBuilder.property.command"></a>

```typescript
public readonly command: string[];
```

- *Type:* string[]

Gets the command used for the `Step` on the `Task`.

---

##### `image`<sup>Optional</sup> <a name="image" id="cdk8s-pipelines.TaskStepBuilder.property.image"></a>

```typescript
public readonly image: string;
```

- *Type:* string

The name of the container `image` used to execute the `Step` of the `Task`.

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.TaskStepBuilder.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the `Step` of the `Task`.

---

##### `scriptObj`<sup>Optional</sup> <a name="scriptObj" id="cdk8s-pipelines.TaskStepBuilder.property.scriptObj"></a>

```typescript
public readonly scriptObj: ApiObject;
```

- *Type:* cdk8s.ApiObject

Gets the object that is used for the `script` value, if there is one defined.

---

##### `scriptUrl`<sup>Optional</sup> <a name="scriptUrl" id="cdk8s-pipelines.TaskStepBuilder.property.scriptUrl"></a>

```typescript
public readonly scriptUrl: string;
```

- *Type:* string

Gets the URL from which the script data should be loaded, if it is defined.

---

##### `workingDir`<sup>Optional</sup> <a name="workingDir" id="cdk8s-pipelines.TaskStepBuilder.property.workingDir"></a>

```typescript
public readonly workingDir: string;
```

- *Type:* string

---


### WorkspaceBuilder <a name="WorkspaceBuilder" id="cdk8s-pipelines.WorkspaceBuilder"></a>

#### Initializers <a name="Initializers" id="cdk8s-pipelines.WorkspaceBuilder.Initializer"></a>

```typescript
import { WorkspaceBuilder } from 'cdk8s-pipelines'

new WorkspaceBuilder(id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.WorkspaceBuilder.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `id`<sup>Required</sup> <a name="id" id="cdk8s-pipelines.WorkspaceBuilder.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines.WorkspaceBuilder.withDescription">withDescription</a></code> | *No description.* |
| <code><a href="#cdk8s-pipelines.WorkspaceBuilder.withName">withName</a></code> | *No description.* |

---

##### `withDescription` <a name="withDescription" id="cdk8s-pipelines.WorkspaceBuilder.withDescription"></a>

```typescript
public withDescription(desc: string): WorkspaceBuilder
```

###### `desc`<sup>Required</sup> <a name="desc" id="cdk8s-pipelines.WorkspaceBuilder.withDescription.parameter.desc"></a>

- *Type:* string

---

##### `withName` <a name="withName" id="cdk8s-pipelines.WorkspaceBuilder.withName"></a>

```typescript
public withName(name: string): WorkspaceBuilder
```

###### `name`<sup>Required</sup> <a name="name" id="cdk8s-pipelines.WorkspaceBuilder.withName.parameter.name"></a>

- *Type:* string

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines.WorkspaceBuilder.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.WorkspaceBuilder.property.logicalID">logicalID</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines.WorkspaceBuilder.property.name">name</a></code> | <code>string</code> | *No description.* |

---

##### `description`<sup>Required</sup> <a name="description" id="cdk8s-pipelines.WorkspaceBuilder.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `logicalID`<sup>Optional</sup> <a name="logicalID" id="cdk8s-pipelines.WorkspaceBuilder.property.logicalID"></a>

```typescript
public readonly logicalID: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="cdk8s-pipelines.WorkspaceBuilder.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---



