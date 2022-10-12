import path from 'path';
import { promises as fs } from 'fs';
import { URL } from 'url';
import { exec as execCb } from 'child_process';
import { load } from 'js-yaml';

const exec = (command, options) =>
  new Promise((resolve, reject) =>
    execCb(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    }),
  );

const { pathname: rootDir } = new URL('..', import.meta.url);
const srcDir = path.join(rootDir, 'src');
const libDir = path.join(rootDir, 'lib');

const buildYamlFiles = async () => {
  console.log('Building YAML files...');
  const files = await fs.readdir(srcDir);
  await Promise.all(
    files.map(async (file) => {
      if (file.endsWith('.d.ts')) {
        await fs.copyFile(path.join(srcDir, file), path.join(libDir, file));
        return;
      }
      if (!file.endsWith('.yml')) {
        return;
      }
      await fs.copyFile(path.join(srcDir, file), path.join(libDir, file));
      const filePath = path.join(srcDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = load(fileContent);
      const jsonContent = JSON.stringify(data, null, 2);
      const jsonPath = path.join(libDir, file.replace(/\.yml$/, '.json'));
      const jsContent = `export default ${jsonContent}`;
      const jsPath = path.join(libDir, file.replace(/\.yml$/, '.js'));
      await Promise.all([
        fs.writeFile(jsonPath, jsonContent),
        fs.writeFile(jsPath, jsContent),
      ]);
    }),
  );
  // Format the JS files with Prettier to make them more JS-ish instead of being pure JSON
  await exec('yarn prettier --write lib/**/*.js', { cwd: rootDir });
  console.log('Done building YAML files.');
};

const buildTypeScriptFiles = async () => {
  console.log('Building TypeScript files...');
  await exec('tsc', { cwd: rootDir });
  console.log('Done building TypeScript files.');
};

// Delete the lib directory and recreate it
await fs.rm(libDir, { recursive: true, force: true });
await fs.mkdir(libDir, { recursive: true });

await Promise.all([
  // Build the .yml files into .js files
  buildYamlFiles(),
  // Build TypeScript sources
  buildTypeScriptFiles(),
]);
