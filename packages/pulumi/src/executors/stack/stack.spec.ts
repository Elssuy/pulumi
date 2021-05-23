import { StackExecutorSchema } from './schema';
import stack from './stack';
import { pulumi } from '../utils';
import { ExecutorContext } from '@nrwl/devkit';
import exp = require('node:constants');

describe('Stack Executor', () => {
  let ctx: ExecutorContext

  beforeEach(() => {
    pulumi.stack_init = jest.fn(() => Promise.resolve({ success: true }))
    pulumi.stack_rm = jest.fn(() => Promise.resolve({ success: true }))
    pulumi.stack_ls = jest.fn(() => Promise.resolve({ success: true }))

    ctx = {
      root: '/root',
      cwd: '/root/other',
      workspace: {
        version: 2,
        projects: {
          test: {
            root: "apps/test",
            targets: {}
          }
        },
      },
      isVerbose: false,
      projectName: 'test',
      targetName: 'stack',
      configurationName: ''
    }
  })

  it('can create stack with tags', async () => {
    const expected_cwd = '/root/apps/test'
    const expected_stack = 'test-env.test'
    const options: StackExecutorSchema = {
      init: 'test-env'
    }

    const output = await stack(options, ctx);
    expect(output.success).toBe(true);
    expect(pulumi.stack_init).toBeCalledTimes(1)
    expect(pulumi.stack_init).toBeCalledWith(expected_cwd, expected_stack)
  })

  it('return error if create stack without name', async () => {
    const options: StackExecutorSchema = {
      init: ''
    }

    const output = await stack(options, ctx);
    expect(output.success).toBe(false);
  })

  it('can delete stack', async () => {
    const expected_cwd = '/root/apps/test'
    const expected_stack = 'test-env.test'
    const options: StackExecutorSchema = {
      rm: 'test-env'
    }

    const output = await stack(options, ctx);
    expect(output.success).toBe(true);
    expect(pulumi.stack_rm).toBeCalledTimes(1)
    expect(pulumi.stack_rm).toBeCalledWith(expected_cwd, expected_stack)
  })

  it('can list stacks', async () => {
    const expected_cwd = '/root/apps/test'
    const options: StackExecutorSchema = {
      ls: true
    }

    const output = await stack(options, ctx);
    expect(output.success).toBe(true);
    expect(pulumi.stack_ls).toBeCalledTimes(1)
    expect(pulumi.stack_ls).toBeCalledWith(expected_cwd)
  })
});
