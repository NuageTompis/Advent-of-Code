use std::time::Instant;
use std::fs::read_to_string;
use std::collections::HashMap;

fn main() {
    let start_time = Instant::now();
    let mut els: Vec<(i32, i32)> = Vec::new();

    let binding = read_to_string("./input.txt").unwrap();
    let l = binding.lines().nth(0).unwrap().len();
    
    let mut empty_cols: Vec<bool> = vec![true; l];
    let mut empty_lines = 0;
    for (i, line) in binding.lines().enumerate() {
        let mut line_empty = true;
        for (j, c) in line.chars().enumerate() {
            if c == '#' {
                els.push(((i + empty_lines) as i32, j as i32));
                line_empty = false;
                if empty_cols[j] {
                    empty_cols[j] = false;
                }
                
            }
        }
        if line_empty {
            empty_lines += 1;
        }
    }

    let mut true_j: HashMap<i32, i32> = HashMap::new();
    let mut shift = 0;
    for (j, b) in empty_cols.iter().enumerate() {
        if *b {
            shift += 1;
        } 
        true_j.insert(j as i32, j as i32 + shift);
    }

    for el in &mut els {
        el.1 = *true_j.get(&el.1).unwrap();
    }

    let mut sum = 0;
    for (i, el) in els.iter().enumerate() {
        for j in i+1..els.len() {
            let el_2 = els[j];
            sum += manhattan(*el, el_2);
        }
    }

    println!("{} in {:?}", sum, start_time.elapsed());
}

fn manhattan(a: (i32, i32), b: (i32, i32)) -> i32 {
    let delta = (b.0 - a.0, b.1 - a.1);
    if delta.0 < 0 {
        if delta.1 < 0 {
            -delta.0 -delta.1
        }
        else {
            delta.1 - delta.0

        }
    }
    else {
        if delta.1 < 0 {
            delta.0 - delta.1
        }
        else {
            delta.0 + delta.1
        }
    }
}
