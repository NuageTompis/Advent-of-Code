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
    let mut vertices: Vec<(i32, i32, bool)> = Vec::new();
    let mut s_to = '_';

    let from_j = (ndx.1 - 1).max(1); // to avoid indexing at -1 if S is on the left border
    for j in [from_j, ndx.1 + 1] {
        let pipe = matrix[ndx.0 as usize][j as usize];
        if pipe == '.' || j == ndx.1 {
            continue;
        }

        let ori = orientation(pipe);
        let dir_1 = dir(ori.0);
        let dir_2 = dir(ori.1);

        let delta = (0, ndx.1 - j);

        if delta == dir_1 {
            s_to = oppos(ori.0);
            next_from = oppos(ori.1);
            if pipe != '-' && pipe != '|' {
                vertices.push((ndx.0, j, is_right_turn(ori)));
            }
            ndx = (ndx.0 + dir_2.0, j + dir_2.1);
            break;
        } else if delta == dir_2 {
            s_to = oppos(ori.1);
            next_from = oppos(ori.0);
            if pipe != '-' && pipe != '|' {
                vertices.push((ndx.0, j, is_right_turn((ori.1, ori.0))));
            }
            ndx = (ndx.0 + dir_1.0, j + dir_1.1);
            break;
        }
    }

    let mut cpt = 2; // S and the first pipe

    loop {
        let pipe = matrix[ndx.0 as usize][ndx.1 as usize];
        if pipe == 'S' {
            let s_from = next_from;
            match s_from {
                'N' => {
                    if s_to == 'E' {
                        vertices.push((ndx.0, ndx.1, false));
                    }
                    else if s_to == 'W' {
                        vertices.push((ndx.0, ndx.1, true));
                    }
                },
                'S' => {
                    if s_to == 'E' {
                        vertices.push((ndx.0, ndx.1, true));
                    }
                    else if s_to == 'W' {
                        vertices.push((ndx.0, ndx.1, false));
                    }
                },
                'E' => {
                    if s_to == 'N' {
                        vertices.push((ndx.0, ndx.1, true));
                    }
                    else if s_to == 'S' {
                        vertices.push((ndx.0, ndx.1, false));
                    }
                },
                'W' => {
                    if s_to == 'N' {
                        vertices.push((ndx.0, ndx.1, false));
                    }
                    else if s_to == 'S' {
                        vertices.push((ndx.0, ndx.1, true));
                    }
                },
                _ => { }
            };
            break;
        }
        
        let ori = orientation(pipe);
        if ori.0 == next_from {
            next_from = oppos(ori.1);
            let dir = dir(ori.1);
            if pipe != '-' && pipe != '|' {
                vertices.push((ndx.0, ndx.1, is_right_turn(ori)));
            }
            ndx = (ndx.0 + dir.0, ndx.1 + dir.1);
        }
        else {
            next_from = oppos(ori.0);
            let dir = dir(ori.0);
            if pipe != '-' && pipe != '|' {
                vertices.push((ndx.0, ndx.1, is_right_turn((ori.1, ori.0))));
            }
            ndx = (ndx.0 + dir.0, ndx.1 + dir.1);

        }
        cpt += 1;
    }

    // Compute area
    let right_turns: i32 = vertices.iter().map(|&v| if v.2 { 1 } else { -1 }).sum();
    let left_loop = right_turns == -4; // Can only be 4 or -4

    // Inner area, outer area, perimeter = cpt
    let verts = vertices.len() as i32;
    let mut outer_area = verts;
    for v in &vertices {
        if left_loop ^ v.2 {
            outer_area += 2;
        }
    }
    outer_area += (cpt - verts) << 1;
    let outer_area = outer_area >> 2;

    let mut a = 0;
    let mut b = 0;
    for k in 0..(verts as usize >> 1) {
        let i = k << 1;
        let j = (i + 1) % verts as usize;
        a += vertices[i].0 * vertices[j].1;
        b += vertices[i].1 * vertices[j].0;
    }
    let inner_area = (a - b).abs();

    println!("{} in {:?}", inner_area + outer_area - cpt, start_time.elapsed());
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

fn is_right_turn(pipe: (char, char)) -> bool {
    match pipe.0 {
        'N' => {
            pipe.1 == 'W'
        }
        'S' => {
            pipe.1 == 'E'
        },
        'E' => {
            pipe.1 == 'N'
        },
        'W' => {
            pipe.1 == 'S'
        },
        _ => {
            println!("mhh");
            false
        }
    }
}
