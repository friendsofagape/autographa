import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testDir: './e2e-tests',
	maxFailures: 2,
	timeout: 30000,
	globalTimeout: 600000,
};

export default config;
