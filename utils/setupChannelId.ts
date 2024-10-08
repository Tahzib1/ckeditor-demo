/**
 * This function is responsible for setting up the channel ID, so that real-time collaboration
 * sessions could be shared just by passing an URL with the channel ID.
 */
export function setupChannelId() {
  const hash = window.location.hash.match(/#id=(.*)/);

  let channelId = undefined;
  if (hash && hash[1]) {
    channelId = hash[1];
  } else {
    channelId = `cks${Math.random().toString(36).substring(2)}`;
  }

  return channelId;
}
