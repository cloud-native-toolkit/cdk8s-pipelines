import * as path from 'path';
import { Chart, Testing } from 'cdk8s';
import { ChartProps } from 'cdk8s/lib/chart';
import { Construct } from 'constructs';
import { buildParam, buildWorkingDir, secretKeyRef, TaskBuilder, TaskStepBuilder, valueFrom } from '../src';

/**
 * Using "ansible-runner" as the reference task that I want this test builder to
 * be able to create. See https://github.com/tektoncd/catalog/blob/main/task/ansible-runner/0.2/ansible-runner.yaml
 */
class TestBasicTaskBuild extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const imageName = '$(params.image)';

    new TaskBuilder(this, 'my-task')
      .withName('ansible-runner')
      .withDescription('Task to run Ansible playbooks using Ansible Runner')
      .withWorkspace('runner-dir', 'The Ansibler runner directory')
      .withStringParam('project-dir' )
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

class TestPullRequestTaskBuild extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    // Build the task, using the https://github.com/tektoncd/catalog/blob/main/task/pull-request/0.1/pull-request.yaml
    // as the example, just like with the `task.test.ts`. At some point, it would
    // be nice to compare the snapshots with each other just to make sure that the
    // builder does build the exact same object as the longer, non-builder method.
    new TaskBuilder(this, 'pull-request')
      .withName('pull-request')
      .withDescription('This Task allows a user to interact with an SCM (source control management)\nsystem through an abstracted interface\n\nThis Task works with both public SCM instances and self-hosted/enterprise GitHub/GitLab\ninstances. In download mode, this Task will look at the state of an existing pull\nrequest and populate the pr workspace with the state of the pull request, including the\n.MANIFEST file. In upload mode, this Task will look at the contents of the pr workspace\n and compare it to the .MANIFEST file (if it exists).')
      .withStringParam('mode', 'If "download", the state of the pull request at `url` will be fetched. If "upload" then the pull request at `url` will be updated.')
      .withStringParam('url', 'The URL of the Pull Reuqest, e.g. `https://github.com/bobcatfish/catservice/pull/16`')
      .withStringParam('provider', 'The type of SCM system, currently `github` or `gitlab`')
      .withStringParam('secret-key-ref', 'The name of an opaque secret containing a key called "token" with a base64 encoded SCM token')
      .withStringParam('insecure-skip-tls-verify', 'If "true", certificate validation will be disabled', 'false')
      .withWorkspace('pr')
      .withStep(new TaskStepBuilder()
        .withName('pullrequest-init')
        .withImage('gcr.io/tekton-releases/github.com/tektoncd/pipeline/cmd/pullrequest-init@sha256:69633ecd0e948f6462c61bb9e008b940a05b143ef51c67e6e4093278a23dac53')
        .withCommand(['/ko-app/pullrequest-init'])
        .withEnv('AUTH_TOKEN', valueFrom(secretKeyRef(buildParam('secret-key-ref'), 'token')))
        .withArgs([
          '-url',
          '$(params.url)',
          '-path',
          '$(workspaces.pr.path)',
          '-mode',
          '$(params.mode)',
          '-provider',
          '$(params.provider)',
          '-insecure-skip-tls-verify',
          '$(params.insecure-skip-tls-verify)',
        ]))
      .buildTask();
  }

}

describe('TaskBuilderTest', () => {
  test('TaskBuilderBasic', () => {
    const app = Testing.app();
    const chart = new TestBasicTaskBuild(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
  test('PullRequestTaskBuilder', () => {
    const app = Testing.app();
    const chart = new TestPullRequestTaskBuild(app, 'pull-request');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
