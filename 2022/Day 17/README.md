# Day 17

This problem was very amusing. For the first part, I simply did a simulation of the tower without any simplication.
For Part 2 however, this was impossible and further thought was in order.

To begin, I tried to simplify the tower when possible. A simplification may occur when a row in entirely filled. Here is an example : 

![Figure 1](https://github.com/NuageTompis/Advent-of-Code/blob/main/2022/Day%2017/Explanation1.png)

Here, we just added a '+' rock. From there, we can lower the tower and neglect the cells below the highest filled row.

But wait ! There is another way to simplify the tower (a simple one at least). An upcoming rock may fall on the newly added one, but they will never fall on the middle of the '+' rock since there is a cell above it and others next to it.

Considering all this, we can simplify the tower this way :

![Figure 2](https://github.com/NuageTompis/Advent-of-Code/blob/main/2022/Day%2017/Explanation2.png)

The previous methods will simplify our computations, but we can't simply make such a simulation and wait for 10^12 rocks to fall !
We need to find a cycle.

To do so, we will find equilibriums.
What I call an equilibrium is a series of rock that lead to the completion of the top of the tower.
Here is an example when adding a square rock :

![Figure 3](https://github.com/NuageTompis/Advent-of-Code/blob/main/2022/Day%2017/Explanation3.png)

This equilibrium isn't necessarely the end of a cycle since the following rock may be different from the initial one, and the next index in the pushing sequence (the puzzle input) may different from the initial one.

Thus, a cycle can be found by a series of such equilibriums which fulfills the following criteria :
  - The initial rock of the series is the same type as the one that will be generated right after the series ends
  - The initial sequence index is the same as the one that will be read right after the series ends

I call such a series an AlphaEquilibrium and there can only be a single one in the simulation.

To achieve the final calculations, we need to know the amount of rocks placed before the AlphaEquilibrium, and amount of rocks placed during a cycle. Let's call these numbers a and b.
The total amount of rocks, which is 10^12, is the sum of the following :
  - a
  - b times the amount of cycle made before reaching 10^12
  - The rocks fallen in the beginning of the next cycle to reach 10^12

Each number can be computed through euclidian division.
To retrieve the answer to the problem, we then need to know the height added during each phase and print their sum.
