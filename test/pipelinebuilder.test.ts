import { Chart, Testing } from 'cdk8s';
import { ChartProps } from 'cdk8s/lib/chart';
import { Construct } from 'constructs';
// @ts-ignore
import { Pipeline, PipelineBuilder, PipelineTaskBuilder, PipelineTaskDef, TaskRef } from '../src';

class MyTestChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myTask = new PipelineTaskBuilder()
      .withName('fetch-source')
      .withTaskReference('git-clone')
      .withWorkspace('output', 'shared-data', 'The files cloned by the task')
      .withStringParam('url', 'repo-url', '$(params.repo-url)');

    new PipelineBuilder(this, 'my-pipeline')
      .withName('clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .build();
  }
}

describe('PipelineBuilderTest', () => {
  test('PipelineBuilder', () => {
    const app = Testing.app();
    const chart = new MyTestChart(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
