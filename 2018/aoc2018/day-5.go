package main

import (
	"io"
	"strconv"
)

func day5() Puzzle {
	opp := func(a rune, b rune) bool {
		diff := int(a) - int(b)
		return diff == 32 || diff == -32
	}

	sample := "dabAcCaCBAcCcaDA\n"

	samples1 := map[string]string{sample: "10"}
	react := func(in string, ignore rune) string {
		oppIgnore := ignore + 32
		polymer := []rune(in)

		old_length := len(polymer) + 1
		for len(polymer) < old_length {
			new_polymer := make([]rune, 0)
			old_length = len(polymer)

			for i := 0; i < old_length-1; i++ {
				if polymer[i] == ignore || polymer[i] == oppIgnore {
					continue
				}
				if opp(polymer[i], polymer[i+1]) {
					i++
				} else {
					new_polymer = append(new_polymer, polymer[i])
				}
			}
			if !opp(polymer[old_length-1], polymer[old_length-2]) && polymer[old_length-1] != ignore && polymer[old_length-1] != oppIgnore {
				new_polymer = append(new_polymer, polymer[old_length-1])
			}
			polymer = new_polymer
		}
		return string(polymer)
	}
	part1 := func(in io.Reader) string {
		s := lines(in)[0]
		return strconv.Itoa(len(react(s, '~')))
	}
	samples2 := map[string]string{sample: "4"}
	part2 := func(in io.Reader) string {
		polymer := lines(in)[0]
		smallest := len(polymer) + 1
		for r := 'A'; r <= 'Z'; r++ {
			p := react(polymer, r)
			if len(p) < smallest {
				smallest = len(p)
			}
		}
		return strconv.Itoa(smallest)
	}
	return Puzzle{"data/day5.txt", [2]Part{Part{samples1, part1}, Part{samples2, part2}}}
}
