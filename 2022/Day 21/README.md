# Day 21

For Part 2, I considered the two children of the monkey 'root'. I called them left and right.

In my input puzzle, only one of them depended on the value given by me (humn). I assumed this was the case for everyone. To simplify the explanations, let's say that right is always the constant child.
Also, the function linking left and humn had a derivative function with a constant sign.
This meant that when I increases humn, left would always increase or always decrease.

These two points made the problem much simpler. 
My goal was to find the humn value that would lead left to be equal to right. To do so, I first found an interval that necessarely included such a value.
What I did is that I computed the value of left if humn was equal to 0. Then I compared it to right.
I then repeated this process by comparing right to the value of left if humn was 2*k (with k>=0)

At some point I had an interval In=[0,2^n] (see picture) that included the wanted value of humn.

From there I used dichotomy to find a value of humn that satisfied right=left(humn)
