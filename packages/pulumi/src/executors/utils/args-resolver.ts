import * as yargsParser from 'yargs-parser'

function resolveArgs(
  input: string,
  args: { [key: string]: string }
) {
  if (input.indexOf('{args.') > -1) {
    const regex = /{args\.([^}]+)}/g;
    return input.replace(regex, (_, group: string) => args[camelCase(group)]);
  } else {
    return input;
  }
}

function parseArgs(propKeys: string[], options: any) {
  const args = options.args;
  if (!args) {
    const unknownOptionsTreatedAsArgs = Object.keys(options)
      .filter((p) => propKeys.indexOf(p) === -1)
      .reduce((m, c) => ((m[c] = options[c]), m), {});
    return unknownOptionsTreatedAsArgs;
  }
  return yargsParser(args.replace(/(^"|"$)/g, ''), {
    configuration: { 'camel-case-expansion': true },
  });
}

function camelCase(input) {
  if (input.indexOf('-') > 1) {
    return input
      .toLowerCase()
      .replace(/-(.)/g, (match, group1) => group1.toUpperCase());
  } else {
    return input;
  }
}

export const resolver = {
  resolveArgs,
  parseArgs
}
