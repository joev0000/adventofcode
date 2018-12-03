package main

import (
	"bufio"
	"io"
	"strconv"
)

func day2() Puzzle {
	lines := func(in io.Reader) []string {
		out := make([]string, 0)
		bufin := bufio.NewReader(in)
		line, err := bufin.ReadString('\n')
		for err == nil {
			line = line[:len(line)-1]
			out = append(out, line)
			line, err = bufin.ReadString('\n')
		}
		return out
	}
	countLetters := func(s string) map[rune]int {
		out := make(map[rune]int)
		for _, b := range s {
			out[b] = out[b] + 1
		}
		return out
	}
	samples1 := map[string]string{
		`abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab
`: "12",
	}
	part1 := func(in io.Reader) string {
		twos := 0
		threes := 0
		for _, line := range lines(in) {
			alreadyCounted2 := false
			alreadyCounted3 := false
			for _, val := range countLetters(line) {
				if val == 2 && !alreadyCounted2 {
					alreadyCounted2 = true
					twos++
				}
				if val == 3 && !alreadyCounted3 {
					alreadyCounted3 = true
					threes++
				}
			}
		}
		return strconv.FormatInt(int64(twos*threes), 10)
	}

	samples2 := map[string]string{
		`abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz
`: "fgij"}
	part2 := func(in io.Reader) string {
		ls := lines(in)
		for i, line1 := range ls {
			for _, line2 := range ls[i+1:] {
				diffCount := 0
				diffIndex := 0
				for j := 0; j < len(line1); j++ {
					if line1[j] != line2[j] {
						diffCount++
						diffIndex = j
					}
				}
				if diffCount == 1 {
					return line1[:diffIndex] + line1[diffIndex+1:]
				}
			}
		}
		return ""
	}
	return Puzzle{"data/day2.txt", [2]Part{Part{samples1, part1}, Part{samples2, part2}}}
}
