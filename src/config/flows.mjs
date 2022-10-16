import { readdir, readFile } from 'node:fs/promises'
import { DOCKER_ENV_PREFIX, Environments } from './environments.mjs';
import { resolve } from 'node:path'
import { Scripts } from './scripts.mjs';
import { spawn } from '../child.mjs';

/** @type {Record<string, { environments: string[], tasks: { type: "script", target: string, script: string, env: Record<string, string> }[] }>} */
export const Flows = {};

// Load list of all flows
const files = await readdir(resolve('config', 'flows'));
for (const file of files) {
    const segments = file.split('.'),
          extension = segments.pop(),
          filename = segments.join('.');
    
    if (extension === 'json') {
        Flows[filename] = JSON.parse(await readFile(resolve('config', 'flows', file)));
    }
}

// Run a flow
export async function runFlow(name) {
    console.info(`Running flow ${name}`);

    const flow = Flows[name];
    for (const task of flow.tasks) {
        switch (task.type) {
            case 'script': {
                const [env_type, dockerfile] = task.target.split(':');
                if (env_type === 'docker') {
                    if (!Environments.docker.includes(dockerfile)) {
                        throw `Unknown Docker environment ${dockerfile}`;
                    }

                    const [script_type, script_name] = task.script.split(':');
                    if (script_type === 'shell') {
                        const script = Scripts.shell[script_name];
                        await spawn(`cat ${script} | docker run -i${Object.keys(task.env).map(key => ` -e ${key}`).join('')} --env-file ./.env ${DOCKER_ENV_PREFIX}${dockerfile} /bin/sh`, task.env);
                    } else {
                        throw "Unsupported script!";
                    }
                } else {
                    throw "Unsupported target!";
                }
                break;
            }
        }
    }
}
