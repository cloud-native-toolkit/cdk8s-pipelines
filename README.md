# CDK8s Pipelines

This is a construct for creating [Pipelines](https://tekton.dev/docs/getting-started/pipelines/)
using [cdk8s](https://cdk8s.io/docs/latest/).

In Cloud Development Kit (CDK) terminology, a _construct_ is a code object (class
or application) that can be _synthesized_ to output. In AWS's CDK, that output
is CloudFormation. Here, in a cdk8s construct, that output is YAML that can be
applied on a Kubernetes or OpenShift cluster. Constructs can be used in other
constructs, just like how code classes can by used by other classes.

This library allows you to create your own Tekton pipeline constructs, which can
then in turn be synthesized into Task, Pipeline, and PipelineRun YAML.

## Installing prerequisites

The commands here will use `npx`, using Node 18.x and NPM 9.x. You will also 
need `yarn` 1.x (1.22.21 was used here) installed.

## Using the library to create your own pipeline constructs

The `projen` command was used to create this construct library and is the easiest
way to create a new construct. The documentation here will show how to use `projen`
to generate your pipeline construct.

### Creating your project

To create your pipeline project, run the following command, where `my-pipeline-project`
is the name you want to give your project's directory:

```bash
$ mkdir my-pipeline-project
$ cd my-pipeline-project
$ npx projen new cdk8s-app-ts
```

This will generate a TypeScript project with the cdk8s `constructs` libraries
with the correct structure. 

> ***Why TypeScript and not some other language (e.g., Python)? Because TypeScript can be used to generate all the others.***

The command will also initialize a git repository and make an initial commit.


### Adding this library to your project

When using `projen`, modify the _.projenrc.ts_ file to add the libraries
and then run the `npx projen` command--with no additional arguments--to
re-generate the _package.json_ and _yarn.lock_ files and any other files
in the project. When using `projen`, only modify the _.projenrc.ts_ file
and the files in the _src_ folder.

Modify the _.projenrc.ts_ file and add the following lines to `deps` JSON
element:

```typescript
const project = new cdk8s.Cdk8sTypeScriptApp({
  // snipped, leave content as-is...
  deps: [
    'cdk8s-pipelines',
    'cdk8s-pipelines-lib',
  ],
  // snipped, leave content as-is...
});
```

Save the file after you have made the additions and then run the `npx projen`
command to re-generate the project files.

### Modifying the main Chart

The _src/main.ts_ file contains the main code that you will modify for your 
Pipeline construct. Like any other TypeScript project, you can create classes
and functions in other files and import them for use.

By default, the template includes a class called `MyChart` that extends from
the cdk8s core `Chart` class. You can rename this class to something a bit
more meaningful, such as `InstallXYZPipelineChart`.

The `constructor` function contains the code that will create the chart. Here,
replace the sample code with something that looks like this:

```typescript
export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    new PipelineBuilder(this, 'my-pipeline')
      .withName('clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(new TaskBuilder(this, 'fetch-source')
        .withName('git-clone')
        .withWorkspace(new WorkspaceBuilder('output').withName('task-output'))
        .withStringParam(new ParameterBuilder('url').withPiplineParameter('url').withDescription('the URL for the thing')))
      .buildPipeline();
  }
}
```

Start with the imports shown here and add as needed:

```typescript
import { App, Chart, ChartProps } from 'cdk8s';
import { ParameterBuilder, PipelineBuilder, TaskBuilder, WorkspaceBuilder } from 'cdk8s-pipelines';
import { Construct } from 'constructs';
```

## Examples

Shown here is an example of using one of the primitive Tekton objects--a 
[Pipeline](https://tekton.dev/docs/pipelines/) using cdk8s-pipelines. 

```typescript
const pipeline = new Pipeline(this, 'my-pipeline');
```

### Pipeline objects and builders

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
