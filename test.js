const fs = require("fs").promises;

const { createPage } = require("./create-page");
const bookmarks = require("./test-bookmarks.json");

const awesomePage = createPage(
  `## HELLO

WELCOME TO MY BOOKMARKS

<!-- awesome-links-feed -->

- [LINK](https://kozubek.dev)
`,
  bookmarks
);
fs.writeFile("./test-page.md", awesomePage);
