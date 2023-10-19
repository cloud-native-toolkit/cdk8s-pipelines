import * as path from 'path';
import { Chart, Testing } from 'cdk8s';
import { ChartProps } from 'cdk8s/lib/chart';
import { Construct } from 'constructs';
import { buildParam, buildWorkingDir, secretKeyRef, TaskBuilder, TaskStepBuilder, valueFrom, WorkspaceBuilder, ParameterBuilder } from '../src';

/**
 * Using "ansible-runner" as the reference task that I want this test builder to
 * be able to create. See https://github.com/tektoncd/catalog/blob/main/task/ansible-runner/0.2/ansible-runner.yaml
 */
class TestBasicTaskBuild extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const imageName = '$(params.image)';

    const runnerDir = new WorkspaceBuilder('runner-dir')
      .withDescription('The Ansibler runner directory');

    const projectDirName = new ParameterBuilder('project-dir')
      .ofType('string')
      .withPiplineParameter('project-dir');

    new TaskBuilder(this, 'my-task')
      .withName('ansible-runner')
      .withDescription('Task to run Ansible playbooks using Ansible Runner')
      .withWorkspace(runnerDir)
      .withStringParam(projectDirName)
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

class TestBasicTaskBuildFromObject extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const imageName = '$(params.image)';

    // TODO: There is a Namespace object in the core library but it does not extend from ApiObject.
    const myNamespace = {
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: {
        name: 'MyNamespace',
      },
    };

    const myCatalogSource = {
      apiVersion: 'operators.coreos.com/v1alpha1',
      kind: 'CatalogSource',
      metadata: {
        name: 'ibm-operator-catalog',
        namespace: 'openshift-marketplace',
      },
      spec: {
        displayName: 'IBM Operator Catalog',
        publisher: 'IBM',
        sourceType: 'grpc',
        image: 'icr.io/cpopen/ibm-operator-catalog',
        updateStrategy: {
          registryPoll: {
            interval: '45m',
          },
        },
      },
    };

    const runnerDir = new WorkspaceBuilder('runner-dir')
      .withDescription('The Ansibler runner directory');

    const projectDirName = new ParameterBuilder('project-dir')
      .ofType('string')
      .withPiplineParameter('project-dir');

    new TaskBuilder(this, 'my-task')
      .withName('ansible-runner')
      .withDescription('Task to run Ansible playbooks using Ansible Runner')
      .withWorkspace(runnerDir)
      .withStringParam(projectDirName)
      .withStep(new TaskStepBuilder()
        .withName('requirements')
        .withImage(imageName)
        .fromScriptObject(myNamespace))
      .withStep(new TaskStepBuilder()
        .withName('run-playbook')
        .withImage(imageName)
        .fromScriptObject(myCatalogSource))
      .buildTask();
  }
}

class TestBasicTaskBuildFromScriptData extends Chart {

  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    new TaskBuilder(this, 'my-task')
      .withName('ansible-runner')
      .withDescription('Task to run Ansible playbooks using Ansible Runner')
      .withStep(new TaskStepBuilder()
        .withName('requirements')
        .withImage('docker.io/hello-world')
        .fromScriptData('#!/usr/bin/env bash\necho this is my script data'))
      .buildTask();
  }
}

/**
 * This is a test to make sure the TaskBuilder is fully-featured enough to support
 * building a task like the one here: https://github.com/cloud-native-toolkit/deployer-tekton-tasks/blob/main/tasks/ibmcloud-secrets-manager-get/0.1/ibmcloud-secrets-manager-get.yaml
 */
class TestIBMCloudSecretsManagerGet extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    // Build the task, using the https://github.com/tektoncd/catalog/blob/main/task/pull-request/0.1/pull-request.yaml
    // as the example, just like with the `task.test.ts`. At some point, it would
    // be nice to compare the snapshots with each other just to make sure that the
    // builder does build the exact same object as the longer, non-builder method.
    new TaskBuilder(this, 'ibmcloud-secrets-manager-get')
      .withName('ibmcloud-secrets-manager-get')
      .withLabel('app.kubernetes.io/version', '0.1')
      .withAnnotation('tekton.dev/categories', 'IBM Cloud')
      .withAnnotation('tekton.dev/pipelines.minVersion', '0.17.0')
      .withAnnotation('tekton.dev/tags', 'cli')
      .withAnnotation('tekton.dev/displayName', 'IBM Cloud Secrets Manager Get Secret')
      .withAnnotation('tekton.dev/platforms', 'linux/amd64')
      .withDescription('This task retrieves a secret from IBM Cloud Secrets Manager using a key ID')
      .withStringParam(new ParameterBuilder('KEY_ID')
        .withDefaultValue('968d7819-f2c5-7b67-c420-3c6bfd51521e')
        .withDescription('An IBM Cloud Secrets Manager key ID'))
      .withStep(new TaskStepBuilder().withName('retrieve-key')
        .withImage('quay.io/openshift/origin-cli:4.7')
        .fromScriptUrl('test/files/retrieve-secret.sh'))
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
      .withStringParam(new ParameterBuilder('mode')
        .withPiplineParameter('mode')
        .withDescription('If "download", the state of the pull request at `url` will be fetched. If "upload" then the pull request at `url` will be updated.'))
      .withStringParam(new ParameterBuilder('url')
        .withPiplineParameter('repo-url')
        .withDescription('The URL of the Pull Reuqest, e.g. `https://github.com/bobcatfish/catservice/pull/16`'))
      .withStringParam(new ParameterBuilder('provider')
        .withPiplineParameter('provider')
        .withDescription('The type of SCM system, currently `github` or `gitlab`'))
      .withStringParam(new ParameterBuilder('secret-key-ref')
        .withPiplineParameter('secret-key-ref')
        .withDescription('The name of an opaque secret containing a key called "token" with a base64 encoded SCM token'))
      .withStringParam(new ParameterBuilder('insecure-skip-tls-verify')
        .withDefaultValue('false')
        .withDescription('If "true", certificate validation will be disabled'))
      .withWorkspace(new WorkspaceBuilder('pr'))
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
  test('TaskBuilderIBMSecretGet', () => {
    const app = Testing.app();
    const chart = new TestIBMCloudSecretsManagerGet(app, 'test-get-secret');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
  test('PullRequestTaskBuilder', () => {
    const app = Testing.app();
    const chart = new TestPullRequestTaskBuild(app, 'pull-request');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
  test('ObjectTaskBuilder', () => {
    const app = Testing.app();
    const chart = new TestBasicTaskBuildFromObject(app, 'apply-object');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
  test('ScriptDataBuilder', () => {
    const app = Testing.app();
    const chart = new TestBasicTaskBuildFromScriptData(app, 'apply-object');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
