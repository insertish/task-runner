import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

/** @type {Record<'shell', Record<string, string>>} */
export const Scripts = {
    shell: {}
};

// Load list of all scripts
const files = await readdir(resolve('config', 'scripts'));
for (const file of files) {
    const segments = file.split('.'),
          extension = segments.pop(),
          filename = segments.join('.');
    
    if (extension === 'sh') {
        Scripts.shell[filename] = resolve('config', 'scripts', file);
    }
}
