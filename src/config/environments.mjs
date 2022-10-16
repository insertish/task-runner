import { spawn } from '../child.mjs'

import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

/** @type {Record<'docker', string[]>} */
export const Environments = {
    docker: []
};

export const DOCKER_ENV_PREFIX = "docker_env_";

// Load list of all environments
const files = await readdir(resolve('config', 'environments'));
for (const file of files) {
    const segments = file.split('.'),
          extension = segments.pop(),
          filename = segments.join('.');
    
    if (extension === 'Dockerfile') {
        Environments.docker.push(filename);
    }
}

// Ensure all environments are ready
for (const dockerfile of Environments.docker) {
    console.info(`Building Docker environment ${dockerfile}`);
    const path = resolve('config', 'environments', dockerfile);
    await spawn(`docker build -t ${DOCKER_ENV_PREFIX}${dockerfile} - < ${path}.Dockerfile`);
}

console.info('Environments ready!');
