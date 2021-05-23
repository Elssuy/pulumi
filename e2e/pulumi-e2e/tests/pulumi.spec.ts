import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runCommand,
  runCommandAsync,
  newNxProject,
  runNxCommandAsync,
  uniq,

} from '@nrwl/nx-plugin/testing';

describe('pulumi e2e', () => {
  it.todo('should create pulumi project')

  it('should create pulumi stack and delete it', async (done) => {
    const plugin = uniq('layer')
    ensureNxProject('@elssuy/pulumi', 'dist/packages/pulumi');
    await runCommandAsync(`pulumi stack rm dev.${plugin} -y --non-interactive`, { silenceError: true })
    await runNxCommandAsync(`generate @elssuy/pulumi:layer ${plugin}`);

    const result_create = await runNxCommandAsync(`run ${plugin}:stack --init dev`)
    expect(result_create.stdout).toContain(`Created stack 'dev.${plugin}'`)
    done()

    // const result_delete = await runNxCommandAsync(`run ${plugin}:stack --rm dev`)
    // expect(result_delete.stdout).toContain(`Stack 'dev.${plugin}' has been removed!`)
  }, 90000)

  it('should run preview on pulumi project', async (done) => {
    const plugin = uniq('layer')
    ensureNxProject('@elssuy/pulumi', 'dist/packages/pulumi');
    await runNxCommandAsync(`generate @elssuy/pulumi:layer ${plugin}`);

    const result_layer = await runNxCommandAsync(`run ${plugin}:stack --init dev`);
    expect(result_layer.stdout).toContain(`Created stack 'dev.${plugin}'`)
    const result = await runNxCommandAsync(`run ${plugin}:preview --env dev`);
    expect(result.stdout).toContain('error');
    done()
  }, 120000);

  it('should list pulumi stack linked to layer', async () => {
    const plugin = uniq('layer')
    ensureNxProject('@elssuy/pulumi', 'dist/packages/pulumi');
    const result = await runNxCommandAsync(`generate @elssuy/pulumi:stack --ls ${plugin}`);
    expect(result.stdout).toContain(`dev.${plugin}`);
  })
  it.todo('should create pulumi stack for layer')
  it.todo('should delete pulumi stack for layer')
  it.todo('should preview all stacks')
  it.todo('should apply all stacks')

  // describe('--directory', () => {
  //   it('should create src in the specified directory', async (done) => {
  //     const plugin = uniq('pulumi');
  //     ensureNxProject('@elssuy/pulumi', 'dist/packages/pulumi');
  //     await runNxCommandAsync(
  //       `generate @elssuy/pulumi:pulumi ${plugin} --directory subdir`
  //     );
  //     expect(() =>
  //       checkFilesExist(`apps/subdir/${plugin}/src/index.ts`)
  //     ).not.toThrow();
  //     done();
  //   });
  // });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('layer')
      ensureNxProject('@elssuy/pulumi', 'dist/packages/pulumi');
      await runNxCommandAsync(
        `generate @elssuy/pulumi:layer ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
