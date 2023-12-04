use std::fs::read_to_string;

fn main() {
    let mut sum = 0;
    
    for line in read_to_string("./input.txt").unwrap().lines() {
        let card = line.split(":").collect::<Vec<_>>()[1].split("|").collect::<Vec<_>>();
        let mut points = 1;
        
        // Winning numbers
        let mut wn = Vec::new();

        let mut found_nb = false;
        let mut v = 0;
        let mut len = card[0].len();
        for (j, c) in card[0].chars().enumerate() {
            if c.is_numeric() {
                if !found_nb {
                    v = c.to_digit(10).unwrap();
                    found_nb = true;
                } else {
                    v = v * 10 + c.to_digit(10).unwrap();
                }
                if j == len - 1 {
                    wn.push(v);
                }
            }
            else {
                if found_nb {
                    wn.push(v);
                    found_nb = false;
                }
            }
        }

        len = card[1].len();
        for (j, c) in card[1].chars().enumerate() {
            if c.is_numeric() {
                if !found_nb {
                    v = c.to_digit(10).unwrap();
                    found_nb = true;
                } else {
                    v = v * 10 + c.to_digit(10).unwrap();
                }
                if j == len - 1 {
                    if wn.contains(&v) {
                        points = points << 1;
                    }
                }
            }
            else {
                if found_nb {
                    if wn.contains(&v) {
                        points = points << 1;
                    }
                    found_nb = false;
                }
            }
        }

        sum += points >> 1;
    }

    println!("{}", sum);
}
