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
  fromPipelineParam,
  constant,
  ClusterTaskResolver,
} from '../src';

class PipelineRunTest extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const pipelineParam = new ParameterBuilder('repo-url')
      .withDefaultValue('');

    const myTask = new TaskBuilder(this, 'git-clone')
      .withName('fetch-source')
      .withWorkspace(new WorkspaceBuilder('output')
        .withBinding('shared-data')
        .withDescription('The files cloned by the task'))
      .withStringParam(new ParameterBuilder('url').withValue(fromPipelineParam(pipelineParam)));

    const pipeline = new PipelineBuilder(this, 'clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .withStringParam(pipelineParam);
    pipeline.buildPipeline({ includeDependencies: true });

    new PipelineRunBuilder(this, 'my-pipeline-run', pipeline)
      .withRunParam('repo-url', 'https://github.com/exmaple/my-repo')
      .withWorkspace('shared-data', 'dataPVC', 'my-shared-data')
      .buildPipelineRun({ includeDependencies: true });
  }
}

class PipelineRunTestWithUndefinedWorkspaceError extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const pipelineParam = new ParameterBuilder('repo-url')
      .withDefaultValue('');

    const myTask = new TaskBuilder(this, 'git-clone')
      .withName('fetch-source')
      .withWorkspace(new WorkspaceBuilder('output')
        .withBinding('shared-data')
        .withDescription('The files cloned by the task'))
      .withStringParam(new ParameterBuilder('url').withValue(fromPipelineParam(pipelineParam)));

    const pipeline = new PipelineBuilder(this, 'clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .withStringParam(pipelineParam);
    pipeline.buildPipeline({ includeDependencies: true });

    new PipelineRunBuilder(this, 'my-pipeline-run', pipeline)
      .withRunParam('repo-url', 'https://github.com/exmaple/my-repo')
      .buildPipelineRun({ includeDependencies: true });
  }
}

class PipelineRunTestWithUndefinedParamError extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const pipelineParam = new ParameterBuilder('repo-url')
      .withDefaultValue('');

    const myTask = new TaskBuilder(this, 'git-clone')
      .withName('fetch-source')
      .withWorkspace(new WorkspaceBuilder('output')
        .withBinding('shared-data')
        .withDescription('The files cloned by the task'))
      .withStringParam(new ParameterBuilder('url').withValue(fromPipelineParam(pipelineParam)));

    const pipeline = new PipelineBuilder(this, 'clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .withStringParam(pipelineParam);
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

    const pipelineParam = new ParameterBuilder('repo-url')
      .withDefaultValue('');

    const myTask = new TaskBuilder(this, 'git-clone')
      .withName('fetch-source')
      .withWorkspace(new WorkspaceBuilder('output')
        .withBinding('shared-data')
        .withDescription('The files cloned by the task'))
      .withStringParam(new ParameterBuilder('url').withValue(fromPipelineParam(pipelineParam)));

    const pipeline = new PipelineBuilder(this, 'clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .withStringParam(pipelineParam);
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

    const repoParam = new ParameterBuilder('repo-url')
      .withDefaultValue('');
    const nameParam = new ParameterBuilder('your-name')
      .withDefaultValue('');
    const colorParam = new ParameterBuilder('your-color')
      .withDefaultValue('');
    const questParam = new ParameterBuilder('your-quest')
      .withDefaultValue('');

    const myTask = new TaskBuilder(this, 'fetch-source')
      .withName('git-clone')
      .withWorkspace(new WorkspaceBuilder('output')
        .withBinding('shared-data')
        .withDescription('The files cloned by the task'))
      .withWorkspace(new WorkspaceBuilder('ssh-credentials')
        .withBinding('ssh-creds')
        .withDescription('The SSH files for credentials'))
      .withWorkspace(new WorkspaceBuilder('config')
        .withBinding('config-data')
        .withDescription('The files for configuration for stuff'))
      .withStringParam(new ParameterBuilder('url').withValue(fromPipelineParam(repoParam)))
      .withStringParam(new ParameterBuilder('name').withValue(fromPipelineParam(nameParam)))
      .withStringParam(new ParameterBuilder('color').withValue(fromPipelineParam(colorParam)))
      .withStringParam(new ParameterBuilder('quest').withValue(fromPipelineParam(questParam)));

    new PipelineBuilder(this, 'clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .withStringParam(repoParam)
      .withStringParam(nameParam)
      .withStringParam(colorParam)
      .withStringParam(questParam)
      .buildPipeline();
  }
}

class MyTestChartWithDuplicateParams extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myWorkspace = new WorkspaceBuilder('output')
      .withDescription('The files cloned by the task')
      .withBinding('shared-data');

    const pipelineParam = new ParameterBuilder('repo-url')
      .withDefaultValue('');

    const urlParam = new ParameterBuilder('url')
      .withValue(fromPipelineParam(pipelineParam));

    const myTask = new TaskBuilder(this, 'fetch-source')
      .withName('git-clone')
      .withWorkspace(myWorkspace)
      .withStringParam(urlParam)
    ;

    const myTask2 = new TaskBuilder(this, 'print-readme')
      .withName('cat-readme')
      .withWorkspace(myWorkspace)
      .withStringParam(urlParam)
    ;

    new PipelineBuilder(this, 'clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .withTask(myTask2)
      .withStringParam(pipelineParam)
      .buildPipeline();
  }
}

class MyTestChartWithStaticOverride extends Chart {

  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const pipelineParam = new ParameterBuilder('repo-url')
      .withDefaultValue('');

    const urlParam = new ParameterBuilder('url')
      .withValue(fromPipelineParam(pipelineParam));

    const myTask2 = new TaskBuilder(this, 'print-readme')
      .withName('cat-readme')
      .withStringParam(urlParam)
    ;

    // This should override the parameter with a static value.
    myTask2.withStringParam(new ParameterBuilder('url').withValue('https://api.example.io'));

    new PipelineBuilder(this, 'clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask2)
      // pipelineParam not added because myTask2 doesn't reference it anymore
      .buildPipeline();
  }
}

class MyTestChartWithDuplicateTasksError extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myWorkspace = new WorkspaceBuilder('output')
      .withDescription('The files cloned by the task')
      .withBinding('shared-data');

    const pipelineParam = new ParameterBuilder('repo-url')
      .withDefaultValue('');

    const urlParam = new ParameterBuilder('url')
      .withValue(fromPipelineParam(pipelineParam));

    const myTask = new TaskBuilder(this, 'fetch-source')
      .withName('git-clone')
      .withWorkspace(myWorkspace)
      .withStringParam(urlParam)
    ;

    new PipelineBuilder(this, 'clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .withTask(myTask)
      .withStringParam(pipelineParam)
      .buildPipeline({ includeDependencies: true });
  }
}

class PipelineLevelParamTest extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const pipelineParam = new ParameterBuilder('context')
      .withDefaultValue('/some/where/or/other');

    const taskParam = new ParameterBuilder('pathToDockerFile')
      .withValue(constant('Dockerfile'));

    const taskParam2 = new ParameterBuilder('pathToContext')
      .withValue(fromPipelineParam(pipelineParam));

    const myTask = new TaskBuilder(this, 'build-push')
      .withName('build-skaffold-web')
      .withStringParam(taskParam)
      .withStringParam(taskParam2);

    new PipelineBuilder(this, 'pipeline-with-parameters')
      .withStringParam(pipelineParam)
      .withTask(myTask)
      .buildPipeline({ includeDependencies: true });
  }
}

class MyTestChartWithSimilarTasks extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myWorkspace = new WorkspaceBuilder('output')
      .withDescription('The files cloned by the task')
      .withBinding('shared-data');

    const pipelineParam = new ParameterBuilder('repo-url')
      .withDefaultValue('');

    const urlParam = new ParameterBuilder('url')
      .withValue(fromPipelineParam(pipelineParam));

    const myTask = new TaskBuilder(this, 'fetch-source')
      .referencingTask('fetch-source')
      .withName('git-clone')
      .withWorkspace(myWorkspace)
      .withStringParam(urlParam)
    ;

    const myTask2 = new TaskBuilder(this, 'fetch-source-2')
      .referencingTask('fetch-source')
      .withName('git-clone-2')
      .withWorkspace(myWorkspace)
      .withStringParam(urlParam);

    new PipelineBuilder(this, 'clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .withTask(myTask2)
      .withStringParam(pipelineParam)
      .buildPipeline({ includeDependencies: true });
  }
}

class MyTestChartWithRunAfter extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const firstTask = new TaskBuilder(this, 'git-clone')
      .withName('fetch-source')
      .specifyRunAfter([]);

    const secondTask = new TaskBuilder(this, 'git-clone-2')
      .referencingTask('git-clone')
      .withName('fetch-again');

    const thirdTask = new TaskBuilder(this, 'print-readme')
      .withName('cat-readme')
      .specifyRunAfter(['fetch-again']);

    new PipelineBuilder(this, 'clone-read')
      .withTask(thirdTask)
      .withTask(firstTask)
      .withTask(secondTask)
      .buildPipeline({ includeDependencies: true });
  }
}

class MyTestChartWithRunAfterError extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myTask = new TaskBuilder(this, 'print-readme')
      .withName('cat-readme')
      .specifyRunAfter(['fetch-source']);

    new PipelineBuilder(this, 'clone-read')
      .withTask(myTask)
      .buildPipeline({ includeDependencies: true });
  }
}

class PipelineTestWithResolver extends Chart {
  constructor(scope: Construct, id: string, props?: ChartProps) {
    super(scope, id, props);

    const myWorkspace = new WorkspaceBuilder('output')
      .withDescription('The files cloned by the task')
      .withBinding('shared-data');

    const pipelineParam = new ParameterBuilder('repo-url')
      .withDefaultValue('');

    const urlParam = new ParameterBuilder('url')
      .withValue(fromPipelineParam(pipelineParam));

    const resolver = new ClusterTaskResolver('git-clone', 'default');

    const myTask = new TaskBuilder(this, 'fetch-source')
      .referencingTask(resolver)
      .withWorkspace(myWorkspace)
      .withStringParam(urlParam)
    ;

    new PipelineBuilder(this, 'clone-build-push')
      .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
      .withTask(myTask)
      .withStringParam(pipelineParam)
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

  test('PipelineRunBuilderWithWorkspaceError', () => {
    const app = Testing.app();
    const f = () => {
      new PipelineRunTestWithUndefinedWorkspaceError(app, 'test-chart');
    };
    expect(f).toThrowError('Pipeline workspace \'shared-data\' is not defined in PipelineRun \'my-pipeline-run\'');
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

  test('PipelineBuilderWithDuplicateTasksError', () => {
    const app = Testing.app();
    const f = () => {
      new MyTestChartWithDuplicateTasksError(app, 'test-chart');
    };
    expect(f).toThrowError('Multiple tasks found with name \'git-clone\' in Pipeline \'clone-build-push\', but task names must be unique.');
  });

  test('PipelineBuilderWithParameters', () => {
    const app = Testing.app();
    const chart = new PipelineLevelParamTest(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });

  test('PipelineBuilderWithSimilarTasks', () => {
    const app = Testing.app();
    const chart = new MyTestChartWithSimilarTasks(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });

  test('PipelineBuilderWithRunAfter', () => {
    const app = Testing.app();
    const chart = new MyTestChartWithRunAfter(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });

  test('PipelineBuilderWithRunAfterError', () => {
    const app = Testing.app();
    const f = () => {
      new MyTestChartWithRunAfterError(app, 'test-chart');
    };
    expect(f).toThrowError('\'fetch-source\' supplied as value for runAfter but no such task found in pipeline.');
  });

  test('PipelineBuilderWithResolver', () => {
    const app = Testing.app();
    const chart = new PipelineTestWithResolver(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
