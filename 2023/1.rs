use std::fs::read_to_string;

fn main() {
    let mut sum = 0;
    
    for line in read_to_string("./input.txt").unwrap().lines() {
        for c in line.chars() {
            if c.is_numeric() {
                sum += 10 * c.to_digit(10).unwrap();
                break;
            }
        }
        for c in line.chars().rev() {
            if c.is_numeric() {
                sum += c.to_digit(10).unwrap();
                break;
            }
        }
    }
    
    println!("{}", sum);
}
