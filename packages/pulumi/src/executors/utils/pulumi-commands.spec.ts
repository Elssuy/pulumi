import { pulumi } from './pulumi-commands'

describe('pulumi commands', () => {
  beforeEach( () => {
    pulumi.spawn = jest.fn( () => Promise.resolve({ success: true }) )
  })

  it('preview', async () => {
    const expected_cwd = 'apps/test'
    const expected_args = ['preview', '--stack', 'dev.test']

    const result = pulumi.preview('apps/test', 'dev.test')
    expect(result).resolves.toEqual({ success: true })
    expect(pulumi.spawn).toBeCalledTimes(1)
    expect(pulumi.spawn).toBeCalledWith(expected_cwd, expected_args)
  })

  it('up', async () => {
    const expected_cwd = 'apps/test'
    const expected_args = ['up', '--stack', 'dev.test']

    const result = pulumi.up('apps/test', 'dev.test')
    expect(result).resolves.toEqual({ success: true })
    expect(pulumi.spawn).toBeCalledTimes(1)
    expect(pulumi.spawn).toBeCalledWith(expected_cwd, expected_args)
  })

  it('destroy', async () => {
    const expected_cwd = 'apps/test'
    const expected_args = ['destroy', '--stack', 'dev.test']

    const result = pulumi.destroy('apps/test', 'dev.test')
    expect(result).resolves.toEqual({ success: true })
    expect(pulumi.spawn).toBeCalledTimes(1)
    expect(pulumi.spawn).toBeCalledWith(expected_cwd, expected_args)
  })

  it('init a stack', async () => {
    const expected_cwd = 'apps/test'
    const expected_args = ['stack', 'init', 'dev.test']

    const result = pulumi.stack_init('apps/test', 'dev.test')
    expect(result).resolves.toEqual({ success: true })
    expect(pulumi.spawn).toBeCalledTimes(1)
    expect(pulumi.spawn).toBeCalledWith(expected_cwd, expected_args)
  })

  it('remove a stacks', async () => {
    const expected_cwd = 'apps/test'
    const expected_args = ['stack', 'rm', 'dev.test']

    const result = pulumi.stack_rm('apps/test', 'dev.test')
    expect(result).resolves.toEqual({ success: true })
    expect(pulumi.spawn).toBeCalledTimes(1)
    expect(pulumi.spawn).toBeCalledWith(expected_cwd, expected_args)
  })

  it('list stacks', async () => {
    const expected_cwd = 'apps/test'
    const expected_args = ['stack', 'ls']

    const result = pulumi.stack_ls('apps/test')
    expect(result).resolves.toEqual({ success: true })
    expect(pulumi.spawn).toBeCalledTimes(1)
    expect(pulumi.spawn).toBeCalledWith(expected_cwd, expected_args)
  })
})
