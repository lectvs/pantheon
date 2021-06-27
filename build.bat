@echo off

set NAME=ruse

set TIMESTAMP=%date:~10,4%%date:~7,2%%date:~4,2%%time:~0,2%%time:~3,2%%time:~6,2%
set GAMENAME=%NAME%
set SRCNAME=%NAME%-src

:: Game
7z a %GAMENAME%.zip bin -xr!*.pyxel -xr!*.flp -xr!*.xrns
move %GAMENAME%.zip build

:: Source code
7z a %SRCNAME%.zip .vscode
7z a %SRCNAME%.zip bin
7z a %SRCNAME%.zip def
7z a %SRCNAME%.zip drafts
7z a %SRCNAME%.zip lectvs
7z a %SRCNAME%.zip src
7z a %SRCNAME%.zip favicon.ico
7z a %SRCNAME%.zip README.md
7z a %SRCNAME%.zip tsconfig.json
7z a %SRCNAME%.zip tscw.bat
move %SRCNAME%.zip build

pause