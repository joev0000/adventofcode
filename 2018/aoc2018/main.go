package main

import "fmt"

func main() {
	fmt.Println("Advent of Code 2018: Go Edition")

	fmt.Println("Day 1, part 1: ", day1part1(readFile("data/day1.txt")))
	fmt.Println("Day 1, part 2: ", day1part2(readFile("data/day1.txt")))
}
