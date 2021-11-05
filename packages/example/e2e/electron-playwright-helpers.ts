/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import path from 'path';
import fs from 'fs';

import * as ASAR from 'asar';

import appPackage from '../package.json';

export function findLatestBuild(): string {
  // root of your project
  const rootDir = path.resolve('./');
  // directory where the builds are stored
  const outDir = path.join(rootDir, 'out');
  // list of files in the out directory
  const builds = fs.readdirSync(outDir);
  const latestBuild = builds
    .map((fileName) => {
      // make sure it's a directory with "-" in its name
      const stats = fs.statSync(path.join(outDir, fileName));
      if (fileName.includes('-') && stats.isDirectory()) {
        return {
          name: fileName,
          time: fs.statSync(path.join(outDir, fileName)).mtimeMs,
        };
      }

      throw new Error('Build not found');
    })
    .sort((a, b) => b.time - a.time)
    .map((file) => {
      return file.name;
    })[0];
  if (!latestBuild) {
    throw new Error('No build found in out directory');
  }
  return path.join(outDir, latestBuild);
}

export interface ElectronAppInfo {
  /** Path to the app's executable file */
  executable: string;
  /** Path to the app's main (JS) file */
  main: string;
  /** Name of the app */
  name: string;
  /** True if the app is using asar */
  asar: boolean;
}

/**
 * Given a directory containing an Electron app build,
 * return the path to the app's executable and the path to the app's main file.
 */
export function parseElectronApp(buildDir: string): ElectronAppInfo {
  // parse the directory name to figure out the platform
  let platform: string;
  const baseName = path.basename(buildDir).toLowerCase();
  if (baseName.includes('win')) {
    platform = 'win32';
  }
  if (baseName.includes('linux') || baseName.includes('ubuntu') || baseName.includes('debian')) {
    platform = 'linux';
  }
  if (baseName.includes('darwin') || baseName.includes('mac') || baseName.includes('osx')) {
    platform = 'darwin';
  }
  if (!platform) {
    throw new Error(`Platform not found in directory name: ${baseName}`);
  }

  let executable: string;
  let main: string;
  let name: string;
  let asar: boolean;

  if (platform === 'darwin') {
    const list = fs.readdirSync(buildDir);
    const appBundle = list.find((fileName) => {
      return fileName.endsWith('.app');
    });
    const appDir = path.join(buildDir, appBundle, 'Contents', 'MacOS');
    const appName = fs.readdirSync(appDir)[0];
    executable = path.join(appDir, appName);

    const resourcesDir = path.join(buildDir, appBundle, 'Contents', 'Resources');
    const resourcesList = fs.readdirSync(resourcesDir);
    asar = resourcesList.includes('app.asar');

    let packageJson: { main: string; name: string };
    if (asar) {
      const asarPath = path.join(resourcesDir, 'app.asar');
      packageJson = JSON.parse(ASAR.extractFile(asarPath, 'package.json').toString('utf8'));
      main = path.join(asarPath, packageJson.main);
    } else {
      packageJson = JSON.parse(fs.readFileSync(path.join(resourcesDir, 'app', 'package.json'), 'utf8'));
      main = path.join(resourcesDir, 'app', packageJson.main);
    }
    name = packageJson.name;
  } else if (platform === 'win32') {
    const list = fs.readdirSync(buildDir);
    const exe = list.find((fileName) => {
      return fileName.endsWith('.exe');
    });
    executable = path.join(buildDir, exe);

    const resourcesDir = path.join(buildDir, 'resources');
    const resourcesList = fs.readdirSync(resourcesDir);
    asar = resourcesList.includes('app.asar');

    let packageJson: { main: string; name: string };

    if (asar) {
      const asarPath = path.join(resourcesDir, 'app.asar');
      packageJson = JSON.parse(ASAR.extractFile(asarPath, 'package.json').toString('utf8'));
      main = path.join(asarPath, packageJson.main);
    } else {
      packageJson = JSON.parse(fs.readFileSync(path.join(resourcesDir, 'app', 'package.json'), 'utf8'));
      main = path.join(resourcesDir, 'app', packageJson.main);
    }
    name = packageJson.name;
  } else if (platform === 'linux') {
    executable = path.join(buildDir, appPackage.productName);

    const resourcesDir = path.join(buildDir, 'resources');
    const resourcesList = fs.readdirSync(resourcesDir);
    asar = resourcesList.includes('app.asar');

    let packageJson: { main: string; name: string };

    if (asar) {
      const asarPath = path.join(resourcesDir, 'app.asar');
      packageJson = JSON.parse(ASAR.extractFile(asarPath, 'package.json').toString('utf8'));
      main = path.join(asarPath, packageJson.main);
    } else {
      packageJson = JSON.parse(fs.readFileSync(path.join(resourcesDir, 'app', 'package.json'), 'utf8'));
      main = path.join(resourcesDir, 'app', packageJson.main);
    }
    name = packageJson.name;
  } else {
    throw new Error(`Platform not supported: ${platform}`);
  }

  return {
    executable,
    main,
    asar,
    name,
  };
}
