import { spawn as node_spawn } from "child_process";

interface ExecutionResult {
  success: boolean
}

async function spawn(cwd: string, args: string[]): Promise<ExecutionResult> {

  const process = node_spawn('pulumi', args, {stdio: "inherit", cwd})

  return new Promise<ExecutionResult>( resolve => {
    process
    .on('close', code => {
      resolve({ success: code === 0 })
    })
    .on('error', err => {
      console.error(err)
      throw err
    })
  })
}

async function preview(cwd: string, stack: string): Promise<ExecutionResult> {
  return pulumi.spawn(cwd,[
    'preview', '--stack', stack
  ])
}

async function up(cwd: string, stack: string): Promise<ExecutionResult> {
  return pulumi.spawn(cwd,[
    'up', '--stack', stack
  ])
}

async function destroy(cwd: string, stack: string): Promise<ExecutionResult> {
  return pulumi.spawn(cwd,[
    'destroy', '--stack', stack
  ])
}

async function stack_init(cwd: string, stack: string): Promise<ExecutionResult> {
  return pulumi.spawn(cwd, [
    'stack', 'init', stack
  ])
}

async function stack_rm(cwd: string, stack: string): Promise<ExecutionResult> {
  return pulumi.spawn(cwd, [
    'stack', 'rm', stack
  ])
}

async function stack_ls(cwd: string): Promise<ExecutionResult> {
  return pulumi.spawn(cwd, [
    'stack', 'ls'
  ])
}

export const pulumi = {
  spawn,
  preview,
  up,
  destroy,
  stack_init,
  stack_ls,
  stack_rm
}
