use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

    let mut boxes: Vec<Vec<(String, u32)>> = vec![Vec::new(); 256];

    let mut sum = 0;
    let binding = read_to_string("./input.txt").unwrap();
    let steps = binding.split(",");

    for step in steps {
        let mut hash = 0;

        let mut ndx = 0;
        let mut equal = false; // boolean
        let mut label = String::new();
        for (i, c) in step.chars().enumerate() {
            match c {
                '=' => {
                    ndx = i;
                    equal = true;
                    break;
                },
                '-' => {
                    ndx = i;
                    break;
                },
                _ => {
                    hash = (hash + c as usize) * 17 % 256;
                    label.push(c);
                }
            }
        }

        if equal {
            let val = step.chars().skip(ndx + 1).collect::<String>().parse::<u32>().unwrap();
            let mut found = false;
            for lens in boxes[hash].iter_mut() {
                if lens.0 == label {
                    lens.1 = val;
                    found = true;
                    break;
                }
            }
            if !found {
                boxes[hash].push((label, val));
            }
        }
        else {
            for lens in boxes[hash].iter_mut() {
                if lens.0 == label {
                    boxes[hash].retain(|x| x.0 != label);
                    break;
                }
            }
        }
    }

    for (i, _box) in boxes.iter().enumerate() {
        for (j, lens) in _box.iter().enumerate() {
            sum += (i + 1) as u32 * (j + 1) as u32 * lens.1;
        }
    }

    println!("{} in {:?}", sum, start_time.elapsed());
}
