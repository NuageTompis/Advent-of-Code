use std::fs::read_to_string;

fn main() {
    let binding = read_to_string("./input.txt").unwrap();
    let lines = binding.lines();
    let amt = lines.clone().count();
    let mut card_instances: Vec<i32> = vec![1; amt];

    let mut id = 0;
    for line in lines {
        let card = line.split(":").collect::<Vec<_>>()[1].split("|").collect::<Vec<_>>();

        
        let mut wn = Vec::new();
        
        let mut found_b = false;
        let mut v = 0;
        let mut len = card[0].len();
        for (j, c) in card[0].chars().enumerate() {
            if c.is_numeric() {
                if !found_b {
                    v = c.to_digit(10).unwrap();
                    found_b = true;
                } else {
                    v = v * 10 + c.to_digit(10).unwrap();
                }
                if j == len - 1 {
                    wn.push(v);
                }
            }
            else {
                if found_b {
                    wn.push(v);
                    found_b = false;
                }
            }
        }
        
        // Amount of matching numbers
        let mut mn = 0;
        len = card[1].len();
        for (j, c) in card[1].chars().enumerate() {
            if c.is_numeric() {
                if !found_b {
                    v = c.to_digit(10).unwrap();
                    found_b = true;
                } else {
                    v = v * 10 + c.to_digit(10).unwrap();
                }
                if j == len - 1 {
                    if wn.contains(&v) {
                        mn +=1;
                    }
                }
            }
            else {
                if found_b {
                    if wn.contains(&v) {
                        mn += 1;
                    }
                    found_b = false;
                }
            }
        }

        let amt = card_instances[id as usize];
        for k in 1..=mn {
            card_instances[id as usize + k ] += amt;
        }
        id += 1;
    }
    
    println!("{}", card_instances.iter().sum::<i32>());
}
