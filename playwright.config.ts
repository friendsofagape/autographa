import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testDir: './e2e-tests',
	maxFailures: 2,
	timeout: 60000,
	globalTimeout: 60 * 60 * 1000,
};

export default config;
