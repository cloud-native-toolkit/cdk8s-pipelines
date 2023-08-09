import { cdk8s } from 'projen';
const project = new cdk8s.ConstructLibraryCdk8s({
  name: 'cdk8s-pipelines',
  repositoryUrl: 'https://github.com/cloud-native-toolkit/cdk8s-pipelines.git',
  defaultReleaseBranch: 'main',
  author: 'Nathan Good',
  authorAddress: 'nathan.good@ibm.com',
  cdk8sVersion: '2.30.0',
  jsiiVersion: '~5.0.0',
  projenrcTs: true,
  peerDeps: [
    'cdk8s',
    'constructs',
  ],
  devDeps: [
    '@cdk8s/projen-common',
  ],
  keywords: [
    'cdk8s',
    'kubernetes',
    'pipelines',
    'tekton',
  ],
  gitignore: [
    '.idea/',
  ],
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.addTask('prepare', {
  exec: 'npx projen compile',
});
project.synth();
