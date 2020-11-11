function getAwesomeBookmarks() {
  chrome.bookmarks.getTree(async (bookmarks) => {
    const awesomeBookmarks = bookmarks[0].children
      .find(({ id }) => id === "1")
      .children.find(({ children, title }) => children && title === "awesome")
      .children.map(({ title, children }) => ({
        title,
        children: children.map(({ title, url, id }) => ({ id, title, url })),
      }));

    await fetch(process.env.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookmarks: awesomeBookmarks,
        secret: process.env.SECRET,
      }),
    });
  });
}

chrome.runtime.onInstalled.addListener(getAwesomeBookmarks);
chrome.bookmarks.onCreated.addListener(getAwesomeBookmarks);
chrome.bookmarks.onRemoved.addListener(getAwesomeBookmarks);
chrome.bookmarks.onChanged.addListener(getAwesomeBookmarks);
chrome.bookmarks.onMoved.addListener(getAwesomeBookmarks);
chrome.bookmarks.onChildrenReordered.addListener(getAwesomeBookmarks);
