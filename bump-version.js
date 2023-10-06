const { increaseVersion, settingCommitterIdentity } = require("./common/git");
const { exit } = require("process");

async function runBumpVersion() {
  await settingCommitterIdentity();
  await increaseVersion("test-gh");
}

if (require.main === module) {
  try {
    runBumpVersion();
  } catch (e) {
    console.error("Bump version failed", e);
    exit(1);
  }
}

module.exports = {
  runBumpVersion,
};
