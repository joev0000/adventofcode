package main

import (
	"io"
	"log"
	"regexp"
	"sort"
	"strconv"
)

func day4() Puzzle {
	type Nap struct {
		start int
		stop  int
	}

	guardRE := regexp.MustCompile(`#(\d+)`)
	wakeRE := regexp.MustCompile(`(\d\d)] w`)
	sleepRE := regexp.MustCompile(`(\d\d)] f`)
	parse := func(in io.Reader) map[int][]Nap {
		naps := make(map[int][]Nap)
		lines := lines(in)
		sort.Strings(lines)
		var current int
		var start int
		for _, line := range lines {
			match := guardRE.FindStringSubmatch(line)
			if match != nil {
				current, _ = strconv.Atoi(match[1])
			} else {
				match = sleepRE.FindStringSubmatch(line)
				if match != nil {
					start, _ = strconv.Atoi(match[1])
				} else {
					match = wakeRE.FindStringSubmatch(line)
					if match != nil {
						stop, _ := strconv.Atoi(match[1])

						napSlice, exists := naps[current]
						if !exists {
							napSlice = make([]Nap, 0)
							naps[current] = napSlice
						}
						naps[current] = append(napSlice, Nap{start: start, stop: stop})

					} else {
						log.Fatalf("Unexpected line %s\n", line)
					}
				}
			}
		}
		return naps
	}

	max := func(a []int) (int, int) {
		max := 0
		maxI := 0
		for i, n := range a {
			if a[i] > max {
				max = n
				maxI = i
			}
		}
		return max, maxI
	}

	samples1 := map[string]string{
		`[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up
`: "240"}
	part1 := func(in io.Reader) string {
		naps := parse(in)
		mostGuard := 0
		mostMinutes := 0
		for guard, napSlice := range naps {
			minutes := 0
			for _, n := range napSlice {
				minutes += n.stop - n.start
			}
			if minutes > mostMinutes {
				mostMinutes = minutes
				mostGuard = guard
			}
		}
		var minutes [60]int
		for _, n := range naps[mostGuard] {
			for i := n.start; i < n.stop; i++ {
				minutes[i] = minutes[i] + 1
			}
		}
		_, maxMinute := max(minutes[:])
		return strconv.Itoa(mostGuard * maxMinute)
	}

	samples2 := map[string]string{
		`[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up
`: "4455"}

	part2 := func(in io.Reader) string {
		napCount := make(map[int][]int)
		maxCount := 0
		maxGuard := 0
		maxMinute := 0
		for guard, naps := range parse(in) {
			napCount[guard] = make([]int, 60)
			for _, nap := range naps {
				for m := nap.start; m < nap.stop; m++ {
					count := napCount[guard][m] + 1
					if count > maxCount {
						maxCount = count
						maxGuard = guard
						maxMinute = m
					}
					minutes := napCount[guard]
					minutes[m] = count
				}
			}
		}
		return strconv.Itoa(maxGuard * maxMinute)
	}

	return Puzzle{"data/day4.txt", [2]Part{Part{samples1, part1}, Part{samples2, part2}}}
}
