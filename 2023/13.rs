use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

    // Retrieve patterns
    let mut patterns: Vec<Vec<Vec<bool>>> = Vec::new();
    let mut m: Vec<Vec<bool>> = Vec::new();
    for line in read_to_string("./input.txt").unwrap().lines() {
        if line.len() == 0 {
            patterns.push(m.clone());
            m = Vec::new();
            continue;
        }
        let mut row: Vec<bool> = Vec::new();
        for c in line.chars() {
            row.push(c == '#');
        }
        m.push(row);
    }
    patterns.push(m.clone());

    let mut sum = 0;
    for matrix in patterns {
        let mut ndx = 1;
        let n = matrix.len();
        let m = matrix[0].len();
        let mut valid;
        
        // Search for vertical reflection
        loop {
            valid = true;
            let len = min(ndx, m - ndx);
            if len == 0 {
                valid = false;
                break;
            }
            for j in 0..len {
                let j_1 = ndx - j - 1;
                let j_2 = ndx + j;
                for i in 0..n {
                    if matrix[i][j_1] ^ matrix[i][j_2] {
                        valid = false;
                        break;
                    }
                }

                if !valid {
                    break;
                }
            }

            if valid {
                break;
            }
            ndx += 1;
        }
        
        if valid {
            sum += ndx;
            continue;
        }

        // Search for horizontal reflection
        ndx = 1;
        loop {
            let mut valid = true;
            let len = ndx.min(n - ndx);
            for i in 0..len {
                let i_1 = ndx - i - 1;
                let i_2 = ndx + i;
                for j in 0..m {
                    if matrix[i_1][j] ^ matrix[i_2][j] {
                        valid = false;
                        break;
                    }
                }
            }
            if valid {
                break;
            }
            ndx += 1;
        }

        sum += 100 * ndx;
    }

    println!("{} in {:?}", sum, start_time.elapsed());
}

fn min(a: usize, b: usize) -> usize {
    if a < b { a } else { b }
}
