import { PreviewExecutorSchema } from './schema';
import preview from './preview';
import { pulumi } from '../utils';
import { ExecutorContext } from '@nrwl/devkit';

describe('Preview Executor', () => {

  let ctx: ExecutorContext

  beforeEach(() => {
    pulumi.preview = jest.fn(() => Promise.resolve({ success: true }))

    ctx = {
      root: '/root',
      cwd: '/root/other',
      workspace: {
        version: 2,
        projects: {
          layer: {
            root: "apps/test",
            targets: {}
          }
        },
      },
      isVerbose: false,
      projectName: 'layer',
      targetName: 'preview',
      configurationName: ''
    }
  })

  it('should call pulumi preview with stack', async () => {
    const expected_projectPath = '/root/apps/test'
    const expected_stack = 'dev.layer'

    const options: PreviewExecutorSchema = {
      env: `dev`,
    }

    const output = await preview(options, ctx);
    expect(output.success).toBe(true);
    expect(pulumi.preview).toBeCalledTimes(1)
    expect(pulumi.preview).toBeCalledWith(expected_projectPath, expected_stack)
  });

  it('should return an error when no env provided', async () => {
    const options: PreviewExecutorSchema = {
      env: ''
    }

    const output = await preview(options, ctx);
    expect(output.success).toBe(false);
  });
});
