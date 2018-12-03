package main

import (
	"errors"
	"io"
	"log"
	"regexp"
	"strconv"
)

func day3() Puzzle {
	type Rectangle struct {
		top    int
		bottom int
		left   int
		right  int
	}

	type Claim struct {
		id   int
		rect Rectangle
	}

	type Point struct {
		x int
		y int
	}

	atoi := func(s string) int {
		i, err := strconv.Atoi(s)
		if err != nil {
			log.Fatal(err)
		}
		return i
	}

	parseClaims := func(in io.Reader) []Claim {
		var claims []Claim
		re := regexp.MustCompile(`#(\d+) @ (\d+),(\d+): (\d+)x(\d+)`)
		for _, line := range lines(in) {
			m := re.FindStringSubmatch(line)
			if m != nil {
				id := atoi(m[1])
				left := atoi(m[2])
				top := atoi(m[3])
				right := left + atoi(m[4]) - 1
				bottom := top + atoi(m[5]) - 1

				claim := Claim{id: id,
					rect: Rectangle{
						top:    top,
						bottom: bottom,
						left:   left,
						right:  right}}

				claims = append(claims, claim)
			}
		}
		return claims
	}

	min := func(a int, b int) int {
		if a < b {
			return a
		}
		return b
	}
	max := func(a int, b int) int {
		if a > b {
			return a
		}
		return b
	}

	intersection := func(a Rectangle, b Rectangle) (Rectangle, error) {
		var r Rectangle
		var err error
		top := max(a.top, b.top)
		bottom := min(a.bottom, b.bottom)
		left := max(a.left, b.left)
		right := min(a.right, b.right)
		if top <= bottom && left <= right {
			r = Rectangle{top: top, bottom: bottom, left: left, right: right}
		} else {
			err = errors.New("No intersection")
		}
		return r, err
	}

	overlappingClaims := make(map[int]struct{})

	samples1 := map[string]string{
		`#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2
`: "4",
	}
	part1 := func(in io.Reader) string {
		overlap := make(map[Point]struct{})
		claims := parseClaims(in)
		for i, claim1 := range claims {
			for _, claim2 := range claims[i+1:] {
				inter, err := intersection(claim1.rect, claim2.rect)
				if err == nil {
					overlappingClaims[claim1.id] = struct{}{}
					overlappingClaims[claim2.id] = struct{}{}
					for y := inter.top; y <= inter.bottom; y++ {
						for x := inter.left; x <= inter.right; x++ {
							overlap[Point{x, y}] = struct{}{}
						}
					}
				}
			}
		}
		return strconv.FormatInt(int64(len(overlap)), 10)
	}

	samples2 := map[string]string{}
	part2 := func(in io.Reader) string {
		for i := 1; i < len(overlappingClaims); i++ {
			_, ok := overlappingClaims[i]
			if !ok {
				return strconv.FormatInt(int64(i), 10)
			}
		}
		return "No overlapping claims"
	}
	return Puzzle{"data/day3.txt", [2]Part{Part{samples1, part1}, Part{samples2, part2}}}
}
