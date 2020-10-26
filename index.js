const Git = require("nodegit");
const fs = require("fs").promises;
const rimraf = require("rimraf");

// https://gist.github.com/getify/f5b111381413f9d9f4b2571c7d5822ce

let repo;
let index;
let oid;

const main = async (event) => {
  Git.Clone("https://github.com/archiewald/archiewald.github.io", "./temp")
    // Look up this known commit.
    .then((_repo) => {
      repo = _repo;

      return _repo.getBranchCommit("master");
    })
    // Look up a specific file within that commit.
    .then((commit) => {
      return commit.getEntry("awesome-links.md");
    })
    // Get the blob contents from the file.
    .then((entry) => {
      // Patch the blob to contain a reference to the entry.
      return entry.getBlob().then((blob) => {
        blob.entry = entry;
        return blob;
      });
    })
    // Display information about the blob.
    .then((blob) => {
      // Show the entire file.
      let links = String(blob);
      console.log(links);

      // add new line with date
      links = links + `\nUpdate: ${Date.now().toString()}`;

      return links;
    })
    .then((newLinks) => {
      return fs.writeFile("./temp/awesome-links.md", newLinks);
    })
    .then(() => {
      return repo.refreshIndex();
    })
    .then((_index) => {
      index = _index;
      return _index.addByPath("awesome-links.md");
    })
    .then(() => {
      return index.write();
    })
    .then(() => {
      return index.writeTree();
    })
    .then(function (_oid) {
      oid = _oid;
      return Git.Reference.nameToId(repo, "HEAD");
    })
    .then(function (head) {
      return repo.getCommit(head);
    })
    .then(function (parent) {
      var author = Git.Signature.now("Artur Kozubek", "artur@kozubek.dev");
      var committer = Git.Signature.now("Artur Kozubek", "artur@kozubek.dev");

      return repo.createCommit(
        "HEAD",
        author,
        committer,
        `${Date.now().toString} update`,
        oid,
        [parent]
      );
    })
    .then(function (commitId) {
      console.log("New Commit: ", commitId);
    })
    .then(() => {
      return repo.getRemote("origin");
    })
    .then((remote) => {
      remote.push(["refs/heads/master:refs/heads/master"], {
        ignoreCertErrors: 1,
        callbacks: {
          certificateCheck: () => 1,
          credentials: Git.Cred.userpassPlaintextNew(
            "archiewald",
            "bfb609423f8903b04a9b25a606de50dd2fc9b5db"
          ),
          transferProgress: {
            throttle: 100,
          },
        },
      });
    })
    // .then(function () {
    //   return Git.Remote.create(
    //     repo,
    //     "origin",
    //     "https://github.com/archiewald/archiewald.github.io"
    //   )
    //   .then(function (remoteResult) {
    //     remote = remoteResult;

    //     // Create the push object for this remote
    //     return remote.push(
    //       ["refs/heads/master:refs/heads/master"]
    //       // {
    //       //   callbacks: {
    //       //     credentials: function (url, userName) {
    //       //       return nodegit.Cred.sshKeyFromAgent(userName);
    //       //     },
    //       //   },
    //       // }
    //     );
    //   });
    // })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      rimraf.sync("./temp");
    });

  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify(event),
  };
  return response;
};

main();

exports.handler = main;
