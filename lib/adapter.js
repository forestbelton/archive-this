const MessageType = {
  ARCHIVE_REQUEST: "ARCHIVE_REQUEST",
  ARCHIVE_OBJECT: "ARCHIVE_OBJECT",
  ARCHIVE_OBJECTS: "ARCHIVE_OBJECTS",
};

class BaseAdapter {
  version() {
    return -1;
  }

  matches() {
    return false;
  }

  execute() {
    return false;
  }
}

const archiveObject = (object) =>
  Promise.resolve({
    type: MessageType.ARCHIVE_OBJECT,
    object,
  });
