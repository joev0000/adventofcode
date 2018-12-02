package main

import (
	"io"
	"io/ioutil"
	"log"
	"regexp"
	"strconv"
)

func day1() Puzzle {
	parseToIntSlice := func(s string) []int {
		re := regexp.MustCompile(`[+-]\d+`)
		ss := re.FindAllString(s, -1)

		is := make([]int, len(ss))
		for i, s := range ss {
			parsed, err := strconv.ParseInt(s, 10, 32)
			if err != nil {
				log.Fatal(err)
			}
			is[i] = int(parsed)
		}
		return is
	}

	samples1 := map[string]string{
		"+1\n-2\n+3\n+1\n": "3",
		"+1\n+1\n+1\n":     "3",
		"+1\n+1\n-2\n":     "0",
		"-1\n-2\n-3\n":     "-6",
	}
	part1 := func(in io.Reader) string {
		var acc int
		bytes, err := ioutil.ReadAll(in)
		if err != nil {
			log.Fatal(err)
		}

		is := parseToIntSlice(string(bytes[:]))

		for i := 0; i < len(is); i++ {
			acc += is[i]
		}
		return strconv.FormatInt(int64(acc), 10)
	}

	samples2 := map[string]string{
		"+1\n-1\n":                 "0",
		"+3\n+3\n+4\n-2\n-4\n":     "10",
		"-6\n,+3\n,+8\n,+5\n+-6\n": "5",
		"+7\n+7\n-2\n-7\n-4\n":     "14",
	}
	part2 := func(in io.Reader) string {
		var acc int
		bytes, err := ioutil.ReadAll(in)
		if err != nil {
			log.Fatal(err)
		}

		m := make(map[int]struct{})
		m[0] = struct{}{}
		is := parseToIntSlice(string(bytes[:]))

		i := 0
		for {
			if i == len(is) {
				i = 0
			}

			acc += is[i]
			if _, done := m[acc]; done {
				break
			} else {
				m[acc] = struct{}{}
			}

			i++
		}
		return strconv.FormatInt(int64(acc), 10)
	}

	return Puzzle{"data/day1.txt", [2]Part{Part{samples1, part1}, Part{samples2, part2}}}
}
