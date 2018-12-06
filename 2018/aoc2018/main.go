package main

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"os"
	"strings"
	"time"
)

type Part struct {
	samples map[string]string
	solve   func(in io.Reader) string
}

type Puzzle struct {
	input string
	parts [2]Part
}

func main() {
	fmt.Println("Advent of Code 2018: Go Edition")

	var puzzles []Puzzle

	puzzles = append(puzzles, day1())
	puzzles = append(puzzles, day2())
	puzzles = append(puzzles, day3())
	puzzles = append(puzzles, day4())
	puzzles = append(puzzles, day5())

	for day, puzzle := range puzzles {
		for partNum, part := range puzzle.parts {

			for sample, expected := range part.samples {
				actual := part.solve(strings.NewReader(sample))
				if actual != expected {
					log.Fatalf("Sample %#v failed: expected %#v but got %#v", sample, expected, actual)
				}
			}
			in, err := os.Open(puzzle.input)
			if err != nil {
				log.Fatal(err)
			}

			start := time.Now()
			answer := part.solve(in)
			nanos := time.Since(start).Nanoseconds()

			fmt.Printf("Day %d, part %d: %s (%dms)\n", day+1, partNum+1, answer, nanos/1000000)

			in.Close() // defer?
		}
	}
}

func lines(r io.Reader) []string {
	out := make([]string, 0)
	bufin := bufio.NewReader(r)
	line, err := bufin.ReadString('\n')
	for err == nil {
		line = line[:len(line)-1]
		out = append(out, line)
		line, err = bufin.ReadString('\n')
	}
	return out
}
