import { getElementsByClassNames, clickElem } from "../../utils/dom";
import { Events, YouTubeEvents } from "../../utils/youtubeEvents";

export class BannerAdRemover {
  public setupListeners(): void {
    // Banner ads are removed as soon as they appear.
    YouTubeEvents.addListener(Events.tick, () => {
      getElementsByClassNames([
        "ytp-ad-overlay-close-button", // Close overlay button
      ]).forEach((elem) => clickElem(elem));
    });
  }
}
