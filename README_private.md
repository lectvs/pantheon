# How To Add lectvs Submodule
- `git submodule add git@github.com:lectvs/pantheon.git`

# Cloning With lectvs Submodule
- After cloning this repo with `git clone git@github.com:lectvs/REPO.git`...
- `git submodule init`
- `git submodule update`

# New Game Checklist
- Change game name and window title in `bin/index.html`

# Pre-Publish Checklist
- Sound does not restart on death
- Music volume not too loud
- Check for remaining TODOs
- Test with throttling (chrome dev console > performance > [gear])
- Test for memory leaks
- Test game in Incognito mode (only with save data)

# Publish Notes
- None

# How To Build Electron App
- `cd bin/`
- `npm install`
- `npx electron-packager . [name]`

# Game Design Tips
- Stop + Shake + Slow Motion
- High Risk, High Reward
- Wall of Death: Ultimate Risk, Ultimate Reward
- Stress and Release

# Platformer Tips
https://twitter.com/maddythorson/status/1238338574220546049
- Coyote time
- Press jump slightly before landing -> still jump
- Hold jump -> peak has half gravity
- Bonk head on corner -> auto-wiggle to the side
- Dash into corner -> pop up onto ledge
- Dash just under semi-solid -> pop up onto it
- Riding fast-moving platform -> added jump momentum is stored for a few frames
- Can wall-jump 2 pixels from the wall

# Art Tips
- Create independent "scenes" centered at the player even in a large world
- Block basic shapes/colors first
- Use a 50% grey canvas instead of white for better judgement of brightness
- Make better palettes by choosing a "base" color => put other color swatches on top => reduce opacity slightly to blend in some of the base color
