import { addLocationChangeEventHandler } from "./dom";
import { getChannelId, isVideoPage } from "./youtube";
import { logger } from "./logger";
import { CONFIGURE_CHANNEL } from "../constants/actions";

export function injectConfigureBtn(): void {
  function createButton() {
    const hasButton = document.querySelector("#yas_config_channel_btn");

    if (hasButton) {
      return;
    }

    const btn = document.createElement("button");
    btn.id = "yas_config_channel_btn";
    btn.title = "Configure ad skipping for this channel";
    btn.innerHTML = `
      <img height="100%" src="https://github.com/squgeim/yt-ad-autoskipper/raw/master/logo.png" alt="" />
    `;
    btn.style.height = "36px";
    btn.style.marginTop = "6px";
    btn.style.marginBottom = "6px";
    btn.style.cursor = "pointer";

    btn.onclick = () => {
      const channelId = getChannelId();
      logger.debug("configure channel: ", channelId);

      chrome.runtime.sendMessage({
        type: CONFIGURE_CHANNEL,
        channelId,
      });
    };

    const subscribeBtn = document.querySelector(
      "ytd-video-secondary-info-renderer #subscribe-button"
    );
    subscribeBtn?.parentElement?.insertBefore(btn, subscribeBtn);
  }

  createButton();

  addLocationChangeEventHandler((currentLocation) => {
    if (!isVideoPage()) {
      return;
    }

    createButton();
    logger.debug("location change", currentLocation);
  });
}
