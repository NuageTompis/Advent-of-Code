use std::fs::read_to_string;

fn main() {
    let mut sum = 0;

    for line in read_to_string("./input.txt").unwrap().lines() {
        let mut game = line.split(|c| c == ':');
        let id = game.next().unwrap().split(' ').nth(1).unwrap().parse::<u32>().unwrap();
        let sets = game.next().unwrap().split(';');
        let mut valid = true;
        for set in sets {
            let cols = set.trim().split(',');
            for col in cols {
                let mut words = col.trim().split(' ');
                let v = words.next().unwrap().parse::<i32>().unwrap();
                let c = words.next().unwrap();
                match c {
                    "red" => if v > 12 {
                        valid = false;
                        break;
                    },
                    "green" => if v > 13 {
                        valid = false;
                        break;
                    },
                    "blue" => if v > 14 {
                        valid = false;
                        break;
                    },
                    _ => { }
                }
            }
        }
        if valid {
                sum += id;
        }
    }    

    println!("{sum}");
}
