# **Hello there! :wave:**

Here are my solutions for the AoC 2023 problems. I've opted for Rust :crab: this time,  an intriguing language I'm just starting to get familiar with.

<details>
<summary>Usage</summary>
<br>
 
 > Note : Intended for Windows machines

- _Paste your input inside_ ***input.txt***
- Run: ```make run n``` for day n, part 1, or ```make run np2``` for part 2.
  
> Use ```make clear``` if you wish to delete the generated executables

</details>



# Progress

| Day | Done (both parts)    | Pushed               | Detailed         | Elegance of my approach | Benchmarks (*)       |
|-----|----------------------|----------------------|------------------|-------------------------|--------------------- | 
| 1   | :white_check_mark:   |  :white_check_mark:  |    :x:           |                         | `1.01ms` - `3.15ms`  |
| 2   | :white_check_mark:   |  :white_check_mark:  |    :x:           |                         | `1.21ms` - `1.80ms`  |
| 3   | :white_check_mark:   |  :white_check_mark:  | :clock430:       |                         | `1.04ms` - `2.09ms`  |
| 4   | :white_check_mark:   |  :white_check_mark:  |    :x:           |                         | `3.41ms` - `2.61ms`  |
| 5   | :white_check_mark:   |     :clock430:       | :clock430:       |                         |_requires improvement_|
| 6   | :white_check_mark:   |  :white_check_mark:  |[:white_check_mark:](6)|        :star:           | `299µs` - `250µs`    |
| 7   | :white_check_mark:   |  :white_check_mark:  | :clock430:       |     :star:  :star:      |_requires improvement_|
| 8   | :white_check_mark:   |     :clock430:       | :clock430:       |                         |_requires improvement_|
| 9   | :white_check_mark:   |  :white_check_mark:  |    :x:           |                         | `2.15ms` - `3.96ms   |
| 10  | :white_check_mark:   |     :clock430:       | :clock430:       |     :star:  :star:      |_requires improvement_|
| 11  | :white_check_mark:   |  :white_check_mark:  |    :x:           |                         | `3.48ms` - `3.253ms` |
| 12  |                      |                      |                  |                         |                      |
| 13  |                      |                      |                  |                         |                      |
| 14  |                      |                      |                  |                         |                      |
| 15  |                      |                      |                  |                         |                      |
| 16  |                      |                      |                  |                         |                      |
| 17  |                      |                      |                  |                         |                      |
| 18  |                      |                      |                  |                         |                      |
| 19  |                      |                      |                  |                         |                      |
| 20  |                      |                      |                  |                         |                      |
| 21  |                      |                      |                  |                         |                      |
| 22  |                      |                      |                  |                         |                      |
| 23  |                      |                      |                  |                         |                      |
| 24  |                      |                      |                  |                         |                      |
| 25  |                      |                      |                  |                         |                      |

 > Note (*) : Using a single computing time, with a Intel Core i7-13700H (1.8 - 2.4GHz)

<br>

<details>
<summary id="6">Day 6</summary>
<br>
 
To determine the number of ways to win a race, we consider the score $s_k$ achieved by pressing the button for $k$ milliseconds. This score is calculated by multiplying the duration the button is pressed $k$ by the remaining time $T - k$, where $T$ is the total race duration.

Mathematically, this is expressed as ${s_k} = k(T - k)$ for $k$ in { ${0, 1, \dots, T}$ }.

The objective is to find the number of possible values of $k$ for which $s_k > R$, where $R$ is the race record. This leads to the inequality:

$k^2 - T k + R < 0$

The corresponding quadratic equation is $k^2 - T k + R = 0$, with a determinant $\Delta = \sqrt{T^2 - 4R}$.

If $T^2 - 4R \leq 0$, then the inequality has no solution. However, if $T^2 - 4R > 0$, two solutions $x_+$ and $x_-$ are obtained:

$x_{\pm} = \frac{T \pm \sqrt{\Delta}}{2}$

The solution to the problem is then the count of integers within the range $[x_-, x_+]$ (inclusive and limited to the interval $[0, T]$). This is because the function $f(k) = k^2 - T k + R$ defines an upward-oriented parabolic curve, and we seek the portion below zero.

To find the solution, we calculate $\lceil x_+ \rceil - \lfloor x_- \rfloor + 1.$


</details>

<br>

:octocat:
