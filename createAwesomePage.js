const GUARD = "<!-- awesome-links-feed -->";

function createUpdatedPage(page, bookmarks) {
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
          : `- [${title}](${url}){:target="_blank"}\n`
      )
      .join("")
  );
}

exports.createUpdatedPage = createUpdatedPage;
