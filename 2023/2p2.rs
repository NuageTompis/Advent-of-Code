use std::fs::read_to_string;

fn main() {
    let mut sum = 0;

    for line in read_to_string("./input.txt").unwrap().lines() {
        let sets = line.split(|c| c == ':').nth(1).unwrap().split(';');
        let mut max = [0, 0, 0];
        for set in sets {
            let cols = set.trim().split(',');
            for col in cols {
                let mut words = col.trim().split(' ');
                let v = words.next().unwrap().parse::<i32>().unwrap();
                let c = words.next().unwrap();
                match c {
                    "red" => if v > max[0] {
                        max[0] = v;
                    },
                    "green" => if v > max[1] {
                        max[1] = v;
                    },
                    "blue" => if v > max[2] {
                        max[2] = v;
                    },
                    _ => { }
                }
            }
        }
        sum += max[0] * max[1] * max[2];
    }    

    println!("{sum}");
}
