use std::fs::read_to_string;
use std::collections::{HashMap, HashSet};
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

    let binding = read_to_string("./input.txt").unwrap();
    let lines = binding.lines();
    let mut workflows: HashMap<&str, (Vec<(char, char, i32, &str)>, &str)> = HashMap::new();

    let mut k = 0;
    for line in lines {
        if line.len() == 0 {
            break;
        }
        let mut rules: Vec<(char, char, i32, &str)> = Vec::new();
        let splitted = line.split('{').collect::<Vec<&str>>();
        let name = splitted[0];
        let wf = splitted[1][0..splitted[1].len()-1].split(',').collect::<Vec<&str>>(); // workflow
        let ultimate = wf[wf.len()-1];
        
        for i in 0..wf.len()-1 {
            let fst = wf[i].chars().nth(0).unwrap();
            let snd = wf[i].chars().nth(1).unwrap();
            let semi_column = wf[i].find(':').unwrap();
            let value = wf[i][2..semi_column].parse::<i32>().unwrap();
            let sent = &wf[i][semi_column+1..];
            rules.push((fst, snd, value, sent));
        }
        
        workflows.insert(name, (rules, ultimate));
        k += 1;
    }

    let mut sum = 0;
    for line in binding.lines().skip(k + 1) {
        
        let part: Vec<i32> = line[1..line.len()-1].split(',').map(|x| {
            x[2..].parse::<i32>().unwrap()
        }).collect();


        let mut curr = "in";
        let mut done  = false;
        let mut seen: HashSet<&str> = HashSet::new();
        loop {
            if seen.contains(&curr) || curr == "A" || curr == "R" {
                break;
            }
            seen.insert(curr);
            if let Some(wf) = workflows.get(&curr) {
                let (rules, ultimate) = wf;
                let mut found_valid = false;
                for (cate, ope, val, sent) in rules.iter() {
                    let part_ndx = match cate {
                        'x' => 0,
                        'm' => 1,
                        'a' => 2,
                        's' => 3,
                        _ => panic!("Unknown category")
                    };

                    let valid = match ope {
                        '<' => part[part_ndx] < *val,
                        '>' => part[part_ndx] > *val,
                        _ => panic!("Unknown operator")
                    };

                    if valid {
                        found_valid = true;
                        match *sent {
                            "A" => {
                                done = true;
                                for rating in part.iter() {
                                    sum += rating;
                                }
                            },
                            "R" => {
                                done = true;
                            },
                            _ => {
                                curr = sent;
                            }
                        }
                        break;
                    }
                }
                if !found_valid {
                    curr = ultimate;
                }
                if done {
                    break;
                }
            }
            else {
                panic!("Unknown workflow {}", curr);
            }
            if done {
                break;
            }
        }

        if !done {
            match curr {
                "A" => {
                    for rating in part.iter() {
                        sum += rating;
                    }
                },
                "R" => (),
                _ => panic!("Unknown final state {:?}", curr)
            }
        }

    }

    println!("{} in {:?}", sum, start_time.elapsed());


}
