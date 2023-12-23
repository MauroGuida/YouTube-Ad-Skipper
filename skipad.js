(function () {
  var timeoutId;

  function checkAndSkipAd() {
    var adDiv = document.querySelector('div.video-ads');
    var adPlayer = document.querySelector('video.video-stream.html5-main-video');

    if (isElementVisible(adDiv)) {
      console.log("Ad detected");
      
      if (adPlayer.currentTime < 900 && !adPlayer.paused) {
        adPlayer.currentTime = 900; //Set current video time to 15 Minutes
        console.log("Ad skipped");
      }
    }
  }

  /**
  * We check if the element is visible by using the `offsetParent` attribute.
  * It is `null` if the element, or any of its parents, is set to have style `display:none`.
  * 
  * @param {Element} el - The element
  * @returns {boolean} - Whether the element is visible on the screen
  */
  function isElementVisible(el) {
    if (!el)
      return false;

    return el.offsetParent === null ? false : true;
  }

  /**
  * Initializes an observer on the YouTube Video Player to get events when any
  * of its child elements change.
  *
  * @returns {Boolean} - true if observer could be set up, false otherwise
  */
  function initObserver() {
    if (!('MutationObserver' in window)) {
      return false;
    }

    var ytdPlayer = document.querySelector('ytd-player#ytd-player');

    if (!ytdPlayer) {
      return false;
    }

    var observer = new MutationObserver(() => {
      console.log("Observer function called");
      checkAndSkipAd();
    });

    observer.observe(ytdPlayer, { childList: true, subtree: true });

    clearTimeout(timeoutId); // Just for good measure

    return true;
  }

  /**
  * We have two implementations to check for ads: one is based on
  * MutationObserver, that is only triggered when the video-player is updated in
  * the page; second is a simple poll that constantly checks for the existence of ads.
  * 
  * We first try to set up the mutation observer. It can sometimes fail even when the
  * browser supports it, if the video player has not yet been attached to the DOM.
  * In such cases, we continue the polling implementation until the observer can be
  * set up.
  */
  function initTimeout() {
    clearTimeout(timeoutId);

    if (initObserver()) {
      console.log("Observer attached successfully to the player");
      return;
    }

    timeoutId = setTimeout(function() {
      checkAndSkipAd();

      initTimeout();
    }, 2000);
  }

  /**
  * Check if we are running in an iframe. We do that by checking if our current
  * window is the same as the top parent window. The try..catch is there because
  * some browsers will not let a script in an iframe access the parent window.
  */
  var inIframe = (function() {
    try {
      return window.self !== window.top;
    } catch (e) {
      // The browser did not let us access the parent window. Which also means we
      // are in an iframe.
      return true;
    }
  })();

  /**
  * Only start the script if we are at the top level. YouTube has a few iframes
  * in the page which would also be running this content script.
  */
  if (!inIframe) {
    // main:
    initTimeout();
  }
})();
