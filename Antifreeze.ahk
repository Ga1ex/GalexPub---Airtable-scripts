#Requires AutoHotkey v2.0  
;Galex 2025 code by GPT5

global running := true

F12:: running := false  ; Stop the loop when F12 is pressed

; Main loop
Loop {
    if (!running) 
        break

    ; Pause between 2-3 seconds
    Sleep Random(2000, 3000)

    ; Get current position
    MouseGetPos &x, &y

    ; Target position slightly shifted randomly
    tx := x + Random(-50, 50)
    ty := y + Random(-50, 50)

    ; Duration 1-2 sec
    dur := Random(1000, 2000)
    steps := 30
    stepDelay := dur // steps

    Loop steps {
        ; Add some "wiggle" to path
        fx := x + ((tx - x) * A_Index / steps) + Random(-5, 5)
        fy := y + ((ty - y) * A_Index / steps) + Random(-5, 5)

        MouseMove fx, fy, 0
        Sleep stepDelay
    }
}


