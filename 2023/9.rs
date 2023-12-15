use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();
    
    let mut sum = 0;
    for line in read_to_string("./input.txt").unwrap().lines() {
        let mut vals = line
        .split(" ")
        .map(|x| x.parse::<i32>().unwrap())
        .collect::<Vec<_>>();
        let l = vals.len();

        let mut d = l - 1;
        loop {
            let mut end = true;
            for i in 0..d {
                vals[i] = vals[i + 1] - vals[i];
                if end & (vals[i] != 0) {
                    end = false;
                }
            }
            if end {
                for i in d..l {
                    sum += vals[i];
                }
                break;
            }
            d -= 1;
        }
    }

    println!("{} in {:?}", sum, start_time.elapsed());   
}
