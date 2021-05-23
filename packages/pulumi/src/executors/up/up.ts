import { ExecutorContext } from '@nrwl/devkit';
import { UpExecutorResult, UpExecutorSchema } from './schema';
import * as path from 'path'
import { pulumi, resolver } from '../utils';

const propKeys = [
  'stack',
  'args'
]

export default async function runExecutor(
  options: UpExecutorSchema,
  context: ExecutorContext
): Promise<UpExecutorResult> {

  if(options.env === '') {
    return { success: false }
  }

  const cwd = path.resolve(context.root, context.workspace.projects[context.projectName].root)
  const stack = `${options.env}.${context.projectName}`

  return pulumi.up(cwd, stack)
}
