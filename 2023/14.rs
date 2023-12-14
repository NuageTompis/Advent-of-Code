use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

    let mut sum = 0;
    let binding = read_to_string("./input.txt").unwrap();
    let lines = binding.lines();
    let n = lines.clone().count(); // lines
    let m = lines.clone().nth(0).unwrap().len();
    let mut cubes_ndc = vec![0;m];
    
    let mut col_ndc: Vec<Vec<u32>> = Vec::new();
    for _ in 0..m {
        let col = Vec::new();
        col_ndc.push(col);
    }    

    for (i, line) in lines.enumerate() {
        for (j, c) in line.chars().enumerate() {
            if c == '#' {
                cubes_ndc[j] = i + 1;
            }
            else if c == 'O' {
                col_ndc[j].push(cubes_ndc[j] as u32);
                cubes_ndc[j] += 1;
            }
        }
    }

    for col in col_ndc {
        for i in col {
            sum += n as i32 - i as i32;
        } 
    }

    println!("{} in {:?}", sum, start_time.elapsed());
}
