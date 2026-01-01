import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/*": index,
  },
  development: {
    hmr: true,
    console: true,
  },
  port: 8888,
});

console.log(`Server running at ${server.url}`);
