use std::fs::File;
use std::io::{self, BufRead};

fn main() {
    if let (Some(times_str), Some(dists_str)) = (lines().nth(0), lines().nth(1)) {
        let time_str: String = times_str.split_whitespace().skip(1).filter(|&word| !word.is_empty()).collect();
        let dist_str: String = dists_str.split_whitespace().skip(1).filter(|&word| !word.is_empty()).collect();
        
        if let (Ok(time), Ok(dist)) = (time_str.parse::<f64>(), dist_str.parse::<f64>()) {
            let score = compute_range(time, dist);
            println!("{}", score);
        }
    }
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

fn lines() -> impl Iterator<Item = String> {
    File::open("input.txt")
        .map(io::BufReader::new)
        .into_iter()
        .flat_map(|file| file.lines())
        .map(|line| line.expect("Failed to read line"))
}
