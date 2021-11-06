import { ElectronApplication, _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';

import { findLatestBuild, parseElectronApp } from './electron-playwright-helpers';

let electronApp: ElectronApplication;

test.beforeAll(async () => {
  const latestBuild = findLatestBuild();
  const appInfo = parseElectronApp(latestBuild);

  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  });
});

test.afterAll(async () => {
  await electronApp.close();
});

test('Should sync data between windows', async () => {
  const page = await electronApp.firstWindow();
  await page.fill('#input', 'foobar');
  await page.click('#new-window');

  const newPage = await electronApp.waitForEvent('window');
  await newPage.waitForSelector('#text');
  const newPagetext = await newPage.$eval('#text', (el) => el.textContent);
  expect(newPagetext).toBe('foobar');

  newPage.fill('#input', 'foobarfoobar');
  await page.waitForSelector('#text');
  const text = await page.$eval('#text', (el) => el.textContent);
  expect(text).toBe('foobarfoobar');
});
