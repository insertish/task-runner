import { config } from "dotenv";
config();

// Load configuration
import "./src/config/environments.mjs"
import "./src/config/flows.mjs"
import "./src/config/scripts.mjs"
import "./src/config/triggers.mjs"

// Start web server
import "./src/web.mjs";
