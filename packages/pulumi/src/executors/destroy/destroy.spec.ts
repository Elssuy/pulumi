import { DestroyExecutorSchema } from './schema';
import destroy from './destroy';
import { pulumi } from '../utils'
import { ExecutorContext } from '@nrwl/devkit';

describe('Destroy Executor', () => {

  let ctx: ExecutorContext

  beforeEach(() => {
    pulumi.destroy = jest.fn(() => Promise.resolve({ success: true }))

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
      targetName: 'destroy',
      configurationName: ''
    }
  })

  it('should call pulumi destroy with stack', async () => {
    const expected_projectPath = '/root/apps/test'
    const expected_stack = 'dev.layer'

    const options: DestroyExecutorSchema = {
      env: `dev`,
    }

    const output = await destroy(options, ctx);
    expect(output.success).toBe(true);
    expect(pulumi.destroy).toBeCalledTimes(1)
    expect(pulumi.destroy).toBeCalledWith(expected_projectPath, expected_stack)
  });

  it('should return an error if no env provided', async () => {
    const options: DestroyExecutorSchema = {
      env: ''
    }

    const output = await destroy(options, ctx);
    expect(output.success).toBe(false);
  })
});
