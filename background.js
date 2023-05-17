const ARCHIVE_THIS_ID = "archive-this";
const ARCHIVE_THIS_TITLE = "Archive this";
const ARCHIVE_DIRECTORY = "archive-this";

const MessageType = {
  ARCHIVE_REQUEST: "ARCHIVE_REQUEST",
  ARCHIVE_OBJECT: "ARCHIVE_OBJECT",
  ARCHIVE_OBJECTS: "ARCHIVE_OBJECTS",
};

browser.contextMenus.create({
  id: ARCHIVE_THIS_ID,
  title: ARCHIVE_THIS_TITLE,
  contexts: ["page"],
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  browser.tabs
    .sendMessage(tab.id, {
      type: MessageType.ARCHIVE_REQUEST,
      targetElementId: info.targetElementId,
    })
    .then(({ type, ...data }) => {
      if (type === MessageType.ARCHIVE_OBJECT) {
        archiveObject(data.object);
      } else if (type === MessageType.ARCHIVE_OBJECTS) {
        archiveObjects(data.objects);
      } else {
        console.error(`[ARCHIVE-THIS] Unknown message type '${type}'`);
      }
    });
});

const archiveObject = (objectWithUri) => {
  const { uri, ...object } = objectWithUri;
  const filename = `${encodeURIComponent(uri)}.json`;
  const objectBlob = new Blob([JSON.stringify(object, null, 2)], {
    type: "application/json",
  });
  console.log(`[ARCHIVE-THIS] Saving object ${uri} -> ${filename}`);
  return browser.downloads.download({
    url: URL.createObjectURL(objectBlob),
    filename: `${ARCHIVE_DIRECTORY}/${filename}`,
  });
};

const archiveObjects = (objectsWithUri) =>
  Promise.all(objectsWithUri.map(archiveObject));
