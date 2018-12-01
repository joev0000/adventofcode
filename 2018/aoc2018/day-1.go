package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"regexp"
)

func Map(vs []string, f func(string) int) []int {
	vsm := make([]int, len(vs))
	for i, v := range vs {
		vsm[i] = f(v)
	}
	return vsm
}

func parseToIntSlice(s string) []int {
	re := regexp.MustCompile(`[+-]\d+`)
	ss := re.FindAllString(s, -1)
	is := Map(ss, func(s string) int {
		var i int
		fmt.Sscanf(s, "%d", &i)
		return i
	})

	return is
}

/* Samples:
"+1\n-2\n+3\n+1" -> 3
"+1\n+1\n+1" -> 3
"+1\n+1\n-2" -> 0
"-1\n-2\n-3" -> -6
*/
func day1part1(in string) string {
	var acc int
	is := parseToIntSlice(in)

	for i := 0; i < len(is); i++ {
		acc += is[i]
	}
	return fmt.Sprint(acc)
}

/*
  Samples:
  "+1\n-1\n" -> 0
  "+3\n+3\n+4\n-2\n-4\n" -> 10
  "-6\n,+3\n,+8\n,+5\n+-6\n" -> 5
  "+7\n+7\n-2\n-7\n-4\n" -> 14
*/
func day1part2(in string) string {
	var acc int
	m := make(map[int]bool)
	m[0] = true
	is := parseToIntSlice(in)

	i := 0
	for {
		if i == len(is) {
			i = 0
		}

		acc += is[i]
		_, prs := m[acc]
		if prs {
			break
		} else {
			m[acc] = true
		}

		i++
	}
	return fmt.Sprint(acc)
}

func readFile(filename string) string {
	content, err := ioutil.ReadFile(filename)
	if err != nil {
		log.Fatal(err)
	}

	return string(content[:])
}
