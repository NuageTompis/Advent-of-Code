use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();
    
    let binding = read_to_string("./input.txt").unwrap();
    let fst_line = binding.lines().next().unwrap();
    let space_ndx = fst_line.find(" ").unwrap();
    let mut seeds = fst_line[space_ndx + 1..].split(" ").map(|x| x.parse::<i64>().unwrap()).collect::<Vec<_>>();
    let mut seeds2 = seeds.clone();

    let mut jump = false;
    for line in binding.lines().skip(1) {
        // if blank line
        if jump {
            jump = false;
            continue;
        }
        if line.trim().len() == 0 {
            jump = true;
            seeds = seeds2.clone();
            continue;
        }

        let vals = line
        .trim()
        .split(" ")
        .map(|x| x.parse::<i64>().unwrap())
        .collect::<Vec<_>>();
    
        let mut c = 0;
        for seed in &mut seeds {
            if *seed >= vals[1] && *seed < vals[1] + vals[2] {
                seeds2[c] = vals[0] + *seed - vals[1];
            }
            c += 1;
        }
    }

    let mut min = seeds2[0];
    for seed in seeds2.iter() {
        if *seed < min {
            min = *seed;
        }
    }
    println!("{} in {:?}", min, start_time.elapsed());
}