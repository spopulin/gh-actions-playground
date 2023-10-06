const exec = require("child_process").exec;
const fs = require("fs").promises;

function run(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function readJsonFile(path) {
  const rawPjson = await fs.readFile(path, { encoding: "utf8" });
  return JSON.parse(rawPjson);
}

async function projectVersion(debug) {
  let pjson;
  try {
    pjson = await readJsonFile("./package.json");
  } catch (e) {
    console.error("Failed to read package.json.");
    throw e;
  }
  if (debug) console.log(JSON.stringify(pjson.version, null, 2));
  return pjson.version;
}

module.exports = { run, projectVersion };
