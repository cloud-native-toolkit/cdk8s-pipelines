import { Chart, Testing } from 'cdk8s';
import { ChartProps } from 'cdk8s/lib/chart';
import { Construct } from 'constructs';
// @ts-ignore
import { Pipeline, PipelineBuilder, PipelineTaskBuilder, PipelineTaskDef, TaskRef } from '../src';

class MyTestChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);
    // This is taken from the example shown at https://tekton.dev/docs/how-to-guides/kaniko-build-push/
    // to make sure that the structure supports the basic example. Other tests
    // will demonstrate creating some more complex pipelines.
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
  }
}

describe('SamplePipeline', () => {
  test('ClonePipeline', () => {
    const app = Testing.app();
    const chart = new MyTestChart(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
