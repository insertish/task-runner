import { exec as nodeExec, spawn as nodeSpawn } from 'node:child_process'
import { promisify } from 'node:util'

export const exec = promisify(nodeExec);

/**
 * @param {string} cmd
 * @param {NodeJS.ProcessEnv | undefined} env
 */
export const spawn = (cmd, env) => new Promise((resolve, reject) => {
    const child = nodeSpawn("sh", ["-c", cmd], {
        cwd: process.cwd(),
        detached: true,
        stdio: "inherit",
        env
    });

    child.on('error', reject);
    child.on('exit', resolve);
});
