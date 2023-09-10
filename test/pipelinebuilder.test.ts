import { Chart, Testing } from 'cdk8s';
import { ChartProps } from 'cdk8s/lib/chart';
import { Construct } from 'constructs';
// @ts-ignore
import { Pipeline, PipelineBuilder, PipelineTaskBuilder, PipelineTaskDef, TaskRef, TaskBuilder, WorkspaceBuilder, ParameterBuilder } from '../src';

class MyTestChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myTask = new TaskBuilder(this, 'git-clone')
      .withName('fetch-source')
      .withWorkspace(new WorkspaceBuilder('output')
        .withName('shared-data')
        .withDescription('The files cloned by the task'))
      .withStringParam(new ParameterBuilder('url').withPiplineParameter('repo-url', ''));

    new PipelineBuilder(this, 'my-pipeline')
      .withName('clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .buildPipeline();
  }
}

class MySecondTestChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myTask = new TaskBuilder(this, 'git-clone')
      .withName('fetch-source')
      .withWorkspace(new WorkspaceBuilder('output')
        .withName('shared-data')
        .withDescription('The files cloned by the task'))
      .withWorkspace(new WorkspaceBuilder('ssh-credentials')
        .withName('ssh-creds')
        .withDescription('The SSH files for credentials'))
      .withWorkspace(new WorkspaceBuilder('config')
        .withName('config-data')
        .withDescription('The files for configuration for stuff'))
      .withStringParam(new ParameterBuilder('url').withPiplineParameter('repo-url', ''))
      .withStringParam(new ParameterBuilder('name').withPiplineParameter('your-name', ''))
      .withStringParam(new ParameterBuilder('color').withPiplineParameter('your-color', ''))
      .withStringParam(new ParameterBuilder('quest').withPiplineParameter('your-quest', ''));

    new PipelineBuilder(this, 'my-test-pipeline-2')
      .withName('clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .buildPipeline();
  }
}

class MyTestChartWithDups extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myWorkspace = new WorkspaceBuilder('output')
      .withDescription('The files cloned by the task')
      .withName('shared-data');

    const urlParam = new ParameterBuilder('url')
      .withPiplineParameter('repo-url', '');

    const myTask = new TaskBuilder(this, 'git-clone')
      .withName('fetch-source')
      .withWorkspace(myWorkspace)
      .withStringParam(urlParam)
    ;

    const myTask2 = new TaskBuilder(this, 'cat-readme')
      .withName('print-readme')
      .withWorkspace(myWorkspace)
      .withStringParam(urlParam)
    ;

    new PipelineBuilder(this, 'my-pipeline')
      .withName('clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .withTask(myTask2)
      .buildPipeline();
  }
}

class MyTestChartWithStaticOverride extends Chart {

  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const urlParam = new ParameterBuilder('url')
      .withPiplineParameter('repo-url', '');

    const myTask2 = new TaskBuilder(this, 'cat-readme')
      .withName('print-readme')
      .withStringParam(urlParam)
    ;

    // This should override the parameter with a static value.
    myTask2.withStringParam(new ParameterBuilder('url').withValue('https://api.example.io'));

    new PipelineBuilder(this, 'my-pipeline')
      .withName('clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask2)
      .buildPipeline();
  }
}

describe('PipelineBuilderTest', () => {
  test('PipelineBuilder', () => {
    const app = Testing.app();
    const chart = new MyTestChart(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });

  test('PipelineBuilderWithComplexTasks', () => {
    const app = Testing.app();
    const chart = new MySecondTestChart(app, 'my-second-test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });

  test('PipelineBuilderWithDuplicates', () => {
    const app = Testing.app();
    const chart = new MyTestChartWithDups(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });

  test('PipelineBuilderWithStaticOverride', () => {
    const app = Testing.app();
    const chart = new MyTestChartWithStaticOverride(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
