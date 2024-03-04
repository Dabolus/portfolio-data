import path from 'node:path';
import { promises as fs } from 'node:fs';
import { URL } from 'node:url';
import assert from 'node:assert';
import { exec as execCb } from 'node:child_process';
import { load } from 'js-yaml';
import { PNG, type PNGOptions } from 'pngjs';
import { chunk, image2BppToHex } from './utils.js';

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

const parsePng = (buffer: Buffer, options?: PNGOptions): Promise<PNG> =>
  new Promise((resolve, reject) =>
    new PNG(options).parse(buffer, (err, png) =>
      err ? reject(err) : resolve(png),
    ),
  );

const updatePixelartsBitmaps = async () => {
  const projectsFilePath = path.join(rootDir, 'src', 'projects.yml');
  const rawProjects = await Bun.file(
    path.join(rootDir, 'src', 'projects.yml'),
  ).text();
  const projectsKeys = Array.from(rawProjects.match(/^[^\s:]+/gm) ?? []);
  const projectsPixelarts = await Promise.all(
    projectsKeys.map(async (key) => {
      const {
        width,
        height,
        colors: colorPalettes,
        colorSelected,
        frames,
      } = await Bun.file(
        path.join(rootDir, 'pixelart', 'projects', `${key}.pixil`),
      ).json();
      const { [colorSelected]: colors } = colorPalettes;
      const uniqueColors = Array.from<string>(new Set(colors))
        // Sort colors to make sure they are always in the same order (from darker to lighter)
        .sort((a, b) => {
          const [aR, aG, aB] = chunk(a, 2, (hex) => parseInt(hex, 16));
          const aAvg = (aR + aG + aB) / 3;
          const [bR, bG, bB] = chunk(b, 2, (hex) => parseInt(hex, 16));
          const bAvg = (bR + bG + bB) / 3;
          return aAvg - bAvg;
        });
      assert(
        uniqueColors.length === 4,
        `${key} - expected Pixilart color palette to have exactly 4 unique colors`,
      );
      assert(
        frames.length === 1,
        `${key} - expected Pixilart project to have exactly 1 frame`,
      );
      const [{ layers }] = frames;
      assert(
        layers.length === 1,
        `${key} - expected Pixilart frame to have exactly 1 layer`,
      );
      const [{ src }] = layers;
      const pngBuffer = Buffer.from(
        src.replace(/^data:image\/png.+base64,/, ''),
        'base64',
      );
      const { data } = await parsePng(pngBuffer);
      const twoBppPossibleValues = [0b11, 0b10, 0b01, 0b00];
      const twoBppData = chunk(Array.from(data), 4, ([r, g, b]) => {
        const hexColor = [
          r.toString(16).padStart(2, '0'),
          g.toString(16).padStart(2, '0'),
          b.toString(16).padStart(2, '0'),
        ].join('');
        const index = uniqueColors.indexOf(hexColor);
        assert(
          index >= 0,
          `${key} - expected color ${hexColor} to be one of the unique colors ${uniqueColors}`,
        );
        return twoBppPossibleValues[index];
      });
      const hex = image2BppToHex(twoBppData, width, height);
      return [key, hex.map((h) => h.slice(2)).join('')];
    }),
  );

  const updatedProjects = projectsPixelarts.reduce(
    (newProjects, [key, hex]) =>
      newProjects.replace(
        new RegExp(`(${key}:.+?)bitmap: [^\n]+`, 's'),
        `$1bitmap: ${hex}`,
      ),
    rawProjects,
  );
  await Bun.write(projectsFilePath, updatedProjects);
};

await updatePixelartsBitmaps();
