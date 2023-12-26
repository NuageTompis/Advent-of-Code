use std::fs::read_to_string;
use std::collections::{HashMap, HashSet};
use std::time::Instant;

fn main() {
    let start_time = Instant::now();

    let mut bricks: Vec<(Point, Point)> = Vec::new();
    let mut ceiling: HashMap<(u32, u32), u32> = HashMap::new();

    for line in read_to_string("./input.txt").unwrap().lines() {
        let mut parts = line.split('~');
        bricks.push((parse_point(parts.next().unwrap()), parse_point(parts.next().unwrap())));
    }
    bricks.sort_by(|a, b| a.0.2.cmp(&b.0.2));
    
    let mut bottoms: HashMap<u32, Vec<usize>> = HashMap::new();
    let mut tops: HashMap<u32, Vec<usize>> = HashMap::new();
    let mut fallen: Vec<(Point, Point)> = Vec::new();
    let mut i = 0;
    // get fallen bricks
    for brick in &bricks {
        let mut max: u32 = 0;
        let (x1, x2) = if brick.0.0 < brick.1.0 {
            (brick.0.0, brick.1.0)
        } else {
            (brick.1.0, brick.0.0)
        };
        let (y1, y2) = if brick.0.1 < brick.1.1 {
            (brick.0.1, brick.1.1)
        } else {
            (brick.1.1, brick.0.1)
        };
        // actually the coords are already sorted
        for x in x1..=x2 {
            for y in y1..=y2 {
                let ceil = ceiling.get(&(x, y)).unwrap_or(&0);
                if ceil > &max {
                    max = *ceil
                }
            }
        }

        let z_dist = 1 + (brick.0.2 as i32 - brick.1.2 as i32).abs() as u32;
        for x in x1..=x2 {
            for y in y1..=y2 {
                ceiling.insert((x, y), max + z_dist as u32);
            }
        }
        
        let bottom = 1 + max;
        let top = max + z_dist;
        bottoms.entry(bottom).or_insert(vec![]).push(i);
        tops.entry(top).or_insert(vec![]).push(i);
        fallen.push((Point(brick.0.0, brick.0.1, bottom), Point(brick.1.0, brick.1.1, top)));
        i += 1;
    }

    let n = fallen.len();

    // for each brick, the bricks that support it
    let mut carrier_bricks: Vec<Vec<u32>> = vec![Vec::new();n];
    
    // bricks that single-handedly support another brick
    let mut solo_carriers: HashSet<u32> = HashSet::new();
    
    // get carrier_bricks and solo_carriers
    for i in (0..n).rev() {
        let brick = &fallen[i as usize];
        let (x1, y1, z1) = brick.0.coords();
        let (x2, y2, _) = brick.1.coords();
        
        if z1 == 0 {
            continue;
        }
        if let Some(v) = tops.get(&(z1 - 1)) {
            for ndx in v {
                let brick_below = &fallen[*ndx];
                let (a1, b1, _) = brick_below.0.coords();
                let (a2, b2, _) = brick_below.1.coords();
                if intersect(&((x1, y1), (x2, y2)), &((a1, b1), (a2, b2))) {
                    carrier_bricks[i].push(*ndx as u32);
                }
            }
        }
        if carrier_bricks[i].len() == 1 {
            solo_carriers.insert(carrier_bricks[i][0]);
        }
    }

    // for each brick, the bricks that it supports
    let mut bricks_carried: Vec<Vec<u32>> = vec![Vec::new();n];
    for i in 0..n {
        let brick = &fallen[i as usize];
        let (x1, y1, _) = brick.0.coords();
        let (x2, y2, z2) = brick.1.coords();

        if let Some(v) = bottoms.get(&(z2 + 1)) {
            for ndx in v {
                let brick_top = &fallen[*ndx];
                let (a1, b1, _) = brick_top.0.coords();
                let (a2, b2, _) = brick_top.1.coords();
                if intersect(&((x1, y1), (x2, y2)), &((a1, b1), (a2, b2))) {
                    bricks_carried[i].push(*ndx as u32);
                }
            }        
        }
    }

    let mut sum = 0;
    for sigma in &solo_carriers {
        // get bricks that sigma carries alone
        let mut first_carried: Vec<u32> = Vec::new();
        for carried in &bricks_carried[*sigma as usize] {
            if carrier_bricks[*carried as usize].len() == 1 {
                first_carried.push(*carried);
            }
        }

        // bricks on top of a brick carried by sigma, but not necessarely depending 100% on sigma
        let mut overall_carried = true_carried.clone();
        // bricks depending on sigma
        let mut true_carried: HashSet<u32> = first_carried.clone().into_iter().collect();

        for ndx in &first_carried {
            overall_carried.extend(bricks_carried[*ndx as usize].clone());
        }
        
        loop {
            let mut added = false;
            let mut ndc_to_extend: Vec<u32> = Vec::new();
            for ndx in &overall_carried {
                if true_carried.contains(&ndx) {
                    continue;
                }
                // check if it is carried only by bricks within overall_carried
                let carriers = &carrier_bricks[*ndx as usize];
                let mut sigma_dependant = true;
                for ndx2 in carriers {
                    if !true_carried.contains(ndx2) {
                        sigma_dependant = false;
                        break;
                    }
                }
                if sigma_dependant {
                    true_carried.insert(*ndx);
                    ndc_to_extend.push(*ndx);
                    added = true;
                }
            }
            if !added {
                break;
            }

            for ndx in ndc_to_extend {
                overall_carried.extend(bricks_carried[ndx as usize].clone());
            }
        }

        sum += true_carried.len();
    }

    println!("{} in {:?}", sum, start_time.elapsed());
}

#[derive(Debug)]
struct Point(u32, u32, u32);

impl Point {
    fn coords(&self) -> (u32, u32, u32) {
        (self.0, self.1, self.2)
    }
}

fn parse_point(point: &str) -> Point {
    let vec: Vec<u32> = point.split(',').map(|s| s.parse().expect("Whoops")).collect();
    Point(vec[0], vec[1], vec[2])
}

fn intersect(p1: &((u32, u32), (u32, u32)), p2: &((u32, u32), (u32, u32))) -> bool {
    if p1.1.0 < p2.0.0 || p1.0.0 > p2.1.0 {
        return false;
    }
    if p1.1.1 < p2.0.1 || p1.0.1 > p2.1.1 {
        return false;
    }
    true
}
