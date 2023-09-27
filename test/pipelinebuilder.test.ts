import { Chart, Testing } from 'cdk8s';
import { ChartProps } from 'cdk8s/lib/chart';
import { Construct } from 'constructs';
// @ts-ignore
import {
  ParameterBuilder,
  PipelineBuilder,
  PipelineRunBuilder,
  TaskBuilder,
  WorkspaceBuilder,
} from '../src';

class PipelineRunTest extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myTask = new TaskBuilder(this, 'fetch-source')
      .withName('git-clone')
      .withWorkspace(new WorkspaceBuilder('output')
        .withName('shared-data')
        .withDescription('The files cloned by the task'))
      .withStringParam(new ParameterBuilder('url').withPiplineParameter('repo-url', ''));

    const pipeline = new PipelineBuilder(this, 'my-pipeline')
      .withName('clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask);
    pipeline.buildPipeline({ includeDependencies: true });

    new PipelineRunBuilder(this, 'my-pipeline-run', pipeline)
      .withRunParam('repo-url', 'https://github.com/exmaple/my-repo')
      .buildPipelineRun({ includeDependencies: true });
  }
}

class PipelineRunTestWithUndefinedParamError extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myTask = new TaskBuilder(this, 'fetch-source')
      .withName('git-clone')
      .withWorkspace(new WorkspaceBuilder('output')
        .withName('shared-data')
        .withDescription('The files cloned by the task'))
      .withStringParam(new ParameterBuilder('url').withPiplineParameter('repo-url', ''));

    const pipeline = new PipelineBuilder(this, 'my-pipeline')
      .withName('clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask);
    pipeline.buildPipeline({ includeDependencies: true });

    new PipelineRunBuilder(this, 'my-pipeline-run', pipeline)
      // This does not exist and will throw an error
      .withRunParam('theundefinedparam', 'This parameter does not exist and this will throw an error.')
      .buildPipelineRun({ includeDependencies: true });
  }
}

class PipelineRunTestWithError extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myTask = new TaskBuilder(this, 'fetch-source')
      .withName('git-clone')
      .withWorkspace(new WorkspaceBuilder('output')
        .withName('shared-data')
        .withDescription('The files cloned by the task'))
      .withStringParam(new ParameterBuilder('url').withPiplineParameter('repo-url', ''));

    const pipeline = new PipelineBuilder(this, 'my-pipeline')
      .withName('clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask);
    pipeline.buildPipeline({ includeDependencies: true });

    new PipelineRunBuilder(this, 'my-pipeline-run', pipeline)
      // Just commented out so that you can see the difference. This does not add the parameter.
      // .withRunParam('repo-url', 'https://github.com/exmaple/my-repo')
      .buildPipelineRun({ includeDependencies: true });
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

class MyTestChartWithDuplicateParams extends Chart {
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

class MyTestChartWithDuplicateTasks extends Chart {
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

    new PipelineBuilder(this, 'my-pipeline')
      .withName('clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .withTask(myTask)
      .buildPipeline({ includeDependencies: true });
  }
}

describe('PipelineBuilderTest', () => {
  test('PipelineRunBuilder', () => {
    const app = Testing.app();
    const chart = new PipelineRunTest(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });

  test('PipelineRunBuilderWithError', () => {
    const app = Testing.app();
    const f = () => {
      new PipelineRunTestWithError(app, 'test-chart');
    };
    expect(f).toThrowError('Pipeline parameter \'repo-url\' is not defined in PipelineRun \'my-pipeline-run\'');
  });

  test('PipelineRunBuilderWithParamError', () => {
    const app = Testing.app();
    const f = () => {
      new PipelineRunTestWithUndefinedParamError(app, 'test-chart');
    };
    expect(f).toThrowError('PipelineRun parameter \'theundefinedparam\' does not exist in pipeline \'clone-build-push\'');
  });

  test('PipelineBuilderWithComplexTasks', () => {
    const app = Testing.app();
    const chart = new MySecondTestChart(app, 'my-second-test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });

  test('PipelineBuilderWithDuplicates', () => {
    const app = Testing.app();
    const chart = new MyTestChartWithDuplicateParams(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });

  test('PipelineBuilderWithStaticOverride', () => {
    const app = Testing.app();
    const chart = new MyTestChartWithStaticOverride(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });

  test('PipelineBuilderWithDuplicateTasks', () => {
    const app = Testing.app();
    const chart = new MyTestChartWithDuplicateTasks(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
