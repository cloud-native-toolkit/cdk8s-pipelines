import { Chart, Testing } from 'cdk8s';
import { ChartProps } from 'cdk8s/lib/chart';
import { Construct } from 'constructs';
// @ts-ignore
import { Pipeline, PipelineTaskBuilder, PipelineTaskDef, TaskRef } from '../src';

class MyTestChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myTask = new PipelineTaskBuilder()
      .withName('fetch-source')
      .withTaskReference('git-clone')
      .withWorkspace('output', 'shared-files', 'The files cloned by the task')
      .withStringParam('url', 'repo-url');

    const pipeline = new Pipeline(this, 'my-pipeline', {
      name: 'my-pipleine',
    });
    pipeline.addTask(myTask);
  }
}

describe('Placeholder', () => {
  test('Empty', () => {
    const app = Testing.app();
    const chart = new MyTestChart(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
