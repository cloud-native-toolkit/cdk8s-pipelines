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
