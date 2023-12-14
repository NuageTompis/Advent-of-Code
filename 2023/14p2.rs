use std::fs::read_to_string;
use std::collections::HashMap;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();
    
    let mut memo: HashMap<Vec<(u32, u32)>, (u32, Vec<(u32, u32)>)> = HashMap::new();
    let binding = read_to_string("./input.txt").unwrap();
    let lines = binding.lines();
    let n = lines.clone().count(); // lines
    let m = lines.clone().nth(0).unwrap().len(); // cols
    let mut rock_ndc_col: Vec<Vec<u32>> = Vec::new();
    let mut rock_ndc_line: Vec<Vec<u32>> = Vec::new();

    for _ in 0..m {
        let col = Vec::new();
        rock_ndc_col.push(col);
    }
    for _ in 0..n {
        let line = Vec::new();
        rock_ndc_line.push(line);
    }
    
    let mut rounded: Vec<(u32, u32)> = Vec::new();
    let mut amt = 0; // amount of rounded rocks
    for (i, line) in lines.clone().enumerate() {
        for (j, c) in line.chars().enumerate() {
            if c == 'O' {
                amt += 1;
                rounded.push((i as u32 + 1, j as u32 + 1));
            }
            if c == '#' {
                rock_ndc_col[j].push(i as u32 + 1);
                rock_ndc_line[i].push(j as u32 + 1);
            }
        }
    }

    let mut col_ndc: Vec<Vec<u32>> = Vec::new();
    for _ in 0..m {
        let col = Vec::new();
        col_ndc.push(col);
    }

    let loop_enter: u32;
    let loop_len: u32;

    let mut new_rounded: Vec<(u32, u32)>;
    let mut new_cubes_ndc: Vec<u32>;
    let mut cycle_loads: Vec<u32> = Vec::new();
    let mut c = 0;
    loop {
        if let Some(&ref result) = memo.get(&rounded) {
            loop_enter = result.0;
            loop_len = c - result.0;
            break;
        }
        let initial_rounded = rounded.clone();
        
        // North
        new_rounded = Vec::new();
        new_cubes_ndc = vec![0;m];
        for rock in rounded {
            let (i, j) = rock;
            let j_ndx = j as usize - 1;
            for ndx in 0..rock_ndc_col[j_ndx].len() {
                if rock_ndc_col[j_ndx][ndx] < i && rock_ndc_col[j_ndx][ndx] > new_cubes_ndc[j_ndx]{
                    new_cubes_ndc[j_ndx] = rock_ndc_col[j_ndx][ndx];
                }
                else if rock_ndc_col[j_ndx][ndx] > i {
                    break;
                }
            }

            new_cubes_ndc[j_ndx] += 1;
            new_rounded.push((new_cubes_ndc[j_ndx] as u32, j));
        }

        // West 
        rounded = new_rounded.clone();
        rounded.sort_by(|a, b| a.1.cmp(&b.1));
        new_rounded = Vec::new();
        new_cubes_ndc = vec![0;n];
        for rock in rounded {
            let (i, j) = rock;
            let i_ndx = i as usize - 1;
            for ndx in 0..rock_ndc_line[i_ndx].len() {
                if rock_ndc_line[i_ndx][ndx] < j && rock_ndc_line[i_ndx][ndx] > new_cubes_ndc[i_ndx] {
                    new_cubes_ndc[i_ndx] = rock_ndc_line[i_ndx][ndx];
                }
                else if rock_ndc_line[i_ndx][ndx] > j {
                    break;
                }
            }
            
            new_cubes_ndc[i_ndx] += 1;
            new_rounded.push((i, new_cubes_ndc[i_ndx] as u32));
        }

        // South
        rounded = new_rounded.clone();
        rounded.sort_by(|a, b| b.0.cmp(&a.0));
        new_rounded = Vec::new();
        new_cubes_ndc = vec![m as u32 + 1;m];
        for rock in rounded {
            let (i, j) = rock;
            let j_ndx = j as usize - 1;
            let len = rock_ndc_col[j_ndx].len();
            if len != 0 {
                for ndx in (0..rock_ndc_col[j_ndx].len()).rev() {
                    if rock_ndc_col[j_ndx][ndx] < new_cubes_ndc[j_ndx] && rock_ndc_col[j_ndx][ndx] > i {
                        new_cubes_ndc[j_ndx] = rock_ndc_col[j_ndx][ndx];
                    }
                    else if rock_ndc_col[j_ndx][ndx] < i {
                        break;
                    }
                }
            }

            new_cubes_ndc[j_ndx] -= 1;
            new_rounded.push((new_cubes_ndc[j_ndx] as u32, j));
        }

        // East
        rounded = new_rounded.clone();
        rounded.sort_by(|a, b| b.1.cmp(&a.1));
        new_rounded = Vec::new();
        new_cubes_ndc = vec![n as u32 + 1;n];
        for rock in rounded {
            let (i, j) = rock;
            let i_ndx = i as usize - 1;
            let len = rock_ndc_line[i_ndx].len();
            if len != 0 {
                for ndx in (0..rock_ndc_line[i_ndx].len()).rev() {
                    if rock_ndc_line[i_ndx][ndx] < new_cubes_ndc[i_ndx] && rock_ndc_line[i_ndx][ndx] > j {
                        new_cubes_ndc[i_ndx] = rock_ndc_line[i_ndx][ndx];
                    }
                    else if rock_ndc_line[i_ndx][ndx] < j {
                        break;
                    }
                }
            }
            
            new_cubes_ndc[i_ndx] -= 1;
            new_rounded.push((i, new_cubes_ndc[i_ndx] as u32));
        }

        rounded = new_rounded.clone();
        rounded.sort_by(|a, b| b.0.cmp(&a.0));
        rounded.sort_by(|a, b| a.0.cmp(&b.0));
        memo.insert(initial_rounded, (c, rounded.clone()));

        let mut sum = 0;
        for i in 0..amt {
            sum += n as i32 + 1 - new_rounded[i].0 as i32;
        }
        cycle_loads.push(sum as u32);
        c += 1;
    }

    let rest = (1000000000 - 1 - loop_enter) % loop_len;
    println!("{} in {:?}", cycle_loads[(loop_enter + rest) as usize], start_time.elapsed());
}