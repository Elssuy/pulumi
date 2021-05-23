import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson, NxJsonConfiguration } from '@nrwl/devkit';

import layer from './layer';

describe('pulumi layer', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  describe('generating Pulumi project', () => {
    it('should generate projet files', async () => {
      const options = { name: 'test' };
      await layer(appTree, options);

      expect(appTree.exists('apps/test/Pulumi.yaml')).toBeTruthy();
      expect(appTree.exists('apps/test/src/index.ts')).toBeTruthy();
      expect(appTree.exists('apps/test/tsconfig.json')).toBeTruthy();
      expect(appTree.exists('apps/test/jest.config.js')).toBeTruthy();
      expect(appTree.read(`apps/test/jest.config.js`, 'utf-8').toString())
        .toMatchInlineSnapshot(`
        "module.exports = {
          displayName: 'test',
          preset: '../../jest.preset.js',
          globals: {
            'ts-jest': {
              tsconfig: '<rootDir>/tsconfig.spec.json',
            }
          },
          transform: {
            '^.+\\\\\\\\.[tj]sx?$':  'ts-jest' 
          },
            moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
          coverageDirectory: '../../coverage/apps/test'
        };
        "
      `);
    });

    it('should contain layer name', async () => {
      const options = { name: 'test' };
      const expected = `name: ${options.name}`;

      await layer(appTree, options);
      const fileContent = appTree.read('apps/test/Pulumi.yaml').toString();
      expect(fileContent).toContain(expected);
    });

    it('should contain layer description', async () => {
      const options = {
        name: 'test',
        description: 'Test layer description',
      };
      const expected = `description: ${options.description}`;

      await layer(appTree, options);
      const fileContent = appTree.read('apps/test/Pulumi.yaml').toString();
      expect(fileContent).toContain(expected);
    });
  });

  describe('update workspace configuration', () => {
    it('should update workspace.json', async () => {
      const options = { name: 'test' };
      const expected_architects = {
        preview: { builder: '@elssuy/pulumi:preview' },
        up: { builder: '@elssuy/pulumi:up' },
        destroy: { builder: '@elssuy/pulumi:destroy' },
        stack: { builder: '@elssuy/pulumi:stack' },
      };

      await layer(appTree, options);

      const config = readJson(appTree, '/workspace.json');
      const project = config.projects[options.name];

      expect(project.root).toEqual(`apps/${options.name}`);
      expect(project.projectType).toEqual('application');
      expect(project.sourceRoot).toEqual(`apps/${options.name}/src`);
      expect(project.architect).toEqual(
        expect.objectContaining(expected_architects)
      );
    });

    it('should update nx.json', async () => {
      const options = { name: 'test' };
      const expected_project = {
        [options.name]: {
          tags: [],
        },
      };
      await layer(appTree, options);

      const config: NxJsonConfiguration = readJson(appTree, '/nx.json');
      expect(config.projects).toEqual(expected_project);
    });

    it('should update package.json', async () => {
      const options = { name: 'test' };
      await layer(appTree, options);

      const packageJson = readJson(appTree, '/package.json');
      expect(packageJson.dependencies['@pulumi/pulumi']).toBeDefined();
      expect(packageJson.devDependencies['@types/node']).toBeDefined();
    });

    it('should add project to jest config', async () => {
      const options = { name: 'test' };
      await layer(appTree, options);

      expect(appTree.exists(`apps/test/.eslintrc.json`)).toBeTruthy();
      expect(appTree.read('jest.config.js').toString()).toMatchInlineSnapshot(`
        "module.exports = {
        projects: [\\"<rootDir>/apps/test\\"]
        };"
      `);
    });

    it('should generate linter options', async () => {
      const options = { name: 'test' };
      await layer(appTree, options);

      expect(appTree.exists(`apps/test/.eslintrc.json`)).toBeTruthy();
      expect(appTree.read('apps/test/.eslintrc.json').toString())
        .toMatchInlineSnapshot(`
        "{
          \\"extends\\": [\\"../../.eslintrc.json\\"],
          \\"ignorePatterns\\": [\\"!**/*\\"],
          \\"overrides\\": [
            {
              \\"files\\": [\\"*.ts\\", \\"*.tsx\\", \\"*.js\\", \\"*.jsx\\"],
              \\"parserOptions\\": {
                \\"project\\": [\\"apps/vector/tsconfig.*?.json\\"]
              },
              \\"rules\\": {}
            },
            {
              \\"files\\": [\\"*.ts\\", \\"*.tsx\\"],
              \\"rules\\": {}
            },
            {
              \\"files\\": [\\"*.js\\", \\"*.jsx\\"],
              \\"rules\\": {}
            }
          ]
        }
        "
      `);
    });
  });
});
