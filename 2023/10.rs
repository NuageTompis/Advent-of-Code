use std::fs::read_to_string;

fn main() {
    let mut matrix: Vec<Vec<char>> = Vec::new();

    let mut loop_els: Vec<(i32, i32, char)> = Vec::new();
    let mut visited: Vec<(i32, i32)> = Vec::new();
    
    let mut ndx: (i32, i32) = (0, 0);

    for (i, line) in read_to_string("./input.txt").unwrap().lines().enumerate() {
        matrix.push(Vec::new());
        for (j, c) in line.chars().enumerate() {
            if c == 'S' {
                ndx = (i as i32, j as i32);
                loop_els.push((i as i32, j as i32, 'S'));
                visited.push(ndx);
            }
            matrix[i].push(c);
        }
    }
    
    let m = matrix[0].len();
    let from_j = (ndx.1 - 1).max(0);
    let to_j = (ndx.1 + 1).min(m as i32 - 1);

    for j in from_j..=to_j {
        let i = ndx.0;
        if j == ndx.1 {
            continue;
        }

        let orientation = pipe_orientation(matrix[i as usize][j as usize]);
        let dir_1 = cardinal_dir(orientation.0);
        let dir_2 = cardinal_dir(orientation.1);

        let delta = (i - ndx.0, j - ndx.1);

        let mut found = false;
        if delta == opposite(dir_1) {
            loop_els.push((i, j, orientation.0));
            found = true;
        } else if delta == opposite(dir_2) {
            loop_els.push((i, j, orientation.1));
            found = true;
        }
        
        if found {
            ndx = (i, j);
            visited.push((i, j));
            break;
        }
    }


    loop {
        let mut added = false;
        let mut new_ndx = (0, 0);

        let next_ndc = next_ndc(ndx, matrix[ndx.0 as usize][ndx.1 as usize]);
        if !visited.contains(&(next_ndc.0 .0, next_ndc.0 .1)) {
            visited.push((next_ndc.0 .0, next_ndc.0 .1));
            loop_els.push((next_ndc.0 .0, next_ndc.0 .1, matrix[next_ndc.0 .0 as usize][next_ndc.0 .1 as usize]));
            added = true;
            new_ndx = next_ndc.0;
        }
        else if !visited.contains(&(next_ndc.1 .0, next_ndc.1 .1)) {
            visited.push((next_ndc.1 .0, next_ndc.1 .1));
            loop_els.push((next_ndc.1 .0, next_ndc.1 .1, matrix[next_ndc.1 .0 as usize][next_ndc.1 .1 as usize]));
            added = true;
            new_ndx = next_ndc.1;
        }

        if added {
            ndx = new_ndx
        } else {
            println!("{}", loop_els.len() as i32 >> 1);
            break;
        }
    }
}

fn opposite(dir: (i32, i32)) -> (i32, i32) {
    (-dir.0, -dir.1)
}

fn cardinal_dir(dir: char) -> (i32, i32) {
    match dir {
        'N' => (-1, 0),
        'S' => (1, 0),
        'E' => (0, 1),
        'W' => (0, -1),
        _ => (0, 0),
    }
}

fn pipe_orientation(pipe: char) -> (char, char) {
    match pipe {
        '|' => ('N', 'S'),
        '-' => ('E', 'W'),
        'L' => ('N', 'E'),
        'J' => ('N', 'W'),
        '7' => ('S', 'W'),
        'F' => ('S', 'E'),
        _ => (' ', ' '),
    }
}

fn next_ndc(ndx: (i32, i32), pipe: char) -> ((i32, i32), (i32, i32)) {
    let orientation = pipe_orientation(pipe);
    let dir_1 = cardinal_dir(orientation.0);
    let dir_2 = cardinal_dir(orientation.1);

    return ((ndx.0 + dir_1.0, ndx.1 + dir_1.1), (ndx.0 + dir_2.0, ndx.1 + dir_2.1))
}
