use std::fs::File;
use std::io::{self, BufRead};
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

    let file = File::open("input.txt").expect("Failed to open input file");
    let lines: Vec<String> = io::BufReader::new(file).lines().map(|line| line.expect("Failed to read line")).collect();
    let times: Vec<f64> = lines[0].split_whitespace().skip(1).map(|word| word.parse().unwrap()).collect();
    let dists: Vec<f64> = lines[1].split_whitespace().skip(1).map(|word| word.parse().unwrap()).collect();

    let mut p2 = 1;
    for i in 0..times.len() {
        p2 *= compute_range(times[i], dists[i]);
    }

    println!("{} in {:?}", p2, start_time.elapsed());   
}

fn compute_range(l: f64, s: f64) -> i64 {
    let delta = l * l - 4.0 * s;

    if delta < 0.0 {
        return 0;
    }

    let sq_delta = delta.sqrt();
    let i1 = (l - sq_delta) / 2.0;
    let i2 = i1 + sq_delta;

    i2.floor() as i64 - i1.ceil() as i64 + 1
}
