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

describe('PipelineBuilderTest', () => {
  test('PipelineBuilder', () => {
    const app = Testing.app();
    const chart = new MyTestChart(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });

  test('PipelineBuilderWithDuplicates', () => {
    const app = Testing.app();
    const chart = new MyTestChartWithDups(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
