import { PreviewExecutorResult, PreviewExecutorSchema } from './schema';
import { pulumi, resolver } from '../utils'
import { ExecutorContext } from '@nrwl/devkit';
import * as path from 'path'

export default async function runExecutor(
  options: PreviewExecutorSchema,
  context: ExecutorContext
): Promise<PreviewExecutorResult> {

  if(options.env === '') {
    return { success: false }
  }

  const cwd = path.resolve(context.root, context.workspace.projects[context.projectName].root)
  const stack = `${options.env}.${context.projectName}`

  return pulumi.preview(cwd, stack)
}
