use std::time::Instant;
use std::fs::read_to_string;

fn main() {
    let start_time = Instant::now();
    
    let mut matrix: Vec<Vec<char>> = Vec::new();

    let mut ndx: (i32, i32) = (0, 0);
    for (i, line) in read_to_string("./input.txt").unwrap().lines().enumerate() {
        matrix.push(Vec::new());
        for (j, c) in line.chars().enumerate() {
            if c == 'S' {
                ndx = (i as i32, j as i32);
            }
            matrix[i].push(c);
        }
    }
    
    let mut next_from: char = '_';
    
    let from_j = (ndx.1 - 1).max(1); // to avoid indexing at -1 if S is on the left border
    for j in [from_j, ndx.1 + 1] {
        let pipe = matrix[ndx.0 as usize][j as usize];
        if pipe == '.' || j == ndx.1 {
            continue;
        }

        let orientation = orientation(pipe);
        let dir_1 = dir(orientation.0);
        let dir_2 = dir(orientation.1);

        let delta = (0, ndx.1 - j);

        if delta == dir_1 {
            next_from = oppos(orientation.1);
            ndx = (ndx.0 + dir_2.0, j + dir_2.1);
            break;
        } else if delta == dir_2 {
            next_from = oppos(orientation.0);
            ndx = (ndx.0 + dir_1.0, j + dir_1.1);
            break;
        }
    }

    let mut cpt = 2; // S and the first pipe

    loop {
        let pipe = matrix[ndx.0 as usize][ndx.1 as usize];
        if pipe == 'S' {
            break;
        }
        
        let ori = orientation(pipe);
        if ori.0 == next_from {
            next_from = oppos(ori.1);
            let dir = dir(ori.1);
            ndx = (ndx.0 + dir.0, ndx.1 + dir.1);
        }
        else {
            next_from = oppos(ori.0);
            let dir = dir(ori.0);
            ndx = (ndx.0 + dir.0, ndx.1 + dir.1);

        }
        cpt += 1;
    }

    println!("{} in {:?}", cpt >> 1, start_time.elapsed());
}

fn oppos(dir: char) -> char {
    match dir {
        'N' => 'S',
        'S' => 'N',
        'E' => 'W',
        'W' => 'E',
        _ => '_'
    }
}

fn dir(dir: char) -> (i32, i32) {
    match dir {
        'N' => (-1, 0),
        'S' => (1, 0),
        'E' => (0, 1),
        'W' => (0, -1),
        _ => (0, 0),
    }
}

fn orientation(pipe: char) -> (char, char) {
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
