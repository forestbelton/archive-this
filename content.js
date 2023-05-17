const ALL_ADAPTERS = [new TweetAdapter()];

browser.runtime.onMessage.addListener((data, sender) => {
  if (data.type !== MessageType.ARCHIVE_REQUEST) {
    return false;
  }
  const href = window.location.href;
  const adapter = ALL_ADAPTERS.find((adapter) => adapter.matches(href));
  if (typeof adapter === "undefined") {
    return false;
  }
  const result = adapter.execute(data);
  console.log(result);
  return result;
});
