// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { waitForCallCompositeToLoad, dataUiId } from '../utils';
import { test } from './fixture';
import { expect, Page } from '@playwright/test';

/**
 * Since we are providing a .y4m video to act as a fake video stream, chrome
 * uses it's file path as the camera name. This file location can differ on
 * every device causing a diff error in test screenshot comparisons.
 * To avoid this error, we replace the unique file path with a custom string.
 */
const stubLocalCameraName = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const element = document.querySelector('[data-ui-id="call-composite-local-camera-settings"]');
    if (element) {
      element.innerHTML = element.innerHTML.replace(/C:.*?y4m/g, 'Fake Camera');
    }
  });
};

test.describe('Call Composite E2E Tests', () => {
  test('composite pages load completely', async ({ pages }) => {
    for (const idx in pages) {
      await waitForCallCompositeToLoad(pages[idx]);
      await pages[idx].waitForSelector(dataUiId('call-composite-device-settings'));
      await pages[idx].waitForSelector(dataUiId('call-composite-local-preview'));
      await pages[idx].waitForSelector(`${dataUiId('call-composite-start-call-button')}[data-is-focusable="true"]`);
      await stubLocalCameraName(pages[idx]);
      expect(await pages[idx].screenshot()).toMatchSnapshot(`page-${idx}-call-screen.png`, { threshold: 0.5 });
    }
  });

  test('local device settings can toggle camera & audio', async ({ pages }) => {
    for (const idx in pages) {
      const page = pages[idx];
      page.bringToFront();
      await stubLocalCameraName(page);
      await page.click(dataUiId('call-composite-local-device-settings-microphone-button'));
      await page.click(dataUiId('call-composite-local-device-settings-camera-button'));
      await page.waitForSelector('video');
      await page.waitForTimeout(1000);
      expect(await page.screenshot()).toMatchSnapshot(`page-${idx}-local-device-settings-camera-enabled.png`);
    }
  });

  test('video gallery renders for all pages', async ({ pages }) => {
    for (const idx in pages) {
      const page = pages[idx];
      page.bringToFront();
      await page.click(dataUiId('call-composite-start-call-button'));
    }

    for (const idx in pages) {
      const page = pages[idx];
      page.bringToFront();
      await page.waitForFunction(() => {
        return document.querySelectorAll('video').length === 2;
      });
      expect(await page.screenshot()).toMatchSnapshot(`page-${idx}-video-gallery.png`);
    }
  });

  test('participant list loads correctly', async ({ pages }) => {
    for (const idx in pages) {
      const page = pages[idx];
      page.bringToFront();
      await page.click(dataUiId('call-composite-participants-button'));
      // Clicking on participants icon displays a dropdown menu that has an animation.
      // We wait 1 second for that animation to complete.
      await page.waitForTimeout(1000);
      expect(await page.screenshot()).toMatchSnapshot(`page-${idx}-participants.png`);
    }
  });

  test('can turn off local video', async ({ pages }) => {
    for (const idx in pages) {
      const page = pages[idx];
      page.bringToFront();
      await page.click(dataUiId('call-composite-camera-button'));
      await page.waitForFunction(() => {
        return document.querySelectorAll('video').length === 1;
      });
      expect(await page.screenshot()).toMatchSnapshot(`page-${idx}-camera-toggled.png`);
    }
  });

  test('pages[0] local device settings can toggle camera & audio', async ({ pages }) => {
    const page = pages[0];
    page.bringToFront();
    await stubLocalCameraName(page);
    expect(await page.screenshot()).toMatchSnapshot(`local-device-settings-camera-disabled.png`);
    await page.click(dataUiId('call-composite-local-device-settings-microphone-button'));
    await page.click(dataUiId('call-composite-local-device-settings-camera-button'));
    await page.waitForSelector('video');
    expect(await page.screenshot()).toMatchSnapshot(`local-device-settings-camera-enabled.png`);
  });
});