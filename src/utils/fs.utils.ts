import {
  readdirSync,
  statSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmdirSync,
  lstatSync,
  unlinkSync } from 'fs';
import { sep, resolve } from 'path';

export const getFilesFromFolder = (dir: string, files?: string[]): string[] => {
  files = files || [];
  readdirSync(dir).forEach(file => {
    const path = `${dir}/${file}`;
    if (statSync(path).isDirectory()) {
      getFilesFromFolder(path, files);
    } else {
      files.push(path);
    }
  });
  return files;
}

export const deleteSyncRecursive = (path) => {
  if (existsSync(path)) {
    readdirSync(path).forEach(file => {
      let curPath = `${path}${sep}${file}`;
      if (lstatSync(curPath).isDirectory()) {
        deleteSyncRecursive(curPath);
      } else {
        unlinkSync(curPath);
      }
    });
    rmdirSync(path);
  }
};

export const writeFileSyncRecursive = (filename: string, content: string) => {
	resolve(filename).split(sep).slice(0, -1).reduce((last, folder) => {
		let folderPath = last ? `${last}${sep}${folder}` : folder;
		if (!existsSync(folderPath)) mkdirSync(folderPath);
		return folderPath;
	});
	writeFileSync(filename, content);
}