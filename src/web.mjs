import express from 'express'
import { runFlow } from './config/flows.mjs'
import { Triggers } from './config/triggers.mjs'

const app = express()
const port = 10680

app.use(express.json());

app.get('/', (_, res) => {
  res.send('Hello from Task Runner!')
})

export default function() {
  return new Promise(resolve => {
    for (const name of Object.keys(Triggers.webhook)) {
        const webhook = Triggers.webhook[name];
        app[webhook.method](`/api/v1/trigger/webhook/${name}`, async (req, res) => {
          if (webhook.if) {
            for (const condition of webhook.if) {
              if (condition.type === 'body') {
                let ref = req.body;
                const path = condition.key.split('.');
                while (ref && path.length > 0) {
                  ref = ref[path.shift()];
                }

                if (path.length > 0) {
                  throw "Did not consume all tokens!";
                }

                if (ref !== condition.value) {
                  res.sendStatus(204);
                  console.info("Ignoring request as condition did not match!");
                  return;
                }
              }
            }
          }

          runFlow(webhook.flow);
          res.sendStatus(204);
        });
    }

    app.listen(port, () => {
      console.log(`Listening on :${port}`);
      resolve();
    });
  });
}
