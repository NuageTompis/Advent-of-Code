use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

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
        
        // check vertically
        let mut wrongs;
        loop {
            wrongs = 0;
            let mut valid = true;
            let len = ndx.min(m - ndx);
            if len == 0 {
                break;
            }
            for j in 0..len {
                let j_1 = ndx - j - 1;
                let j_2 = ndx + j;
                for i in 0..n {
                    if matrix[i][j_1] ^ matrix[i][j_2] {
                        wrongs += 1;
                        if wrongs == 2 {
                            valid = false;
                            break;
                        }
                    }
                }
                if !valid {
                    break;
                }
            }
            if wrongs == 1 {
                break;
            }
            ndx += 1;
        }

        if wrongs == 1 {
            sum += ndx;
        }
        else {
            // check horizontally
            ndx = 1;
            let mut wrongs;
            loop {
                wrongs = 0;
                let mut valid = true;
                let len = ndx.min(n - ndx);
                for i in 0..len {
                    let i_1 = ndx - i - 1;
                    let i_2 = ndx + i;
                    for j in 0..m {
                        if matrix[i_1][j] ^ matrix[i_2][j] {
                            wrongs += 1;
                            if wrongs == 2 {
                                valid = false;
                                break;
                            }
                        }
                    }
                    if !valid {
                        break;
                    }
                }
                if wrongs == 1 {
                    break;
                }
                ndx += 1;
            }
            
           sum += 100 * ndx;
        }
    }

    println!("{} in {:?}", sum, start_time.elapsed());
}
