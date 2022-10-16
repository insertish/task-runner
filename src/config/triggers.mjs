import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/** @type {Record<'webhook', Record<string, { flow: string, method: 'get' | 'post', if?: { type: "body", key: string, value: string }[] }>>} */
export const Triggers = {
    webhook: {}
};

// Load list of all triggers (webhooks)
const files = await readdir(resolve('config', 'triggers', 'webhooks'));
for (const file of files) {
    const segments = file.split('.'),
          extension = segments.pop(),
          filename = segments.join('.');
    
    if (extension === 'json') {
        Triggers.webhook[filename] = JSON.parse(
            await readFile(resolve('config', 'triggers', 'webhooks', file))
        );
    }
}
