import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  getWorkspaceLayout,
  joinPathFragments,
  NxJsonProjectConfiguration,
  offsetFromRoot,
  ProjectConfiguration,
  TargetConfiguration,
  Tree
} from '@nrwl/devkit';
import * as path from 'path'
import { PulumiLayerSchema } from './schema';
import { jestProjectGenerator } from '@nrwl/jest'
import { lintProjectGenerator, Linter } from '@nrwl/linter'

interface NormalizedSchema extends PulumiLayerSchema {
  appPath: string,
  layerName: string,
  layerDescription: string,
  parsedTags: string[],
  offsetFromRoot: string,
  projectRoot: string
}

function normalizeOptions(tree: Tree, options: PulumiLayerSchema): NormalizedSchema {
  const parsedTags = options.tags
      ? options.tags.split(',').map( s => s.trim() )
      : []

  const appPath = getWorkspaceLayout(tree).appsDir
  const projectRoot = `${appPath}/${options.name}`

  return {
    ...options,
    appPath,
    layerName: options.name,
    layerDescription: options.description,
    parsedTags,
    projectRoot,
    offsetFromRoot: offsetFromRoot(projectRoot),
  }
}

function getTargetPreview(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@elssuy/pulumi:preview',
  }
}

function getTargetUp(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@elssuy/pulumi:up',
  }
}

function getTargetDestroy(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@elssuy/pulumi:destroy',
  }
}

function getTargetStack(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@elssuy/pulumi:stack'
  }
}

function addProject(tree: Tree, options: NormalizedSchema) {

  const project: ProjectConfiguration & NxJsonProjectConfiguration = {
    root: `${options.appPath}/${options.layerName}`,
    projectType: "application",
    sourceRoot: `${options.appPath}/${options.layerName}/src`,
    tags: options.parsedTags,
    targets: {
      preview: getTargetPreview(options),
      up: getTargetUp(options),
      stack: getTargetStack(options),
      destroy: getTargetDestroy(options)
    }
  }

  addProjectConfiguration(tree, options.layerName, project)
}

function generateLayerFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    template: ''
  }

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    path.join(options.appPath, options.layerName),
    templateOptions
  )
}

function addPackagesDependencies(tree: Tree, options: NormalizedSchema) {
  addDependenciesToPackageJson(
    tree,
    {
      "@pulumi/pulumi": "^3.0.0",
      "@pulumi/kubernetes": "^3.0.0",
    },
    {
      "@types/node": "^10.0.0"
    })
}

async function addJest( tree: Tree, options: NormalizedSchema): Promise<GeneratorCallback> {
  return await jestProjectGenerator(tree, {
    project: options.name,
    setupFile: 'none',
    supportTsx: true,
    skipSerializers: true,
    skipFormat: true,
  });
}

export function addLint( tree: Tree, options: NormalizedSchema): Promise<GeneratorCallback> {
  return lintProjectGenerator(tree, {
    project: options.name,
    linter: Linter.EsLint,
    skipFormat: true,
    tsConfigPaths: [
      joinPathFragments(options.projectRoot, 'tsconfig.lib.json'),
    ],
    eslintFilePatterns: [
      `${options.projectRoot}/**/*.ts`,
    ],
  });
}

export default async function (tree: Tree, options: PulumiLayerSchema) {

  const opts = normalizeOptions(tree, options)
  // Add project
  addProject(tree, opts)
  // Add files
  generateLayerFiles(tree, opts)
  // Add dependencies
  addPackagesDependencies(tree, opts)

  let tasks: GeneratorCallback[] = []

  // Add UnitTestRunner
  const jestCallback = await addJest(tree, opts);
  tasks.push(jestCallback);

  // Format files
  await formatFiles(tree);

  return async () => {
    for(const t of tasks) {
      await t()
    }
  }
}
