import { Chart, Testing } from 'cdk8s';
import { ChartProps } from 'cdk8s/lib/chart';
import { Construct } from 'constructs';
// @ts-ignore
import { Task } from '../src';

class MyTestChart extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);
    // This is taken from the example shown at https://github.com/tektoncd/catalog/blob/main/task/pull-request/0.1/pull-request.yaml
    // to make sure that the structure supports the basic example. Other tests
    // will demonstrate creating some more complex pipelines.
    new Task(this, 'test-task', {
      metadata: {
        name: 'pull-request',
        annotations: {
          'tekton.dev/pipelines.minVersion': '0.12.1',
          'tekton.dev/pipelines.categories': 'Git',
          'tekton.dev/pipelines.tags': 'SCM',
          'tekton.dev/pipelines.displayName': 'pull request',
          'tekton.dev/pipelines.platforms': 'linux/amd64,linux/s390x,linux/ppc64le',
        },
        labels: {
          'app.kubernetes.io/version': '0.1',
        },
      },
      spec: {
        description: 'This Task allows a user to interact with an SCM (source control management)\nsystem through an abstracted interface\n\nThis Task works with both public SCM instances and self-hosted/enterprise GitHub/GitLab\ninstances. In download mode, this Task will look at the state of an existing pull\nrequest and populate the pr workspace with the state of the pull request, including the\n.MANIFEST file. In upload mode, this Task will look at the contents of the pr workspace\n and compare it to the .MANIFEST file (if it exists).',
        params: [
          {
            name: 'mode',
            description: 'If "download", the state of the pull request at `url` will be fetched. If "upload" then the pull request at `url` will be updated.',
          },
          {
            name: 'url',
            description: 'The URL of the Pull Reuqest, e.g. `https://github.com/bobcatfish/catservice/pull/16`',
          },
          {
            name: 'provider',
            description: 'The type of SCM system, currently `github` or `gitlab`',
          },
          {
            name: 'secret-key-ref',
            description: 'The name of an opaque secret containing a key called "token" with a base64 encoded SCM token',
          },
          {
            name: 'insecure-skip-tls-verify',
            description: 'If "true", certificate validation will be disabled',
            default: 'false',
          },
        ],
        workspaces: [
          {
            name: 'pr',
          },
        ],
        steps: [
          {
            name: 'pullrequest-init',
            image: 'gcr.io/tekton-releases/github.com/tektoncd/pipeline/cmd/pullrequest-init@sha256:69633ecd0e948f6462c61bb9e008b940a05b143ef51c67e6e4093278a23dac53',
            command: [],
            env: [
              {
                name: 'AUTH_TOKEN',
                valueFrom: {
                  secretKeyRef: {
                    name: '$(params.secret-key-ref)',
                    key: 'token',
                  },
                },
              },
            ],
            args: [
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
            ],
          },
        ],
      },
    });
  }
}

describe('SampleTask', () => {
  test('', () => {
    const app = Testing.app();
    const chart = new MyTestChart(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
