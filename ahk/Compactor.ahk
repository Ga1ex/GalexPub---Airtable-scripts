Sleep, 3000
MsgBox Starting program. Run adobe and begin.  F12 to Exit OK to Continue 
CoordMode, Pixel, Window

Loop{
gosub, openfold
Gosub, savefile
gosub, doshots
}
ExitApp


openfold:
Sleep, 200
send !f
Sleep, 500
send r
Sleep, 500
send m
Sleep, 500
send {Enter}
Sleep, 1500
ImageSearch, SomeVarX, SomeVarY, 5, 5, 500, 500, folder2.png
if ErrorLevel > 0
    MsgBox folder Search failed
Sleep, 500
Click Left %SomeVarX%, %SomeVarY%
Sleep, 500
send {Del}
Sleep, 1500
Click Left %SomeVarX%, %SomeVarY%
send {Enter}
Sleep, 1500
send ^a
Sleep, 1500
send {Enter}
Sleep, 5000
ImageSearch, SomeVarX, SomeVarY, 500, 30, 1300, 900, combine.png
if ErrorLevel > 0
{
    MsgBox Search failed
	ExitApp, ErrorLevel
}
Click Left %SomeVarX%, %SomeVarY%
return	



savefile:
Sleep, 1000
Loop
{
Sleep, 2000
ImageSearch, SomeVarX, SomeVarY, 150, 30, 1000, 400, odin.png
if ErrorLevel = 2
    MsgBox Search failed
else if ErrorLevel = 0
Return
}


doshots:
Send ^s
Sleep,1000
ImageSearch, SomeVarX, SomeVarY, 200, 200, 1300, 900, pdfres.png
if ErrorLevel > 0
{
    MsgBox Search failed
	ExitApp, ErrorLevel
}
Click Left %SomeVarX%, %SomeVarY%
Sleep, 1000
Send !s
Sleep, 2500
Send ^w
Sleep, 2000
return

F12::
ExitApp, 0