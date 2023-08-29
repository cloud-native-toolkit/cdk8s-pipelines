import * as path from 'path';
import { Chart, Testing } from 'cdk8s';
import { ChartProps } from 'cdk8s/lib/chart';
import { Construct } from 'constructs';
import { buildParam, buildWorkingDir, TaskBuilder, TaskStepBuilder } from '../src';

/**
 * Using "ansible-runner" as the reference task that I want this test builder to
 * be able to create. See https://github.com/tektoncd/catalog/blob/main/task/ansible-runner/0.2/ansible-runner.yaml
 */
class MyTaskChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const imageName = '$(params.image)';

    new TaskBuilder(this, 'my-task')
      .withName('ansible-runner')
      .withStep(new TaskStepBuilder()
        .withName('requirements')
        .withImage(imageName)
        .fromScriptUrl(path.resolve('test', 'files', 'requirements-script.sh'))
        .withWorkingDir('$(workspaces.runner-dir.path)/$(params.project-dir)'))
      .withStep(new TaskStepBuilder()
        .withName('run-playbook')
        .withImage(imageName)
        .withCommand(['entrypoint'])
        .withArgs(['ansible-runner', 'run', buildParam('args'), buildParam('project-dir')])
        .withWorkingDir(buildWorkingDir('runner-dir')))
      .buildTask();
  }
}

describe('TaskBuilderTest', () => {
  test('TaskBuilder', () => {
    const app = Testing.app();
    const chart = new MyTaskChart(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
