# Advent of Code 2019: PDP-11
In honor of the PDP-11's 50th anniversary, I am going to attempt to solve
some Advent of Code 2019 problems using the tools available in 1970.  The
solutions can be run on a typical PDP-11 of the time:

* CPU
  * PDP-11/20, so no FP11, EIS, or CIS instructions
* Memory
  * 28 kilowords (56 kilobytes). No expenses spared here.
* Peripherals
  * PC11 Paper Tape Reader/Punch (or PR11 Reader)
  * KL11 Teletype Control (for the LT33 Model 33 ASR Teletype)

Solutions can be loaded into the PDP-11 using the Absolute Loader, and
run directly on the metal, without an operating system monitor.  Input
will be provided on a paper tape, and output will be printed to the
teleprinter.

## Using SimH

[SimH](https://github.com/simh/simh) is a software suite that simulates
many vintage computer systems, including the PDP-11.  It can be used
to run the PAL-11A assembler, as well as running the solution programs.
For those who want the full authentic 1970 experience without 1970 hardware
can even run the papertape version of the ED-11 editor and ODT-11 debugger.

### Loading Programs
Early PDP-11 systems did not have any ROM, and did not have boot disks to
load programs into the system.  (Later PDP-11s did have a boot system that
is more familiar to modern computer users.)  To run a program on a PDP-11,
you have to toggle in a bootstrap program using the switches on the
programmer's console.  This bootstrap program is just capable enough to
load a more complex program called the Aboslute Loader.  The Absolute Loader
is a program that can load user programs into memory.  The typical sequence
of actions is

1. Turn on the PDP-11.
1. Deposit the bootstrap program via the toggle switches.
1. Place the Absolute Loader tape in the high-speed tape reader.
1. Toggle the run switch to load in Aboslute Loader
1. Place the program you want to load into the tape reader.
1. Toggle the continue switch to load in the program
1. Deposit the start address of the program
1. Toggle the continue switch to run the program.
1. Watch the blinking lights.

You can see how this worked on a real PDP-11 (the PDP-11/10, a "low cost"
version of the PDP-11/20) in this [campy video](https://youtu.be/XV-7J5y1TQc?t=216).

This is a physically tedious process, but SimH allows all of this to be
scripted.  This repository includes a few SimH run scripts that make this
process easier.

The `assemble.do` script takes a base filename argument, and expects to find
a file with that name with a `.pal` extension.  The script toggles in the bootstrap 
code, loads the Absolute Loader, loads the PAL-11A assembler, attaches the `.pal` file
to the paper tape reader, and creates a file with the base name and an extension of `.lda.ptap`,
attaching to the a paper tape punch as its output.

The `run.do` script takes an argument which is the full path to a file that contains the 
contents of a paper tape that can be loaded by the Absolute Loader.  The script toggles in
the bootstrap code, loads the Absolute Loader, attaches the file to the paper tape reader, and loads the
program.  Control is returned to SimH, where you can attach a paper tape containing the
puzzle data (`ATTACH PTR day-1.txt`), and issue the `GO` command to run the program, typically
with `GO 1000`.

These scripts assume the Absolute Loader program (`DEC-11-L2PC-PO.ptap`) and
the PAL-11A assembler program (`DEC-11-ASXA-PB.ptap`) are in the current
directory.

## Useful Links
* [PDP-11 Handbook (1969)](http://gordonbell.azurewebsites.net/digital/pdp%2011%20handbook%201969.pdf)
* [DEC-11-XPTSA-A-D PDP-11 Paper Tape Software Programming Handbook (1973)](http://www.bitsavers.org/www.computer.museum.uq.edu.au/pdf/DEC-11-XPTSA-A-D%20PDP-11%20Paper%20Tape%20Software%20Programming%20Handbook.pdf)
* [PDP-11 Paper Tape System](http://iamvirtual.ca/PDP-11/PTS-11/PTS-11.htm)
* [SimH: History Simulator](https://github.com/simh/simh)
