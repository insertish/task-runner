import { runFlow } from "./config/flows.mjs";
import { Triggers } from "./config/triggers.mjs";

export default async function() {
    console.info('Initialising interval tasks...');
    for (const name of Object.keys(Triggers.interval)) {
        const trigger = Triggers.interval[name];

        if (trigger.disabled) {
            console.info(`${name} is disabled, skipping...`);
            continue;
        } else {
            console.info(`Setting up task ${name} for interval runs...`);
        }

        if (trigger.boot) {
            await runFlow(trigger.flow);
        }

        setInterval(() => runFlow(trigger.flow), trigger.repeat * 1e3);
    }
}
