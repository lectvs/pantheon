# How To Build @lectvs Source Code
## Requirements
- Typescript installed (compilation uses either tsc or tscw)
- Visual Studio Code for editing (optional but helpful)

## Steps
### Modify Source Code
- `lectvs`: folder containing source code for the base engine
- `src`: folder containing source code for the game
- `bin`: folder containing compiled game code, libraries, and assets
	- `bin/assets`: folder containing all game assets (art, sounds, etc.)
- `drafts`: folder containing random notes and unused assets :)

#### VS Code Notes
VS Code is the recommended way to edit this source code. Simply open the root folder (containing `src`, `def`, etc.) in VS Code and enjoy Typescript definitions, auto-complete, etc. :)
- In VS Code, press `CTRL-SHIFT-B` to either build the code or start a watch daemon

### Build
Run `tscw.bat` to start a Typescript watch daemon. This will build the whole game whenever it detects a file change. Specifically, it compiles all Typescript code to create `bin/js/game.js`.

### Run
In order to run the game in browser, you will need to start up a web server. This can be accomplished many ways, I recommend using [Mongoose](https://cesanta.com/binary.html) as it's lightweight and does not require configuration.
1. Start a web server in the root directory (containing `src`, `bin`, etc.).
	- If using Mongoose, you can copy the .exe into the root folder and then run it.
2. Visit `http://localhost:[PORT]/bin/` in your web browser, where PORT is the port you started your web server with.
	- Mongoose uses port 8080 by default.

## Can I use your code/assets in my game?
Sure! You can use any of my code from the `lectvs` or `src` folders, and any **ART** assets. Unfortunately, as I don't own all of the sound assets used in this game, I don't have the authority to let you use them. If you make a game using my stuff, do let me know on Twitter (@lectvs), as I would love to play it! :)