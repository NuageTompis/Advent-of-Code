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

| Day | Done (both parts)    | Pushed               | Detailed               | Elegance of my approach | Benchmarks (*)       |
|-----|----------------------|----------------------|------------------------|-------------------------|--------------------- | 
| 1   | :white_check_mark:   |  :white_check_mark:  |    :x:                 |                         | `1.01ms` - `3.15ms`  |
| 2   | :white_check_mark:   |  :white_check_mark:  |    :x:                 |                         | `1.21ms` - `1.80ms`  |
| 3   | :white_check_mark:   |  :white_check_mark:  | :clock430:             |                         | `1.04ms` - `2.09ms`  |
| 4   | :white_check_mark:   |  :white_check_mark:  |    :x:                 |                         | `3.41ms` - `2.61ms`  |
| 5   | :white_check_mark:   |     :clock430:       | :clock430:             |                         |_requires improvement_|
| 6   | :white_check_mark:   |  :white_check_mark:  |[:white_check_mark:](#6)|        :star:           | `299µs` - `250µs`    |
| 7   | :white_check_mark:   |  :white_check_mark:  | :clock430:             |     :star:  :star:      |_requires improvement_|
| 8   | :white_check_mark:   |     :clock430:       | :clock430:             |                         |_requires improvement_|
| 9   | :white_check_mark:   |  :white_check_mark:  |    :x:                 |                         | `2.15ms` - `3.96ms`  |
| 10  | :white_check_mark:   |  :white_check_mark:  |[:white_check_mark:](#10)|     :star:  :star:      | `1.70ms` - `2.12ms`  |
| 11  | :white_check_mark:   |  :white_check_mark:  |    :x:                 |                         | `3.48ms` - `3.253ms` |
| 12  | :white_check_mark:   |     :clock430:       |                        |                         |                      |
| 13  | :white_check_mark:   | :white_check_mark:   |    :x:                 |                         | `1.06ms` - `899µs`   |
| 14  | :white_check_mark:   | :white_check_mark:   |    :x:                 |                         |  `714µs` - `733ms`   |
| 15  | :white_check_mark:   | :white_check_mark:   | :x:                 |                         |  `509µs` - `3.55ms`  |
| 16  |                      |                      |                        |                         |                      |
| 17  |                      |                      |                        |                         |                      |
| 18  |                      |                      |                        |                         |                      |
| 19  |                      |                      |                        |                         |                      |
| 20  |                      |                      |                        |                         |                      |
| 21  |                      |                      |                        |                         |                      |
| 22  |                      |                      |                        |                         |                      |
| 23  |                      |                      |                        |                         |                      |
| 24  |                      |                      |                        |                         |                      |
| 25  |                      |                      |                        |                         |                      |

 > Note (*) : Using a single computing time, with a Intel Core i7-13700H (1.8 - 2.4GHz), unoptimized (default rustc build).

<br><br>

<a id="6"></a>
## Day 6
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

[:leftwards_arrow_with_hook:](#progress)

<br><br>

<a id="10"></a>
## Day 10
<br>
 
I found this problem quite stimulating. After reading the question, I instantly thought that, once the loop was fully determined, there was a way to compute the amount of enclosed tiles without having to go through each element over again.
Turns out there was a way !

### Main idea
The general idea is to consider the loop as a polygon, find its area and substract the outer area, given by the number of elements of the loop. 

Consider the given example : 

![Zero](Images/10_0.png)

Which we will redraw as :

![One](Images/10_1.png)

Here the loop encapsulates a single tile, so the answer we're looking for is $1$. Let's consider each tile as a square of side $1$. The tiles of the loop hence describe a polygon $P$, as shown in yellow here :

![Two](Images/10_2.png)

We don't want to take into account the area taken by the tiles of the loop, so, since they each represent an area of $1$, we can just compute the area of $P$ and substract to it the amount of elements of the loop, right ?
Well, technically, yes, but actually we don't know the area of $P$, since what we _can_ have are the positions of the vertices of the polygon in dashed line, $P_-$, not $P$ itself.

### Area of a polygon
Also, how do we find the area of such polygon ? Well, for this we can use [the following formula](https://en.wikipedia.org/wiki/Polygon#Area), where $(x_i, y_i)$ are the vertices of the polygon, with $x_{n+1}=x_0$ and $y_{n+1}=y_0$ :

$$
A = \frac{1}{2}|\sum_{i=1}^{n} x_iy_{i+1}-y_ix_{i+1}|
$$

Which can be simplified, since $P_-$ has only $90$ degrees edges, to :

$$
A_{P_-} = |\sum_{i=1}^{\frac{n}{2}} x_{2i}y_{2i+1}-y_{2i}x_{2i+1}|
$$

Ok that's nice, but how do we get the area of $P$, $A_P$, from $A_{P_-}$ ?
Looking at the following image, what we can do this by summing the area of $P_-$ _(in green)_ with the  outside area of $P$ _(blue + green)_

<a name="P-and-P-minus"></a>
$P$ and $P_-$

![Three](Images/10_3.png)

To find the outside area in blue, let's consider the vertices of the polygon in dashed line, $P_-$. There are $2$ kinds of vertices, the  `outer` ones (pointing _outside_ of the polygon), and the `inner` ones (pointing _inside_). In the previous pictures there are $8$ outer vertices and $4$ inner ones. You can see that the tile of the outer vertices each account for an area of $\frac{3}{4}$ in blue whereas the inner ones only account for an area of $\frac{1}{4}$. The remaining tiles in the loop account for an area of $\frac{1}{2}$. 

And there you have it ! To find the area enclosed by the loop, compute the area of $P$ with $A_P = A_{P_-} + A_o$ _(where $A_o$ is the oustide area, in blue)_, and substract to it the amount of elements that constitute the loop.

We can express $A_o$ as follows, where $v_o$ is the amount of `outside` vertices of the loop, $v_i$ the amount of `inner` vertices, and $l$ is the number of loop elements :

$$
(*) : A_P = A_{P_-} + \frac{1}{4} [3v_o + v_i + 2(l - v_o - v_i)]
$$

### $v_o$ and $v_i$
To find $v_o$ and $v_i$, let's think about how we draw a _only-90 degrees_ polygon. For instance, when drawing a square, one can start with a vertical line _(Step 1)_, then make a right turn _(Step 2)_ and $2$ more right turns _(Steps 3 and 4)_ in order to complete the shape.

| Step 1                  | Step 2                    | Step 3                    | Step 4                    |
|-------------------------|---------------------------|---------------------------|---------------------------|
 ![Four](Images/10_4.png) | ![Five](Images/10_5.png)  | ![Six](Images/10_6.png)   | ![Seven](Images/10_7.png) |

If after _Step 3_, we instead dediced to turn left, we would have had to make $2$ more right turns to complete the shape, this would have looked a bit like so :

| Step 3                        | Step 4                    | Step 5                    | Step 6                    |
|-------------------------------|---------------------------|---------------------------|---------------------------|
 ![SixBis](Images/10_6_bis.png) | ![Eight](Images/10_8.png) | ![Nine](Images/10_9.png)  | ![Ten](Images/10_10.png) |

When drawing a polygon with only $90$ degrees edges, you can think of it as drawing a shape with a total of $360$ degrees, where a right turn gets you closer to your goal by $90$ degrees, and a left turn gets you $90$ degrees back _(assuming your first turn was right, otherwise it's the other way around)_

### Good and bad turns
With this in mind, there must be exactly $4$ "good" turns more than "bad" ones in order to complete the polygon. You can convice yourself that "good" turns represent the `outer` vertices, while "bad" turns represent the `inner` ones. So, to know which vertices are `outer` and which are `inner`, we can just count the number of left turns and right turns, whichever has the most is the "good" turn.

And ... that's it ! This is exactly what the script `10p2_v1.rs` inside `Former Versions` does. But yes, this is a former version, it turns out we can do slightly better.
Consider [$P$ and $P_-$](#P-and-P-minus) once again. We actually don't need $P$ at all, we can simply get the area of $P_-$ and substract the part of this area that corresponds to the loop tiles ! Contrary to earlier, the outer vertices account for $\frac{1}{4}$ of a unit whereas the inner ones account for $\frac{3}{4}$ of a unit.

Thus, the area we're looking for (the enclosed area) becomes :

$$
A_e = A_{p_-} - \frac{1}{4} [v_o + 3v_i + 2(l - v_o - v_i)]
$$  

If you've been paying close attention, you may remember that we formulated a [relation](#Good-and-bad-turns) between $v_o$ and $v_i$, which we can express as :

$$
v_o = v_i + 4
$$

This simplifies the equation $(*)$ to :

$$
A_e = A_{P_-} - \frac{l}{2} + 1
$$

Finally, the solution becomes :

$$
A_e = |\sum_{i=1}^{\frac{n}{2}} x_{2i}y_{2i+1}-y_{2i}x_{2i+1}| - \frac{l}{2} + 1
$$

 > l is the amount of tiles of the loop  
$(x_i, y_i)$ are the positions of the vertices of the loop

[:leftwards_arrow_with_hook:](#progress)

 <br><br>


:octocat:
