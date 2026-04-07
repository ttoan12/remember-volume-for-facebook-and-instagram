// ==UserScript==
// @name         Remember Volume for Facebook & Instagram
// @description  Remembers and applies your preferred volume to all videos on Facebook and Instagram
// @version      1.0.0
// @license      MIT
// @namespace    https://github.com/ttoan12
// @homepageURL  https://github.com/ttoan12/remember-volume-for-facebook-and-instagram
// @supportURL   https://github.com/ttoan12/remember-volume-for-facebook-and-instagram/issues

// @match        https://www.facebook.com/*
// @match        https://www.instagram.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULT_VOLUME = 0.4;
  const DEBOUNCE_MS = 300;

  let volume = GM_getValue("volume", DEFAULT_VOLUME);
  let syncing = false;
  let debounceTimer = null;

  // Use a Set so we can efficiently delete entries when elements are removed.
  const trackedVideos = new Set();

  function applyVolume(video) {
    video.volume = volume;
  }

  function syncAllVideos(newVolume) {
    if (syncing) return;
    syncing = true;

    volume = newVolume;
    GM_setValue("volume", volume);

    for (const video of trackedVideos) {
      applyVolume(video);
    }

    syncing = false;
  }

  function onVolumeChange(event) {
    if (syncing) return;
    const video = event.target;

    // First volumechange fires right after we set the volume in trackVideo().
    // Ignore it so we don't treat our own write as a user change.
    if (video.dataset.volumefix === "applying") {
      video.dataset.volumefix = "ready";
      return;
    }

    // Facebook/Instagram reset volume to 1 when unmuting — override it.
    if (video.volume === 1 && volume !== 1) {
      syncing = true;
      applyVolume(video);
      syncing = false;
      return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => syncAllVideos(video.volume), DEBOUNCE_MS);
  }

  function trackVideo(video) {
    video.dataset.volumefix = "applying";
    applyVolume(video);
    video.addEventListener("volumechange", onVolumeChange);
    trackedVideos.add(video);
  }

  function scanForNewVideos() {
    const untracked = document.querySelectorAll("video:not([data-volumefix])");
    untracked.forEach(trackVideo);
  }

  // Clean up references to videos that have been removed from the DOM.
  function pruneDetachedVideos() {
    for (const video of trackedVideos) {
      if (!video.isConnected) {
        video.removeEventListener("volumechange", onVolumeChange);
        trackedVideos.delete(video);
      }
    }
  }

  // Initial scan
  scanForNewVideos();

  // Watch for dynamically added/removed videos
  const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    let shouldPrune = false;

    for (const m of mutations) {
      if (m.addedNodes.length > 0) shouldScan = true;
      if (m.removedNodes.length > 0) shouldPrune = true;
      if (shouldScan && shouldPrune) break;
    }

    if (shouldScan) scanForNewVideos();
    if (shouldPrune) pruneDetachedVideos();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log("[Volume Fix] Started — default volume:", volume);
})();
