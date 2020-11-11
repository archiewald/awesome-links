const GUARD = "<!-- awesome-links-feed -->";

function createPage(page, bookmarks) {
  const header = page.split(GUARD)[0] + `\n${GUARD}`;

  return (
    header +
    bookmarks
      .flatMap(({ title, children }) => [
        {
          title,
          header: true,
        },
        ...children,
      ])
      .map(({ title, header, url }) =>
        header
          ? `\n## ${title}\n\n`
          : `- <a href="${url}" target="_blank">${title}</a>\n`
      )
      .join("")
  );
}

exports.createPage = createPage;
