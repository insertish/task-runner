import express from 'express'
import { runFlow } from './config/flows.mjs'
import { Triggers } from './config/triggers.mjs'

const app = express()
const port = 10680

app.get('/', (_, res) => {
  res.send('Hello from Task Runner!')
})

app.listen(port, () => {
  console.log(`Listening on :${port}`)
})

for (const name of Object.keys(Triggers.webhook)) {
    const webhook = Triggers.webhook[name];
    app[webhook.method](`/api/v1/trigger/webhook/${name}`, async (_, res) => {
        await runFlow(webhook.flow);
        res.sendStatus(204);
    });
}
