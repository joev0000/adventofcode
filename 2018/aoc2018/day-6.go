package main

import (
	"io"
	"strconv"
	"strings"
)

func day6() Puzzle {
	type xy struct {
		x int
		y int
	}

	type info struct {
		closest  int
		distance int
		total    int
	}

	abs := func(a int) int {
		if a < 0 {
			return -a
		} else {
			return a
		}
	}

	manhattan := func(a xy, b xy) int {
		return abs(a.x-b.x) + abs(a.y-b.y)
	}

	sample := `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
`
	maxXY := func(xys []xy) (int, int) {
		maxX := xys[0].x
		maxY := xys[1].y
		for _, e := range xys[1:] {
			if e.x > maxX {
				maxX = e.x
			}
			if e.y > maxY {
				maxY = e.y
			}
		}
		return maxX, maxY
	}

	max := func(a []int) int {
		m := a[0]
		for _, e := range a[1:] {
			if e > m {
				m = e
			}
		}
		return m
	}

	parse := func(in io.Reader) []xy {
		ls := lines(in)
		xys := make([]xy, len(ls))
		for i, line := range ls {
			s := strings.Split(line, ",")
			x, _ := strconv.Atoi(strings.TrimSpace(s[0]))
			y, _ := strconv.Atoi(strings.TrimSpace(s[1]))
			xys[i] = xy{x, y}
		}
		return xys
	}
	/* This is truly awful. */
	tenKcount := 0
	sample1 := map[string]string{sample: "17"}
	part1 := func(in io.Reader) string {
		tenKcount = 0
		coords := parse(in)
		tally := make([]int, len(coords))
		maxX, maxY := maxXY(coords)

		for y := 0; y <= maxY; y++ {
			for x := 0; x <= maxX; x++ {
				total := 0
				distance := maxX + maxY + 1
				closest := 0
				for c, coord := range coords {
					md := manhattan(coord, xy{x, y})
					total += md
					if md == distance {
						closest = -1
					}
					if md < distance {
						closest = c
						distance = md
					}
				}
				if closest >= 0 && (x == 0 || x == maxX || y == 0 || y == maxY) {
					tally[closest] = -1
				}
				if closest >= 0 && tally[closest] >= 0 {
					tally[closest]++
				}
				if total < 10000 {
					tenKcount++
				}
			}
		}

		return strconv.Itoa(max(tally))
	}

	sample2 := map[string]string{}
	part2 := func(in io.Reader) string {
		return strconv.Itoa(tenKcount)
	}

	return Puzzle{"data/day6.txt", [2]Part{Part{sample1, part1}, Part{sample2, part2}}}
}
