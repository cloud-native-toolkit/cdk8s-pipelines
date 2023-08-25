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
