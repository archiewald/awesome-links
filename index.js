const util = require("util");
const exec = util.promisify(require("child_process").exec);
const express = require("express");
const fs = require("fs").promises;
const rmrf = require("rmrf");

async function main(stuff) {
  await rmrf("./temp");
  console.log("Cloning repo to temp folder");

  if (process.env.HEROKU === "true") {
    await exec(
      `git clone "https://${process.env.GIT_USERNAME}:${process.env.GIT_PASSWORD}@github.com/archiewald/archiewald.github.io" "./temp"`
    );
    await exec('git config --global user.email "awesome-links@example.com"', {
      cwd: "./temp",
    });
    await exec('git config --global user.name "Awesome Links"', {
      cwd: "./temp",
    });
  } else {
    await exec(
      `git clone "https://github.com/archiewald/archiewald.github.io" "./temp"`
    );
  }

  console.log("Reading awesome links file");
  const content = await fs.readFile("./temp/awesome-links.md", "utf8");

  console.log("Updating awesome links file");
  const newContent = content + `\nUpdate: ${Date.now().toString()}`;
  fs.writeFile("./temp/awesome-links.md", newContent);

  console.log("Commiting and pushing 🚀");
  await exec("git add ./awesome-links.md", {
    cwd: "./temp",
  });
  await exec('git commit -m "update awesome links"', {
    cwd: "./temp",
  });
  await exec("git push", {
    cwd: "./temp",
  });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/", async (req, res) => {
  console.log(req.body);
  await main(JSON.stringify(req.body));
  res.send(req.body);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
