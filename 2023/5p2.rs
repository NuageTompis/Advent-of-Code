use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

    let binding = read_to_string("./input.txt").unwrap();
    let fst_line = binding.lines().next().unwrap();
    let space_ndx = fst_line.find(" ").unwrap();
    let fst_line = fst_line[space_ndx + 1..].split(" ").map(|x| x.parse::<i64>().unwrap()).collect::<Vec<_>>();

    let mut v:Vec<(i64, i64, bool)> = Vec::new();
    let l = fst_line.len();
    for i in 0..l/2 {
        v.push((fst_line[i*2], fst_line[i*2 + 1], true));
    }

    let mut overall_tested:Vec<i32> = Vec::new();

    v.sort_by(|a, b| a.0.cmp(&b.0));
    merge_intervals(&mut v);

    let mut jump = false;

    let mut cloned_v = v.clone();

    for line in binding.lines().skip(1) {
        if jump {
            jump = false;
            continue;
        }
        if line.trim().len() == 0 {
            jump = true;
            v = cloned_v.clone();
            for i in 0..v.len() {
                v[i].2 = true;
            }
            merge_intervals(&mut v);
            cloned_v = v.clone();
            continue;
        }

        let vals = line
        .trim()
        .split(" ")
        .map(|x| x.parse::<i64>().unwrap())
        .collect::<Vec<_>>();
    
        process_tuples(&mut cloned_v, (vals[0], vals[1], vals[2]), &mut overall_tested);
    }
    
    v = cloned_v.clone();
    for i in 0..v.len() {
        v[i].2 = true;
    }
    
    v.sort_by(|a, b| a.0.cmp(&b.0));
    merge_intervals(&mut v);

    println!("{:?} in {:?}", v[0].0, start_time.elapsed());

}

fn process_tuples(v: &mut Vec<(i64, i64, bool)>, x: (i64, i64, i64), overall_tested: &mut Vec<i32>) {
    for i in 0..v.len() {
        if v[i].2 == false {
            continue;
        }

        let (a, b, _) = v[i];
        let x_max_ndx = x.1 + x.2 - 1;
        let x_min_ndx = x.1;

        let el_max_ndx = a + b - 1;

        // case A
        if x_max_ndx < a {
            if !overall_tested.contains(&1) {
                overall_tested.push(1);
            }
            break;
        }
        // case B
        if x.1 > el_max_ndx {
            if !overall_tested.contains(&2) {
                overall_tested.push(2);
            }
            continue;
        }
        // case D
        if x_min_ndx < a && x_max_ndx > el_max_ndx {
            if !overall_tested.contains(&3) {
                overall_tested.push(3);
            }
            // D'
            v[i].0 -= x.1 - x.0;
            v[i].2 = false;
            continue;
        }
        // case C
        if x_min_ndx < a && x_max_ndx <= el_max_ndx {
            if !overall_tested.contains(&4) {
                overall_tested.push(4);
            }
            // C'
            if x_max_ndx < el_max_ndx {
                if !overall_tested.contains(&5) {
                    overall_tested.push(5);
                }
                v[i] = (x_max_ndx + 1, b - (x_max_ndx - a + 1), true);
                v.push((x.0 + a - x.1, x_max_ndx - a + 1, false));
            }
            // C
            else {
                if !overall_tested.contains(&6) {
                    overall_tested.push(6);
                }
                v[i].0 -= x.1 - x.0;
                v[i].2 = false;
            }
            break;
        }

        // case E
        if x_min_ndx >= a && x_max_ndx <= el_max_ndx {
            if !overall_tested.contains(&7) {
                overall_tested.push(7);
            }
            
            if x_min_ndx == a && x_max_ndx == el_max_ndx {
                v[i] = (x.0, b, false);
                if !overall_tested.contains(&8) {
                    overall_tested.push(8);
                }
            }
            else if x_min_ndx == a {
                if !overall_tested.contains(&9) {
                    overall_tested.push(9);
                }
                v[i].0 = x.0;
                v[i].2 = false;
                v[i].1 = x.2;
                v.push((x_max_ndx + 1, b - x.2, true));
            }
            else if x_max_ndx == el_max_ndx {
                if !overall_tested.contains(&10) {
                    overall_tested.push(10);
                }
                v[i].1 = b - x.2;
                v.push((x.0, x.2, false));
            }
            else {
                if !overall_tested.contains(&11) {
                    overall_tested.push(11);
                }
                v[i].1 = x_min_ndx - a;
                v.push((x.0 + a  + 1- x_min_ndx, x.2, false));
                v.push((x_max_ndx + 1, b - x.2 - x_min_ndx + a, true));

            }
            break;
        }

        if x_min_ndx >= a && x_max_ndx > el_max_ndx {
            if x_min_ndx == a {
                if !overall_tested.contains(&12) {
                    overall_tested.push(12);
                }
                v[i] = (x.0, b, false);
            }
            else {
                v[i] = (a, x.1 - a, true);
                v.push((x.0, b - x.1 + a, false));
                if !overall_tested.contains(&13) {
                    overall_tested.push(13);
                }
            }
            continue;
        }
    }

    v.sort_by(|a, b| a.0.cmp(&b.0));
    merge_intervals(v);
}


fn merge_intervals(intervals: &mut Vec<(i64, i64, bool)>) {
    let mut merged_intervals = Vec::new();
    let mut current_interval = intervals[0];

    let mut i = 0;
    while current_interval.2 == false {
        merged_intervals.push(current_interval);
        if i == intervals.len() - 1 {
            break;
        }
        i += 1;
        current_interval = intervals[i];
    }

    for &(start, length, movable) in &intervals[i+1..] {
        if movable == false {
            merged_intervals.push((start, length, movable));
        }
        else {
            let end = start + length - 1;

            if current_interval.0 + current_interval.1 >= start {
                // The current interval overlaps with the next interval
                let new_end = end.max(current_interval.0 + current_interval.1 - 1);
                current_interval.1 = new_end - current_interval.0 + 1;
            } else {
                // No overlap, push the current merged interval and update to the new interval
                merged_intervals.push(current_interval);
                current_interval = (start, length, movable);
            }
        }
    }

    // Push the last merged interval
    if current_interval.2 == true {
        merged_intervals.push(current_interval);
    }
    *intervals = merged_intervals;
}
