const util = require("util");
const exec = util.promisify(require("child_process").exec);
const express = require("express");
const fs = require("fs").promises;
const rmrf = require("rmrf");
const cors = require("cors");

const { createPage } = require("./create-page");

const AWESOME_PAGE_PATH = "./temp/awesome.md";

async function main(bookmarks) {
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
  const content = await fs.readFile(AWESOME_PAGE_PATH, "utf8");

  console.log("Updating awesome links file");
  const newContent = createPage(content, bookmarks);
  await fs.writeFile(AWESOME_PAGE_PATH, newContent);

  console.log("Commiting and pushing 🚀");
  await exec("git add ./awesome.md", {
    cwd: "./temp",
  });
  await exec('git commit -m "update awesome links"', {
    cwd: "./temp",
  });
  await exec("git push", {
    cwd: "./temp",
  });
  console.log("Push success!");
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  if (req.body.secret !== process.env.SECRET) {
    return res.sendStatus(401);
  }

  await main(req.body.bookmarks);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
