use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();
    
    let mut ndx = (0, 0);
    let mut vertices: Vec<(i32, i32)> = Vec::new();
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

fn parse_input(input: &str) -> (char, i32) {
    let first_char = input.chars().next().unwrap();
    let first_space_ndx = input.find(' ').unwrap();
    let second_space_ndx = input[first_space_ndx + 1..].find(' ').unwrap() + first_space_ndx + 1;

    let number = input[first_space_ndx + 1..second_space_ndx].parse::<i32>().unwrap();

    (first_char, number)
}

