use std::fs::read_to_string;
use std::collections::HashMap;
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
    
    let mut bottoms: HashMap<u32, Vec<usize>> = HashMap::new(); // for a specific z, the pointers to the bricks of bottom z
    let mut tops: HashMap<u32, Vec<usize>> = HashMap::new(); // idem for the top part of the brick
    let mut fallen: Vec<(Point, Point)> = Vec::new();
    let mut i = 0;
    // get fallen bricks
    for brick in &bricks {
        let mut max: u32 = 0;

        // the bricks representation is already sorted (x1 < x2, etc.)
        let (x1, x2) = (brick.0.0, brick.1.0);
        let (y1, y2) = (brick.0.1, brick.1.1); 
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

    let mut cpt = 1; // the highest is 100% secure
    let mut i = 0;
    let n = fallen.len();
    
    while i < n - 1 {
        let brick = &fallen[i];
        let (x1, y1, _) = brick.0.coords();
        let (x2, y2, z2) = brick.1.coords();

        if let Some(v) = bottoms.get(&(z2 + 1)) {
            // go through the ones on top
            // if they intersect by x and y
            //     -> if there is another brick holding, its fine
            let mut possible = true;
            for ndx1 in v {
                let brick_on_top = &fallen[*ndx1];
                let (a1, b1, _) = brick_on_top.0.coords();
                let (a2, b2, _) = brick_on_top.1.coords();
                let mut has_holder;
                if intersect(&((x1, y1), (x2, y2)), &((a1, b1), (a2, b2))) {
                    // if there is no other brick holding it, break
                    has_holder = false;
                    let holders = tops.get(&z2).unwrap();
                    for ndx2 in holders {
                        let holder = &fallen[*ndx2];
                        if holder.0.equals(&brick.0) && holder.1.equals(&brick.1) {
                            continue;
                        }
                        let (p1, q1, _) = holder.0.coords();
                        let (p2, q2, _) = holder.1.coords();
                        if intersect(&((p1, q1), (p2, q2)), &((a1, b1), (a2, b2))) {
                            has_holder = true;
                            break;
                        }
                    }
                    if !has_holder {
                        possible = false;
                        break;
                    }
                }
            }
            if possible {
                cpt += 1;
            }
        } else {
            cpt += 1;
        }

        i += 1;
    }

    println!("{} in {:?}", cpt, start_time.elapsed());
}

#[derive(Debug)]
struct Point(u32, u32, u32);

impl Point {
    fn coords(&self) -> (u32, u32, u32) {
        (self.0, self.1, self.2)
    }
    fn equals(&self, other: &Point) -> bool {
        (self.0 == other.0) && (self.1 == other.1) && (self.2 == other.2)
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