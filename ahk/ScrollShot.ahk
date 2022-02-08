Sleep, 3000
MsgBox Starting program. Proceed to document.  F12 to Exit OK to Continue 
CoordMode, Pixel, Window

Loop{
gosub, checkpage
Gosub, detectpages
MsgBox 0,ScrollnShot, Document pages: %pages%, 2 
Msgbox 0,ScrollnShot,starting to shot document,1
TotalPages:=pages
gosub, doshots
}
ExitApp


checkpage:
Sleep, 200
ImageSearch, SomeVarX, SomeVarY, 0, 0, A_ScreenWidth, A_ScreenHeight, odin.png
if ErrorLevel = 2
    MsgBox Search failed F12 to exit
else if ErrorLevel = 1
{
MsgBox, 0, ScrollnShot, seeking for page 1.. trying to list ,2
Send {Home}
Sleep, 200
ImageSearch, SomeVarX, SomeVarY, 0, 0, A_ScreenWidth, A_ScreenHeight, odin.png
	if ErrorLevel
	{
	Msgbox, 0, ScrollnShot , No more pages found, 2
	Msgbox, 0, ScrollnShot , Thanks for watching and good bye, 2
	Run ..\shots
	Exit
	}
}
MsgBox,0, ScrollnShot , First page mark Found at %SomeVarX% %SomeVarY% ,2
Return


detectpages:
Sleep, 1000
Send ^d
Sleep, 2000

WinGetText, text , Document Properties
Loop, parse, text,`n
{
If (NextIsFileName=1)
	{
	xfname:=A_LoopField
	NextIsFileName:=0
	}
	
If (NextIsPageNum=1) 
	{
    xpages:=A_LoopField
    NextIsPageNum:=0
	}
If Instr(A_LoopField, "Number")
NextIsPageNum:=1
If Instr(A_LoopField, "File")
NextIsFileName:=1
If Instr(A_LoopField, "Size")
NextIsFileName:=0
}
fname:=StrReplace(xfname,`"","")
fname:=StrReplace(fname,".","x")
fname:=StrReplace(fname," ","x")
fname:=SubStr(fname,1,14)
pages:=StrReplace(xpages,`"","")
pages+=0
MsgBox ,0, ScrollnShot , File name Is %fname%  Pages: %pages%,3
sleep, 1500
ImageSearch, SomeVarX, SomeVarY, 500, 0, 1200, 500, cross.png
if ErrorLevel > 0
    MsgBox Search failed F12 to exit
sleep, 1000
Click Left %SomeVarX%, %SomeVarY%
sleep, 1000
SomeVarX+=50
SomeVarY+=50
Click Left %SomeVarX%, %SomeVarY%, 0
sleep, 1000
Return


F12::
ExitApp


doshots:
Send {Home}
Sleep,2500
Send ^+-
Sleep, 2500
Send ^l
Sleep, 4000
CurrentPage:=0
While CurrentPage<pages
{
CurrentPage+=1
Sleep,500
Run nircmd savescreenshot ..\shots\shot[%CurrentPage%]_[%fname%].bmp
sleep 800
Send {Right}
}
Sleep, 1500
Send ^l
Sleep,3500
Send ^++
Sleep,2500
Send ^w
Sleep,2500
return
