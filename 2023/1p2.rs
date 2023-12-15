use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

    let mut sum = 0;
    for line in read_to_string("./input.txt").unwrap().lines() {
        let mut i = 0;
        loop {
            let value = process_index(&line, i);
            if value != 0 {
                sum += 10 * value;
                break;
            }
            i += 1;
        }

        i = line.len() - 1;
        loop {
            let value = process_index(&line, i);
            if value != 0 {
                sum += value;
                break;
            }
            i -= 1;
        }
    }

    println!("{} in {:?}", sum, start_time.elapsed());   
}

fn val(str_d: &str, l: i32) -> u32 {
    let v;
    match l {
        3 => {
            match str_d {
                "one" => v = 1,
                "two" => v = 2,
                "six" => v = 6,
                _ => v = 0  
            }
        },
        4 => {
            match str_d {
                "four" => v = 4,
                "five" => v = 5,
                "nine" => v = 9,
                _ => v = 0  
            }
        }
        5 => {
            match str_d {
                "three" => v = 3,
                "seven" => v = 7,
                "eight" => v = 8,
                _ => v = 0  
            }
        },
        _ => v = 0  
    }
    v
}

fn process_index(line: &str, i: usize) -> u32 {
    let d = line.chars().nth(i).unwrap();
    if d.is_numeric() {
        return d.to_digit(10).unwrap();
    }

    for len in 3..6 {
        if line.len() - i >= len {
            let v = val(&line[i..(i + len)], len as i32);
            if v != 0 {
                return v;
            }
        }
    }

    0
}
