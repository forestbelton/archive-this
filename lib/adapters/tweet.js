const TWITTER_URL_PATTERN =
  /^https:\/\/(www\.)?twitter\.com\/([^\/]+)\/status\/(\d+)(\?.*)?$/;

const SELECTOR_ACCOUNTNAME = '[data-testid="User-Name"] a[tabindex="-1"]';
const SELECTOR_AVATAR = '[data-testid="Tweet-User-Avatar"] img';
const SELECTOR_CONTENT = '[data-testid="tweetText"]';
const SELECTOR_DISPLAYNAME = '[data-testid="User-Name"] a:not([tabindex="-1"])';
const SELECTOR_RETWEET_URL = 'a[href$="/retweets"]';
const SELECTOR_PUBLISHED_AT = "time";

class TweetAdapter extends BaseAdapter {
  version() {
    return 1;
  }

  matches(href) {
    return TWITTER_URL_PATTERN.test(href);
  }

  execute({ targetElementId }) {
    // Search for tweet container from where they clicked
    const focusElement = browser.menus.getTargetElement(targetElementId);
    const tweetElement = this.findTweetContainer(focusElement);

    // TODO: Error instead of silently fail
    if (tweetElement === null) {
      return false;
    }

    const accountName = tweetElement.querySelector(SELECTOR_ACCOUNTNAME);
    const avatar = tweetElement.querySelector(SELECTOR_AVATAR);
    const content = tweetElement.querySelector(SELECTOR_CONTENT);
    const displayName = tweetElement.querySelector(SELECTOR_DISPLAYNAME);
    const publishedAt = tweetElement.querySelector(SELECTOR_PUBLISHED_AT);
    const retweetUrl = tweetElement.querySelector(SELECTOR_RETWEET_URL);

    // TODO: Error instead of silently fail
    if (
      avatar === null ||
      displayName === null ||
      accountName === null ||
      content === null ||
      publishedAt === null ||
      retweetUrl === null
    ) {
      return false;
    }

    // TODO: Fetch avatar URL
    // TODO: Support embed content
    const url = retweetUrl.href.replace(/\/retweets$/, "");
    const tweetId = TWITTER_URL_PATTERN.exec(url)[3];

    return archiveObject({
      uri: url,
      url,
      tweetId,
      publishedAt: publishedAt.dateTime,
      avatarUrl: avatar.src,
      displayName: displayName.textContent,
      accountName: accountName.textContent.substring(1),
      content: content.textContent,
    });
  }

  findTweetContainer(element) {
    let container = element;
    while (container !== null && container.dataset["testid"] !== "tweet") {
      container = container.parentElement;
    }
    // TODO: If no tweet container found, fall back to CSS selector
    //       (e.g. article[data-testid="tweet"])
    return container;
  }
}
