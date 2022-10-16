import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/** @type {{ webhook: Record<string, { flow: string, method: 'get' | 'post', if?: { type: "body", key: string, value: string }[] }>, interval: Record<string, { flow: string, repeat: number, boot?: boolean, disabled?: boolean }> }>>} */
export const Triggers = {
    webhook: {},
    interval: {}
};

// Load list of all triggers (webhooks)
for (const type of ['webhook', 'interval']) {
    const plural = type + 's';
    const files = await readdir(resolve('config', 'triggers', plural));
    for (const file of files) {
        const segments = file.split('.'),
            extension = segments.pop(),
            filename = segments.join('.');
        
        if (extension === 'json') {
            Triggers[type][filename] = JSON.parse(
                await readFile(resolve('config', 'triggers', plural, file))
            );
        }
    }
}
