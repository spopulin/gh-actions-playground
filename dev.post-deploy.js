const { runBumpVersion } = require("./bump-version");

async function bumpVersion() {
  try {
    console.log("Running bump version");
    await runBumpVersion();
  } catch (error) {
    console.error("Bump version failed", error);
  }
}

async function run() {
  await bumpVersion();
}

run();
