import { loadEnv } from "./env";
import { selectAndHello, Provider } from "./provider";

async function main() {
  loadEnv();
  try {
    const result = await selectAndHello("groq");
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Error message:", message);
    process.exit(1);
  }
}
main();
