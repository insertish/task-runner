import { config } from "dotenv";
config();

// Build environments
import setup from "./src/config/environments.mjs"
await setup();

// Load configuration
import "./src/config/flows.mjs"
import "./src/config/scripts.mjs"
import "./src/config/triggers.mjs"

// Start web server
import listen from "./src/web.mjs"
listen();

// Run tasks on interval
import start from "./src/interval.mjs"
start();
