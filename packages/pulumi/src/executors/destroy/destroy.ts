import { DestroyExecutorSchema, DestroyExecutorResult } from './schema';
import { pulumi, resolver } from '../utils';
import * as path from 'path'
import { ExecutorContext } from '@nrwl/devkit';

export default async function runExecutor(
  options: DestroyExecutorSchema,
  context: ExecutorContext
): Promise<DestroyExecutorResult> {

  if(options.env === '') {
    return { success: false }
  }

  const cwd = path.resolve(context.root, context.workspace.projects[context.projectName].root)
  const stack = `${options.env}.${context.projectName}`

  return pulumi.destroy(cwd, stack)
}
