const { createUpdatedPage } = require("./createAwesomePage");
const bookmarks = require("./awesomeBookmarks.json");
const fs = require("fs").promises;

const awesomePage = createUpdatedPage(
  `HELLO

<!-- awesome-links-feed -->

- [LINK](https://kozubek.dev)
`,
  bookmarks
);
fs.writeFile("./awesomeTest.md", awesomePage);
