# Remember Volume for Facebook & Instagram

A userscript that remembers your preferred video volume on Facebook and Instagram. No more jump scares when unmuting a video — your chosen volume is saved and applied automatically.

## The Problem

Facebook and Instagram reset video volume to 100% every time you unmute a video. This script intercepts that behavior and restores your last-used volume level across all videos.

## Installation

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Edge, Safari)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)
2. [Click here to install the script](https://github.com/ttoan12/remember-volume-for-facebook-and-instagram/raw/main/remember-volume-for-facebook-and-instagram.user.js)

## How It Works

- When you adjust the volume on any video, the script saves that level.
- Every new video that loads will start at your saved volume.
- If Facebook/Instagram tries to reset the volume to 100%, the script overrides it.

## License

[MIT](https://choosealicense.com/licenses/mit/)
