

sleep, 1000
xfname:="1.7.3.11.4 FAO_Declaration_Interval_Ownership_Deeded.pdf"
fname:=StrReplace(xfname,".pdf","")
Run nircmd savescreenshot ..\shots\shot[%CurrentPage%]_.bmp
Run xcopy /I ..\shots\shot*.bmp ..\shots\"%fname%"\

F12::
ExitApp,0