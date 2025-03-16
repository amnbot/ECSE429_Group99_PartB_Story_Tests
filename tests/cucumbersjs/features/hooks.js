const { Before, After } = require('@cucumber/cucumber');
const child_process = require('child_process');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const host = "http://localhost:4567";
const todosEndpoint = "/todos";

const jarPath = "tests\\cucumbersjs\\features\\runTodoManagerRestAPI-1.5.5.jar";

if (!fs.existsSync(jarPath)) {
  console.error("jar file not found at:", jarPath);
  throw new Error("jar file not found");
}

// If path contains spaces needs quotes
const jarArg = `"${jarPath}"`;

Before({ timeout: 30000 }, async function () {
  console.log("Starting API using jar at:", jarPath);
  // Spawn the API server using the quoted jarArg.
  this.server = child_process.spawn("java", ["-jar", jarArg], {
    stdio: "inherit",
    shell: true,
  });

  let serverReady = false;
  let retries = 20;
  while (!serverReady && retries > 0) {
    try {
      console.log(`Checking API status... (${21 - retries}/20)`);
      await axios.get(host + todosEndpoint);
      serverReady = true;
      console.log("API is ready!");
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retries--;
    }
  }

  if (!serverReady) {
    console.error("Failed to start API after 20 retries.");
    throw new Error("Failed to start API");
  }
});

After(async function () {
  console.log("Shutting down API...");
  try {
    await axios.get(host + "/shutdown");
  } catch (err) {
    console.error("Error shutting down API:", err.message);
  }
  if (this.server) {
    this.server.kill();
  }
});
