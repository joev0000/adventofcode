ECHO >> Setting CPU: 11/20, 28kW
SET CPU 11/20
SET CPU 56K

ECHO >> Disabling all devices
SET DZ DISABLE
SET RK DISABLE
SET RL DISABLE
SET HK DISABLE
SET RX DISABLE
SET RP DISABLE
SET RQ DISABLE
SET TM DISABLE
SET TQ DISABLE

ECHO >> Enabling High Speed Paper Tape Punch and Reader
SET PTP ENABLE
SET PTR ENABLE

ECHO >> Loading Paper Tape Bootstrap Loader @ 28kW
DEPOSIT 157744 016701
DEPOSIT 157746 000026
DEPOSIT 157750 012702
DEPOSIT 157752 000352
DEPOSIT 157754 005211
DEPOSIT 157756 105711
DEPOSIT 157760 100376
DEPOSIT 157762 116162
DEPOSIT 157764 000002
DEPOSIT 157766 157400
DEPOSIT 157770 005267
DEPOSIT 157772 177756
DEPOSIT 157774 000765
DEPOSIT 157776 177550
DEPOSIT SR 157744

ECHO >> Attaching Absolute Loader to Paper Tape Reader
ATTACH PTR DEC-11-L2PC-PO.ptap

ECHO >> Running bootstrap to load Absolute Loader
GO 157744

ECHO >> Attaching PAL-11A (8K) papertape
ATTACH PTR DEC-11-ASXA-PB.ptap

; Set up responses to PAL-11A initialization
EXPECT "*S " ECHO >> Setting PAL-11A options; SEND AFTER=20000,"H\r\n"; CONT
EXPECT "*B " SEND AFTER=20000,"H/E\r\n"; CONT
EXPECT "*L " SEND AFTER=20000,"H\r\n"; CONT
EXPECT "*T " SEND AFTER=20000,"H/3\r\n"; ATTACH PTR %1.pal; ECHO >> Running first pass; CONT
EXPECT " EOF ?" ECHO >> Attaching library tape; ATTACH PTR aoc-2019-lib.pal; SEND AFTER=20000,"\r\n"; CONT
EXPECT " EOF ?" ECHO >> Attaching end-of-program tape; ATTACH PTR aoc-2019-end.pal; SEND AFTER=20000,"\r\n"; CONT
EXPECT " END ?" ECHO >> Running second pass; ATTACH PTR %1.pal; ATTACH PTP -n %1.lda.ptap; SEND AFTER=20000,"\r\n"; CONT
EXPECT " EOF ?" ECHO >> Attaching library tape; ATTACH PTR aoc-2019-lib.pal; SEND AFTER=20000,"\r\n"; CONT
EXPECT " EOF ?" ECHO >> Attaching end-of-program tape; ATTACH PTR aoc-2019-end.pal; SEND AFTER=20000,"\r\n"; CONT
EXPECT " END ?" ECHO >> Running third pass; ATTACH PTR %1.pal; ATTACH PTP -n %1.out; SEND AFTER=20000,"\r\n"; CONT
EXPECT " EOF ?" ECHO >> Attaching library tape; ATTACH PTR aoc-2019-lib.pal; SEND AFTER=20000,"\r\n"; CONT
EXPECT " EOF ?" ECHO >> Attaching end-of-program tape; ATTACH PTR aoc-2019-end.pal; SEND AFTER=20000,"\r\n"; CONT
EXPECT "*S " ECHO >> Done.  Exiting; EXIT

ECHO >> Start Absolute Loader to Load and Run PAL-11A (8K) paper tape
DEPOSIT SR 157500
; Absolute loader occupies xx7474 through xx7743
; start address is xx7500
GO 157500

