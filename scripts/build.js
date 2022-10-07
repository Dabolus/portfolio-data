import path from 'path';
import { promises as fs } from 'fs';
import { URL } from 'url';
import { load } from 'js-yaml';

const { pathname: rootDir } = new URL('..', import.meta.url);
const srcDir = path.join(rootDir, 'src');
const libDir = path.join(rootDir, 'lib');

// Copy the src dir as it is to the lib dir, so that we can expose also the raw .yml files
await fs.cp(srcDir, libDir, { recursive: true });

// Build the .yml files into .js files
const files = await fs.readdir(srcDir);
await Promise.all(
  files.map(async file => {
    if (!file.endsWith('.yml')) {
      return;
    }
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
