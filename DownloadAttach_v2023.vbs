Option Explicit 
Dim fs,objTextFile,arrString,attach,attachEs,pos,pos2,arrStr,fName,fExt,dotpos
Dim fnameWithCode,eightDigCode,downloadLink

set fs=CreateObject("Scripting.FileSystemObject")
set objTextFile = fs.OpenTextFile("Backup.csv") '//define attach fields

set objTextFile = fs.OpenTextFile("Backup.csv")
Do while NOT objTextFile.AtEndOfStream
arrStr = split(objTextFile.ReadLine,",")
attachEs=Filter(arrStr,"https://v5.airtableusercontent.com")
    For each attach in attachEs
    pos=InStr(attach,"(https") '// extract filename
    fName=Trim(Left(attach,pos-1))
    dotpos=InStrRev(fName,".")
    fName=Replace(fName,Chr(34),"_") '// remove bad chare from fname
    fName=Replace(fName,"|","_")
    fExt=Right(fName,Len(fName)-dotpos+1)
    fName=Replace(Left(fName,dotpos),".","")
    pos2=InStrRev(attach,"/")
    eightDigCode=Mid(attach,pos2-8,8)
    fnameWithCode=fName&"("&eightDigCode&")"&fExt
    downloadLink=Mid(attach,pos+1,Len(attach)-pos-1)
    Call Download(fnameWithCode,downloadLink)
    Wscript.Sleep 1000
    Next
Loop

objTextFile.Close
set objTextFile = Nothing
set fs = Nothing

Sub Download(filename,link)
dim xHttp: Set xHttp = createobject("Microsoft.XMLHTTP")
dim bStrm: Set bStrm = createobject("Adodb.Stream")
xHttp.Open "GET", link, False
xHttp.Send

with bStrm
    .type = 1 '//binary
    .open
    .write xHttp.responseBody
    .savetofile filename, 2 '//overwrite
end with
End Sub

Sub deboog()
    Wscript.Echo("fName: "&fName)
    Wscript.Echo("fext: "&fExt)
    Wscript.Echo("eightDigCode: "&eightDigCode)
End Sub
