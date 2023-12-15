use std::fs::read_to_string;
use std::time::Instant;

fn main() {
    let start_time = Instant::now();
    
    let mut sum = 0;
    // Previous numbers from previous line
    let mut prev_nb = Vec::new();
    // Symbols indices from previous line
    let mut prev_ndc = Vec::<i32>::new();
    
    for line in read_to_string("./input.txt").unwrap().lines() {
        let mut curr_nbs = Vec::new();
        let mut curr_ndc = Vec::<i32>::new();
        let len = line.len() as i32;
        let mut v = 0;
        // First and last indices of the number
        let mut fst_ndx: i32 = 0;
        let mut lst_ndx = 0;
        let mut found_nb = false;
        let mut was_symbol = false;

        let mut j = 0;
        for c in line.chars() {
            if c.is_numeric() {
                if !found_nb {
                    v = c.to_digit(10).unwrap() as i32;
                    fst_ndx = j;
                    lst_ndx = j;
                    found_nb = true;
                } else {
                    v = v * 10 + c.to_digit(10).unwrap() as i32;
                    lst_ndx += 1;
                }
                if j == len - 1 {
                    if was_symbol {
                        sum += v;
                    }
                    else {
                        scan_prev_ndc(&prev_ndc, &mut curr_nbs, &mut sum, v, fst_ndx, lst_ndx);
                    }
                }
            } else  {
                if c == '.' {
                    if found_nb {
                        if was_symbol {
                            sum += v;
                        }
                        else {
                            scan_prev_ndc(&prev_ndc, &mut curr_nbs, &mut sum, v, fst_ndx, lst_ndx);
                        }
                    }
                    was_symbol = false;
                } else {
                    if found_nb {
                        sum += v;
                    }
                        let mut k = 0;
                        let mut ndc = Vec::new();
                        for (_, prev_fst_ndx, prev_lst_ndx) in &prev_nb {
                            if j >= *prev_fst_ndx - 1  && j <= prev_lst_ndx + 1 {
                                if !ndc.contains(&k)
                                {
                                    ndc.push(k)
                                }
                            }
                            k += 1;
                        }
                        for nxd in ndc.iter().rev() {
    
                            let (a, _, _) = prev_nb[*nxd];
                            sum += a;
                            prev_nb.remove(*nxd);
                            
                        }
                        was_symbol = true;
                        curr_ndc.push(j as i32);
                }
                found_nb = false;
            }
            j += 1;
        }

        prev_nb = curr_nbs.clone();
        prev_ndc = curr_ndc.clone();
    }

    println!("{} in {:?}", sum, start_time.elapsed());   
}

fn scan_prev_ndc(prev_ndc: &Vec<i32>, curr_nbs: &mut Vec<(i32, i32, i32)>, sum: &mut i32, v: i32, fst_ndx: i32, lst_ndx: i32) {
    let mut to_add = false;
    for ndx in prev_ndc {
        if *ndx >= fst_ndx - 1 && *ndx <= lst_ndx + 1 {
            to_add = true;
            break;
        }
    }
    if to_add {
        *sum += v;
    } else {
        curr_nbs.push((v, fst_ndx, lst_ndx));
    }
}
