# PSPLUSTilesTheme
An unofficial custom theme for the [Playstation Plus app](https://www.playstation.com/en-gb/support/subscriptions/ps-plus-pc/) with search. Inspired by [this gist](https://gist.github.com/aquelemiguel/170eadf2883d783b24236d249ab28fb9) by aquelemiguel. Tested with version 12.0 and 12.2.

The theme introduces the following changes:
* Remove sliders
* Show games as tiles rather than sliders/carousels
* Sticky headers for game sections on scroll
* Game search with live result update
* Move play history to the top
* Display platform badge

Tested on the UK locale.

## Demo

![alt text](pspdemo.gif)

## Installation
**NOTE**: The installation is manual, and always will be. While it is possible to create an installer, the manual installation allows you to see what is being changed.
Review every change you make. There will never be an installer for this to not give anyone the opportunity to inject malicious content.

### Prerequisites
* A recent version of [npm](https://www.npmjs.com/) 

### Unpacking app.asar
Open a terminal as an administrator. Navigate to the resources folder in the launcher installation directory:

```bash
$ cd C:\Program Files (x86)\PlayStationPlus\agl\resources
```

There should be an `app.asar` file in this folder. [`asar`](https://github.com/electron/asar) is an archive format for compressing your Electron app. We need to unpack it to have access to the project's files.

```bash
$ npx asar extract app.asar app
```

This generates an `app` folder in the same directory. Rename the old `app.asar` to `app.asar.bak` to make the launcher prefer the new folder.

### Editing preload_context_isolation.js
Open `app/html/preload_context_isolation.js` in a text editor as an administrator.

Identify this line near the top of the file (should be line 3):
```js
var GKP = function () {
```

Directly underneath it, copy and paste the code from [code.js](code.js) and save the file.

If you encounter permission errors, this is because you haven't opened the text editor as an administrator. Either reopen the application, or save a copy, and the move the copy to the original folder - Windows should then prompt you to approve the copy process.

## Notice
This repository does not contain any code owned by Sony Interactive Entertainment or its subsidiaries. All code is original.
“PlayStation”, “PS5”, “PS4”, “PS3”, “PS2” are registered trademarks or trademarks of Sony Interactive Entertainment Inc.
All content, games titles, trade names and/or trade dress, trademarks, artwork and associated imagery are trademarks and/or copyright material of their respective owners.
Maintainers of this repository do not take any responsibility for any adverse effects of using the code changes. Use at your own risk.

## License
GNU Affero General Public License v3.0. See [LICENSE](LICENSE).
