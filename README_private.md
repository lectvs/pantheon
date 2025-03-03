# How To Add lectvs Submodule
- `git submodule add git@github.com:lectvs/pantheon.git`

# Cloning With lectvs Submodule
- After cloning this repo with `git clone git@github.com:lectvs/REPO.git`...
- `git submodule update --init --recursive`

# New Game Checklist
- Change game name and window title in `bin/index.html`

# Pre-Publish Checklist
- See GAME_TODO.md

# Publish Notes
- See GAME_TODO.md

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
https://www.youtube.com/watch?v=u2fwxuHZXIA
- Player jumps higher when moving faster
- Holding the jump button change player's gravity
- Acceleration is higher when changing direction
- Slopes change player max speed and acceleration
- Player has less friction while sliding, even on flat ground
- "P-speed" increases player's max speed
- Player doesn't slow down while in the air and not holding direction
- Mario actually "decelerates toward" his max speed if over it instead of clamping, resulting in his speed oscillating over time

# Art Tips
- Create independent "scenes" centered at the player even in a large world
- Block basic shapes/colors first
- Use a 50% grey canvas instead of white for better judgement of brightness
- Make better palettes by choosing a "base" color => put other color swatches on top => reduce opacity slightly to blend in some of the base color

# Random Tech
- Instead of hover tint dark -> highlight, add a two-part hover tint dark -> intermediary -> highlight (citizen sleeper scroll bar)
- Rotate everything (fools room)

# Refs
- Deluxe16 font: https://www.dafont.com/deluxe16.font
- VHS Gothic font: https://www.dafont.com/vhs-gothic.charmap