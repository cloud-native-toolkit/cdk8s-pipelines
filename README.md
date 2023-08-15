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
resources:

```typescript
new Pipeline(this, 'my-pipeline', {
  
});
```

Alternatively, using the _builders_ (e.g., `PipelineBuilder`) for the resources
provides a fluid syntax that you can use to add the resources with cross-references
made for you automatically. Here is the same construct, but defined using the 
`PipelineBuilder`.

```typescript
PipelineBuilder.create(this)
  .name('my-pipeline')
  .withTask(PipelineTaskBuilder()
          .name('fetch-source')   
          .referencingTask('git-clone')
          .usingWorkspace('output', 'shared-files', 'The files cloned by the task')
          .withStringParam('foo', pipelineParam('foo'), 'defaultFooValue')
  )
  .build();
```

The `build` method on the builders will validate the parameters and, if the 
object is valid, will create the construct, making sure to add `workspace`
and `param` resources to the Task as well as the 

Any resources that the `task` requires that needs to be defined at the `pipeline`

## Related projects

This is the core project with the basic Pipeline constructs. There are other 
constructs that use this construct to develop richer pipelines and tasks that
are based on tasks available in [Tekton Hub](https://hub.tekton.dev/).

* [cdk8s-pipelines-cdk](TODO) - A construct that allows you to easily create 
 Tekton pipelines that use [AWS CDK](https://aws.amazon.com/cdk/) projects from 
 GitHub to deploy CDK resources to an AWS account. 
