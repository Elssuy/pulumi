import { ExecutorContext } from '@nrwl/devkit';
import { pulumi } from '../utils';
import { UpExecutorSchema } from './schema';
import up from './up';

describe('Up Executor', () => {

 let ctx: ExecutorContext

  beforeEach(() => {
    pulumi.up = jest.fn(() => Promise.resolve({ success: true }))

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
      targetName: 'up',
      configurationName: ''
    }
  })

  it('should call pulumi up with stack', async () => {
    const expected_projectPath = '/root/apps/test'
    const expected_stack = 'dev.layer'

    const options: UpExecutorSchema = {
      env: 'dev',
    }

    const output = await up(options, ctx);
    expect(output.success).toBe(true);
    expect(pulumi.up).toBeCalledTimes(1)
    expect(pulumi.up).toBeCalledWith(expected_projectPath, expected_stack)
  });

  it('should return error when no env', async () => {
    const options: UpExecutorSchema = {
      env: ''
    }

    const output = await up(options, ctx);
    expect(output.success).toBe(false);
  });
});
