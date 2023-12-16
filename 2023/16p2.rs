use std::fs::read_to_string;
use std::collections::HashMap;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

    let binding = read_to_string("./input.txt").unwrap();
    let lines = binding.lines();
    let mut matrix: Vec<Vec<char>> = Vec::new();

    let mut memo: HashMap<(usize, usize, usize), Vec<(usize, usize, usize)>> = HashMap::new(); // (i, j, dir)
    // dir : 0 = up, 1 = right, 2 = down, 3 = left

    for line in lines {
        let mut row: Vec<char> = Vec::new();
        for c in line.chars() {
            row.push(c);
        }
        matrix.push(row);
    }

    let mut max = 0;
    body(&mut memo, &matrix, 0, 0, 1);
    for start_i in 0..matrix.len() {
        // Go right from 0 to end on start_i
        memo.clear();
        let val = body(&mut memo, &matrix, start_i, 0, 1);
        if val > max {
            max = val;
        }
        // Go left from end to 0 on start_i
        memo.clear();
        let val = body(&mut memo, &matrix, start_i, matrix[0].len() - 1, 3);
        if val > max {
            max = val;
        }
    }
    for start_j in 0..matrix[0].len() {
        // Go down from 0 to end on start_j
        memo.clear();
        let val = body(&mut memo, &matrix, 0, start_j, 2);
        if val > max {
            max = val;
        }
        // Go up from end to 0 on start_j
        memo.clear();
        let val = body(&mut memo, &matrix, matrix.len() - 1, start_j, 0);
        if val > max {
            max = val;
        }
    }
    // later use the memo and create a new hashmap for the visited !

    println!("{} in {:?}", max, start_time.elapsed());

}

fn body(memo: &mut HashMap<(usize, usize, usize), Vec<(usize, usize, usize)>>, matrix: &Vec<Vec<char>>, i_start: usize, j_start: usize, dir_start: usize) -> u32 {
    let mut beams: Vec<(usize, usize, usize)> = vec![(i_start, j_start, dir_start)];

    loop {
        let mut new_beams: Vec<(usize, usize, usize)> = Vec::new();
        for beam in beams {
            if memo.contains_key(&beam) {
                continue;
            }
            let (i, j, dir) = beam;
            let pipe = matrix[i as usize][j as usize];
            let mut states: Vec<(usize, usize, usize)> = Vec::new();
            
            match pipe {
                '|' => {
                    let mut jump = false;
                    for d in 0..4 {
                        if d != dir && memo.contains_key(&(i, j, d)) {
                            jump = true;
                            break;
                        }
                    }
                    if jump {
                        continue;
                    }
    
                    if dir == 1 || dir == 3 {
                        if i != 0 {
                            let mut found = false;
                            for i_2 in (0..=i-1).rev() {
                                let pipe_2 = matrix[i_2][j];
                                if pipe_2 != '.' {
                                    let state = (i_2, j, 0);
                                    states.push(state);
                                    found = true;
                                    break;
                                }
                            }
                            if !found {
                                states.push((0, j, 0));
                            }
                    }
                        if i != matrix.len() as usize - 1 {
                            let mut found = false;
                            for i_2 in i+1..matrix.len() { 
                                let pipe_2 = matrix[i_2][j];
                                if pipe_2 != '.'  {
                                    let state = (i_2, j, 2);
                                    states.push(state);
                                    found = true;
                                    break;

                                }
                            }
                            if !found {
                                states.push((matrix.len() - 1, j, 2))
                            }
                        }
                    }
                    if dir == 0 && i != 0 {
                        let mut found = false;
                        for i_2 in (0..=i-1).rev() {
                            let pipe_2 = matrix[i_2][j];
                            if pipe_2 != '.'  {
                                let state = (i_2, j, 0);
                                        states.push(state);
                                        found = true;
                                        break;
    
                            }
                        }
                        if !found {
                            states.push((0, j, 0));
                        }
                    }
                    if dir == 2 && i != matrix.len() as usize - 1 {
                        let mut found = false;
                        for i_2 in i+1..matrix.len() { 
                            let pipe_2 = matrix[i_2][j];
                            if pipe_2 != '.'  {
                                let state = (i_2, j, 2);
                                        states.push(state);
                                        found = true;
                                        break;
    
                            }
                        }
                        if !found {
                            states.push((matrix.len() - 1, j, 2))    
                        }
                    }
                },
                '-' => {
                    let mut jump = false;
                    for d in 0..4 {
                        if d != dir && memo.contains_key(&(i, j, d)) {
                            jump = true;
                            break;
                        }
                    }
                    if jump {
                        continue;
                    }

                    if dir == 0 || dir == 2 {
                        if j != 0 {
                            let mut found = false;
                            for j_2 in (0..=j-1).rev() {
                                let pipe_2 = matrix[i][j_2];
                                if pipe_2 != '.'  {
                                    let state = (i, j_2, 3);
                                    states.push(state);
                                    found = true;
                                    break;

                                }
                            }
                            if !found {
                                states.push((i, 0, 3));
                            }
                        }
                        if j != matrix[0].len() as usize - 1 {
                            let mut found = false;
                            for j_2 in j+1..matrix[0].len() { 
                                let pipe_2 = matrix[i][j_2];
                                if pipe_2 != '.'  {
                                    let state = (i, j_2, 1);
                                    states.push(state);
                                    found = true;
                                    break;

                                }
                            }
                            if !found {
                                states.push((i, matrix[0].len() - 1, 1))
                            }
                        }
                    }
                    if dir == 3 && j != 0 {
                        let mut found = false;
                        for j_2 in (0..=j-1).rev() {
                            let pipe_2 = matrix[i][j_2];
                            if pipe_2 != '.'  {
                                let state = (i, j_2, 3);
                                        states.push(state);
                                        found = true;
                                        break;
    
                            }
                        }
                        if !found {
                            states.push((i, 0, 3)); 
                        }
                    }
                    if dir == 1 && j != matrix[0].len() as usize - 1 {
                        let mut found = false;
                        for j_2 in j+1..matrix[0].len() { 
                            let pipe_2 = matrix[i][j_2];
                            if pipe_2 != '.'  {
                                let state = (i, j_2, 1);
                                        states.push(state);
                                        found = true;
                                        break;
    
                            }
                        }
                        if !found {
                            states.push((i, matrix[0].len() - 1, 1));
                        }
                    }
                },
                '/' => {
                    match dir {
                        0 => {
                            if j != matrix[0].len() as usize - 1 {
                                let mut found = false;
                                for j_2 in j+1..matrix[0].len() { 
                                    let pipe_2 = matrix[i][j_2];
                                    if pipe_2 != '.'  {
                                        let state = (i, j_2, 1);
                                    states.push(state);
                                    found = true;
                                    break;

                                    }
                                }
                                if !found {
                                    states.push((i, matrix[0].len() - 1, 1));
                                }
                            }
                        },
                        1 => {
                            if i != 0 {
                                let mut found = false;
                                for i_2 in (0..=i-1).rev() {
                                    let pipe_2 = matrix[i_2][j];
                                    if pipe_2 != '.'  {
                                        let state = (i_2, j, 0);
                                    states.push(state);
                                    found = true;
                                    break;

                                    }
                                }
                                if !found {
                                    states.push((0, j, 0))
                                }
                            }
                        },
                        2 => {
                            if j != 0 {
                                let mut found = false;
                                for j_2 in (0..=j-1).rev() {
                                    let pipe_2 = matrix[i][j_2];
                                    if pipe_2 != '.'  {
                                        let state = (i, j_2, 3);
                                    states.push(state);
                                    found = true;
                                    break;

                                    }
                                }
                                if !found {
                                    states.push((i, 0, 3));
                                }
                            }
                        },
                        3 => {
                            if i != matrix.len() as usize - 1 {
                                let mut found = false;
                                for i_2 in i+1..matrix.len() { 
                                    let pipe_2 = matrix[i_2][j];
                                    if pipe_2 != '.'  {
                                        let state = (i_2, j, 2);
                                    states.push(state);
                                    found = true;
                                    break;

                                    }
                                }
                                if !found {
                                    states.push((matrix.len() - 1, j, 2))
                                }
                            }
                        },
                        _ => {
                            panic!("Invalid dir");
                        }
                    }
                },
                '\\' => {
                    match dir {
                        0 => {
                            if j != 0 {
                                let mut found = false;
                                for j_2 in (0..=j-1).rev() {
                                    let pipe_2 = matrix[i][j_2];
                                    if pipe_2 != '.'  {
                                        let state = (i, j_2, 3);
                                    states.push(state);
                                    found = true;
                                    break;

                                    }
                                }
                                if !found {
                                    states.push((i, 0, 3));
                                }
                            }
                        },
                        1 => {
                            if i != matrix.len() as usize - 1 {
                                let mut found = false;
                                for i_2 in i+1..matrix.len() { 
                                    let pipe_2 = matrix[i_2][j];
                                    if pipe_2 != '.'  {
                                        let state = (i_2, j, 2);
                                    states.push(state);
                                    found = true;
                                    break;

                                    }
                                }
                                if !found {
                                    states.push((matrix.len() - 1, j, 2))
                                }
                            }
                        },
                        2 => {
                            if j != matrix[0].len() as usize - 1 {
                                let mut found = false;
                                for j_2 in j+1..matrix[0].len() { 
                                    let pipe_2 = matrix[i][j_2];
                                    if pipe_2 != '.'  {
                                        let state = (i, j_2, 1);
                                    states.push(state);
                                    found = true;
                                    break;

                                    }
                                }
                                if !found {
                                    states.push((i, matrix[0].len() - 1, 1))
                                }
                            }
                        },
                        3 => {
                            if i != 0 {
                                let mut found = false;
                                for i_2 in (0..=i-1).rev() {
                                    let pipe_2 = matrix[i_2][j];
                                    if pipe_2 != '.'  {
                                        let state = (i_2, j, 0);
                                    states.push(state);
                                    found = true;
                                    break;

                                    }
                                }
                                if !found {
                                    states.push((0, j, 0));
                                }
                            }
                        },
                        _ => {
                            panic!("Invalid dir");
                        }
                    }
                },
                '.' => { // only posib for starting pos
                    match dir {
                        0 => {
                            if i != 0 {
                                let mut found = false;
                                for i_2 in (0..=i-1).rev() {
                                    let pipe_2 = matrix[i_2][j];
                                    if pipe_2 != '.'  {
                                        let state = (i_2, j, 0);
                                        states.push(state);
                                        found = true;
                                        break;
    
                                    }
                                }
                                if !found {
                                    states.push((0, j, 0));
                                }
                            }
                        },
                        1 => {
                            if j != matrix[0].len() as usize - 1 {
                                let mut found = false;
                                for j_2 in j+1..matrix[0].len() { 
                                    let pipe_2 = matrix[i][j_2];
                                    if pipe_2 != '.'  {
                                        let state = (i, j_2, 1);
                                        states.push(state);
                                        found = true;
                                        break;
    
                                    }
                                }
                                if !found {
                                    states.push((i, matrix[0].len() - 1, 1))
                                }
                            }
                        },
                        2 => {
                            if i != matrix.len() as usize - 1 {
                                let mut found = false;
                                for i_2 in i+1..matrix.len() { 
                                    let pipe_2 = matrix[i_2][j];
                                    if pipe_2 != '.'  {
                                        let state = (i_2, j, 2);
                                        states.push(state);
                                        found = true;
                                        break;
    
                                    }
                                }
                                if !found {
                                    states.push((matrix.len() - 1, j, 2))
                                }
                            }
                        },
                        3 => {
                            if j != 0 {
                                let mut found = false;
                                for j_2 in (0..=j-1).rev() {
                                    let pipe_2 = matrix[i][j_2];
                                    if pipe_2 != '.'  {
                                        let state = (i, j_2, 3);
                                        states.push(state);
                                        found = true;
                                        break;
    
                                    }
                                }
                                if !found {
                                    states.push((i, 0, 3));
                                }
                            }
                        },
                        _ => {
                            panic!("Invalid dir");
                        
                        }
                    }
                },
                _ => { 
                    panic!("Invalid pipe");
                }
                
            }

            memo.insert((i, j, dir), states.clone());
            for state in states {
                new_beams.push(state)
            }
        }

        beams = new_beams.clone();
        if beams.len() == 0 {
            break;
        }
    }

    let mut hozir_segments: Vec<Vec<(usize, usize)>> = vec![Vec::new(); matrix.len()];
    let mut verti_segments: Vec<Vec<(usize, usize)>> = vec![Vec::new(); matrix[0].len()];

    // Gather segments
    for (k, v) in memo {
        for (i, j, _) in v {
            if k.0 == *i {
                if k.1 < *j {
                    hozir_segments[k.0].push((k.1, *j));
                }
                else {
                    hozir_segments[k.0].push((*j, k.1));
                }
            }
            else if k.1 == *j {
                if k.0 < *i {
                    verti_segments[k.1].push((k.0, *i));
                }
                else {
                    verti_segments[k.1].push((*i, k.0));
                }
            }
            else {
                panic!("Invalid memo");
            }
        }
    }

    // Merge segments
    // Sort segments
    for line in &mut hozir_segments {
        line.sort();
    }
    for col in &mut verti_segments {
        col.sort();
    }

    // Merge segments
    for lines in &mut hozir_segments {
        let mut l = lines.len();
        if l == 0 {
            continue;
        }
        let mut i = 0;
        while i < l - 1 {
            let j = i + 1;
            while j < l {
                if lines[i].1 >= lines[j].0 {
                    lines[i].1 = lines[j].1;
                    lines.remove(j);
                    l -= 1;
                }
                else {
                    break;
                }
            }
            i += 1;
        }
    }
    for cols in &mut verti_segments {
        let mut l = cols.len();
        if l == 0 {
            continue;
        }
        let mut i = 0;
        while i < l - 1 {
            let j = i + 1;
            while j < l {
                if cols[i].1 >= cols[j].0 {
                    cols[i].1 = cols[j].1;
                    cols.remove(j);
                    l -= 1;
                }
                else {
                    break;
                }
            }
            i += 1;
        }
    }

    let mut sum = 0;
    // Add horizontal lines
    for line in &hozir_segments {
        for (i, j) in line {
            sum += j - i + 1;
        }
    }
    // Add vertical columns and substract intersections
    for (j, col) in verti_segments.iter().enumerate() {
        for (i, k) in col {
            for i_2 in *i..=*k {
                for horiz in &hozir_segments[i_2] {
                    if horiz.0 <= j && horiz.1 >= j {
                        sum -= 1;
                    }
                }
            }
            sum += k - i + 1;
        }
    }

    return sum as u32;
}