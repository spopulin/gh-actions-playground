const { run, projectVersion } = require(".");

async function settingCommitterIdentity() {
  console.log("Setting Committer Identity");

  let currentEmail, currentName;

  try {
    currentEmail = await run("git config --global user.email");
  } catch (e) {
    console.error("Failed to get committer email in git respository.");
  }

  try {
    currentName = await run("git config --global user.name");
  } catch (e) {
    console.error("Failed to get committer name in git respository.");
  }

  if (!currentEmail) {
    const email = "testing@spopulin.com";
    try {
      await run(`git config --global user.email "${email}"`);
    } catch (e) {
      console.error(
        `Failed to set ${email} as committer email in git respository.`
      );
      throw e;
    }
  }

  if (!currentName) {
    const name = "testing-spopulin";
    try {
      await run(`git config --global user.name "${name}"`);
    } catch (e) {
      console.error(
        `Failed to set ${name} as committer name in git respository.`
      );
      throw e;
    }
  }

  console.log("Setting Committer Identity Done!!");
}

async function gitPush(branchOrTag) {
  try {
    await run(`git push origin ${branchOrTag}`);
  } catch (e) {
    console.error(`Failed to push ${branchOrTag} to git origin.`);
    throw e;
    å;
  }
}

async function gitForcePush(branchOrTag) {
  try {
    await run(`git push --force origin ${branchOrTag}`);
  } catch (e) {
    console.error(`Failed to force push ${branchOrTag} to git origin.`);
    throw e;
  }
}

async function gitRestore() {
  try {
    await run("git restore .");
  } catch (e) {
    console.error("Failed to restore status in git repository.");
    throw e;
  }
}

async function gitCheckout(branchOrTag) {
  try {
    await run(`git checkout ${branchOrTag}`);
  } catch (e) {
    console.error(`Failed to checkout ${branchOrTag} in git repository.`);
    throw e;
  }
}

async function createTag() {
  console.log("Creating Tag");

  const version = await projectVersion();
  const tag = `v${version}`;

  const response = await run(`if git rev-list ${tag}.. >/dev/null 
    then 
        echo "EXIST" 
    else 
        echo "NOT FOUND" 
  fi`);
  if (response.indexOf("EXIST") !== -1) {
    throw new Error("Tag already exist!");
  }

  try {
    await run(`git tag -a ${tag} -m "Post-Deploy Tag"`);
  } catch (e) {
    console.error(`Failed to tag ${tag} in git respository.`);
    throw e;
  }

  await gitPush(tag);

  console.log(`Creating Tag ${tag} Done!!`);

  return tag;
}

async function currentCommit() {
  console.log("Getting current commit.");

  let commit;

  try {
    commit = await run("git rev-parse HEAD");
  } catch (e) {
    console.error("Failed to get current commit.");
    throw e;
  }

  return commit;
}

async function increaseVersion(branch) {
  console.log(`Increasing Package version in ${branch} branch`);

  await gitRestore();
  await gitCheckout(branch);

  try {
    await run("git pull --no-rebase");
  } catch (e) {
    console.error(
      "Failed to pull last changes from git repository, you have to increase the package version manually."
    );
    throw e;
  }

  let version;

  try {
    version = await run("npm --no-git-tag-version version patch");
  } catch (e) {
    console.error("Failed to commit increased package version.");
    throw e;
  }

  try {
    await run("git add package.json package-lock.json");
  } catch (e) {
    console.error(
      "Failed to add package.json and package-lock.json in git repository."
    );
    throw e;
  }

  try {
    await run(
      `git commit -m "[skip ci] Increased package version to ${version}"`
    );
  } catch (e) {
    console.error("Failed to commit increased package version.");
    throw e;
  }

  await gitPush(branch);

  console.log(
    `Increasing Package version to ${version.trim()} in ${branch} branch Done!!`
  );
}

module.exports = {
  increaseVersion,
  settingCommitterIdentity,
  createTag,
  currentCommit,
};
