function getAwesomeBookmarks() {
  chrome.bookmarks.getTree(async (bookmarks) => {
    const awesomeBookmarks = bookmarks[0].children
      .find(({ id }) => id === "1")
      .children.find(({ children, title }) => children && title === "awesome");

    const response = await (
      await fetch("https://f4yfihch5f.execute-api.eu-central-1.amazonaws.com", {
        method: "POST",
        body: JSON.stringify(awesomeBookmarks),
      })
    ).json();
    debugger;
  });
}

chrome.runtime.onInstalled.addListener(getAwesomeBookmarks);
chrome.bookmarks.onCreated.addListener(getAwesomeBookmarks);
chrome.bookmarks.onRemoved.addListener(getAwesomeBookmarks);
chrome.bookmarks.onChanged.addListener(getAwesomeBookmarks);
chrome.bookmarks.onMoved.addListener(getAwesomeBookmarks);
chrome.bookmarks.onChildrenReordered.addListener(getAwesomeBookmarks);
