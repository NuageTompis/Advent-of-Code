use std::fs::read_to_string;

fn main() {
    let mut sum = 0;
    
    for line in read_to_string("./input.txt").unwrap().lines() {
        let mut vals = line
        .split(" ")
        .map(|x| x.parse::<i32>().unwrap())
        .collect::<Vec<_>>();
        let l = vals.len();
        
        let mut d = l - 1;
        let mut add = true;
        loop {
            if add {
                sum += vals[0];
            }
            else {
                sum -= vals[0];
            }
            let mut end = true;
            for i in 0..d {
                vals[i] = vals[i+1] - vals[i];
                if end & (vals[i] != 0) {
                    end = false;
                }
            }
            if end {
                break;
            }
            d -= 1;
            add ^= true;
        }
    }

    println!("{}", sum);
}
