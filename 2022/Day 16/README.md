# Day 16

To begin, I found this problem particularly stimulating and worthwhile since it was the first time I dealt with what I later learnt being called a depth-first search algorithm. 

The final version of my code however, does not work with a DFS algorithm because I found another way which was faster than my DFS and allowed a resolution for Part 2 in a decent time.

# First ideas 

The first idea that came into my mind was to start from valve AA, then recursively go to interesting valves and decrement the remaining time at each step, decrementing by one or by two depending on wether or not we opened the current valve.

To find which valves were interesting, I tried multiple approaches. The most interesting one on my opinion was the following :

From a starting valve, go in each available direction. If we encouter a valve with a flow that is not null and that hasn't been opened yet, add this valve to the options.
Else, repeat this process from the current valve.

In the example this leads to the gray valves in the next figure if we start from the initial position :
![Figure 1](https://github.com/NuageTompis/Advent-of-Code/blob/main/2022/Day%2016/Explanation.jpg)

We make 2 recursions from each option : one where we open the valve and another where we don't.

I tried multiple variants to make this work more efficiently. For instance, in order to avoid paths including back-and-forth steps without opening a valve, I tried to use recursions and remember the unopened valves so that if we could open one but choose not to multiple times in a row, we would cut the recursion.
This idea allowed us to avoid useless back-and-forth. For example if valves B and C are still closed, if we go from B to C and don't open C, we would not make the recursion in which we would go to B because we could have opened it sooner.

I won't go into further details for my DFS because I wasn't satisfied by the computing time, but maybe it was mostly due to the data structure I chose.

# Ultimate idea

The ultimate idea I chose was a lot different from the previous. It involved listing the valves with non-zero flow, enumerating all the orders according to which we could go through each one and computing the flow liberated for each path.

Enumerating all orders essentially meant listing every permuation of the valves with non-zero flow.

The first issue I encountered what that there way too much permutation (~10^12 for my input). So I made only the meaningful permutations, meaning creating a path with less elements that the initial array but with each valve reachable in under 24 minutes. This was made with the Perms function. 
For instance, in the example, the valves with non-zero flow has values [13,2,20,3,22,21]. Since each value is unique (and this is very important), we can associate each one to its valve and create a path.

The best path for the example was [20,13,21,22,3,2] which corresponds to [DD,BB,JJ,HH,EE,CC]

To enumerate the permutations easily (again they were not exactly permutations but let's call them that way for simplicity) I created a distance matrix so that I only had to compute the distances once.

Once this was done I only had to compute the overall flow of each path and keep the best, this was done by going through each element of the path, converting it to its valve to find the distance to the next valve and update the flow at each step.

# Part 2

Thanks to Part 1 this became fairly easy since all that were left to do was to enumerate paths realizable in 26 minutes instead, and for each one filter the disjoined paths for the elephant to follow.

