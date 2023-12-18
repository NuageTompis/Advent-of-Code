use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();
    
    let mut ndx = (0, 0);
    let mut vertices: Vec<(i64, i64)> = Vec::new();
    let mut cpt = 0;
    
    for line in read_to_string("./input.txt").unwrap().lines() {
        let (dir, number) = parse_input(line);
        cpt += number;

        match dir {
            'R' => {
                ndx.1 += number;
                vertices.push(ndx);
            },
            'L' => {
                ndx.1 -= number;
                vertices.push(ndx);
            },
            'U' => {
                ndx.0 += number;
                vertices.push(ndx);
            },
            'D' => {
                ndx.0 -= number;
                vertices.push(ndx);
            },
            _ => panic!("Invalid direction"),
        }
    }

    let verts = vertices.len() as i32;

    let mut a = 0;
    let mut b = 0;
    for k in 0..(verts as usize >> 1) {
        let i = k << 1;
        let j = (i + 1) % verts as usize;
        a += vertices[i].0 * vertices[j].1;
        b += vertices[i].1 * vertices[j].0;
    }
    let polygon_area = (a - b).abs();

    let outer_area = (cpt >> 1) - 1;

    println!("{} in {:?}", polygon_area - outer_area + cpt, start_time.elapsed());
}

fn parse_input(input: &str) -> (char, i64) {
    let l = input.len();
    let last_char = input.chars().nth(l - 2).unwrap();
    let return_char;
    match last_char {
        '0' => {
            return_char = 'R';
        },
        '1' => {
            return_char = 'D';
        },
        '2' => {
            return_char = 'L';
        },
        '3' => {
            return_char = 'U';
        },
        _ => panic!("Invalid direction {:?}", last_char),
    }
    
    let number = i64::from_str_radix(&input[l-2-5..l-2], 16).unwrap();

    (return_char, number)    
}