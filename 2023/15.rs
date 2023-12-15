use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

    let mut sum = 0;
    let binding = read_to_string("./input.txt").unwrap();

    let mut curr = 0;
    for c in binding.chars() {
        if c == ',' {
            sum += curr;
            curr = 0;
        }
        else {
            curr += c as u32;
            curr = (17 * curr) % 256;
        }
    }
    sum += curr;

    println!("{} in {:?}", sum, start_time.elapsed());
}
