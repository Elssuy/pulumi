import { ExecutorContext } from '@nrwl/devkit';
import { StackExecutorResult, StackExecutorSchema } from './schema';
import * as path from 'path'
import { pulumi } from '../utils';

const availableAction = [
  'init',
  'rm',
  'ls'
]

export default async function runExecutor(
  options: StackExecutorSchema,
  context: ExecutorContext
): Promise<StackExecutorResult> {
  const cwd = path.resolve(context.root, context.workspace.projects[context.projectName].root)
  const actions = Object.keys(options).filter( key => availableAction.includes(key) )

  if( actions.length > 1 ) {
    return { success: false }
  }

  const env = options[actions[0]]
  const stack = `${env}.${context.projectName}`

  if(env === '') return { success: false }

  switch (actions[0]) {
    case 'init': return pulumi.stack_init(cwd, stack)
    case 'rm':  return pulumi.stack_rm(cwd, stack)
    case 'ls': return pulumi.stack_ls(cwd)
  }

  return { success: false }
}
