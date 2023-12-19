use std::fs::read_to_string;
use std::collections::HashMap;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

    let binding = read_to_string("./input.txt").unwrap();
    let lines = binding.lines();
    let mut workflows: HashMap<&str, (Vec<(char, char, u64, &str)>, &str)> = HashMap::new();

    for line in lines {
        if line.len() == 0 {
            break;
        }
        let mut rules: Vec<(char, char, u64, &str)> = Vec::new();
        let splitted = line.split('{').collect::<Vec<&str>>();
        let name = splitted[0];
        let wf = splitted[1][0..splitted[1].len()-1].split(',').collect::<Vec<&str>>(); // workflow
        let ultimate = wf[wf.len()-1];
        
        for i in 0..wf.len()-1 {
            let fst = wf[i].chars().nth(0).unwrap();
            let snd = wf[i].chars().nth(1).unwrap();
            let semi_column = wf[i].find(':').unwrap();
            let value = wf[i][2..semi_column].parse::<u64>().unwrap();
            let sent = &wf[i][semi_column+1..];
            rules.push((fst, snd, value, sent));
        }
        
        workflows.insert(name, (rules, ultimate));
    }

        
    let mut sum = 0;
    let mut threads: Vec<(&str, Vec<(u64, u64)>)> = Vec::new();
    threads.push(("in", vec![(1, 4000);4]));

    while threads.len() != 0 {
        let mut new_threads: Vec<(&str, Vec<(u64, u64)>)> = Vec::new();
        for thr in &threads {
            let id = thr.0;
            let sub_threads = split(workflows.get(&id).unwrap().clone(), thr.1.clone());
            for sub in sub_threads {
                if sub.0 == "A" {
                    let mut prod = 1;
                    for dim in sub.1 {
                        prod *= dim.1 - dim.0 + 1;
                    }
                    sum += prod;
                }
                else {
                    new_threads.push(sub)
                }
            }
        }
        threads = new_threads.clone();
    }

    println!("{} in {:?}", sum, start_time.elapsed());
}

// returns "A" if accepted, if rejected, not included in the return
fn split<'a>(workflow: (Vec<(char, char, u64, &'a str)>, &'a str),  interval: Vec<(u64, u64)>) -> Vec<(&'a str, Vec<(u64, u64)>)> {
    let (rules, ultim) = workflow;
    let mut ret: Vec<(&str, Vec<(u64, u64)>)> = Vec::new();
    let mut threads: Vec<Vec<(u64, u64)>> = Vec::new();
    threads.push(interval);
    for rule in rules {
        let (cate, ope, val, sent) = rule;
        let dim = match cate {
            'x' => {
                0
            },
            'm' => {
                1
            },
            'a' => {
                2
            },
            's' => {
                3
            },
            _ => panic!("hmm")
        };
        let (fst, lst, lesser) = match ope {
            '<' => (val - 1, val, true),
            '>' => (val, val + 1, false),
            _ => panic!("error")
        };

        let mut new_threads: Vec<Vec<(u64, u64)>> = Vec::new();
        for thread in threads {
            let (voy_a, voy_b) = thread[dim];
            if lst < voy_a || fst > voy_b {
                continue;
            }
            if voy_a == voy_b {
                if lesser {
                    if voy_a <= fst {
                        ret.push((sent, thread));
                    }
                }
                else {
                    if voy_a >= lst {
                        ret.push((sent, thread));
                    }
                }
            }
            else {
                if voy_a >= lst {
                    // do not divise
                    if lesser {
                        new_threads.push(thread);
                    }
                    else {
                        if sent != "R" {
                            ret.push((sent, thread));
                        }
                    }
                }
                else if  voy_b <= fst {
                    // do not divise
                    if lesser {
                        if sent != "R" {
                            ret.push((sent, thread));
                        }
                    }
                    else {
                        new_threads.push(thread);
                    }
                }
                else {
                    // divise
                    if lesser {
                        let mut intervals = thread.clone();
                        intervals[dim] = (voy_a, fst);
                        if sent != "R" {
                            ret.push((sent, intervals));
                        }
                        let mut intervals2 = thread.clone();
                        intervals2[dim] = (lst, voy_b);
                        new_threads.push(intervals2);
                    }
                    else {
                        let mut intervals = thread.clone();
                        intervals[dim] = (lst, voy_b);
                        if sent != "R" {
                            ret.push((sent, intervals));
                        }
                        let mut intervals2 = thread.clone();
                        intervals2[dim] = (voy_a, fst);
                        new_threads.push(intervals2);
                    }
                }
            }
        }
        threads = new_threads.clone();
    }

    if ultim != "R" {
        for thread in threads {
            ret.push((ultim, thread));
        }
    }

    ret
}
