use std::fs::read_to_string;

fn main() {
    let mut sum = 0;

    let mut prev_nb = Vec::new();
    let mut prev_ndc = Vec::<i32>::new();
    // Each element represent a star of the previous line, with its index and the list of number it was already linked with
    let mut prev_stars = Vec::<(i32, Vec<i32>)>::new();
    
    for line in read_to_string("./input.txt").unwrap().lines() {
        let mut curr_nbs = Vec::new();
        let mut curr_ndc = Vec::new();
        let mut stars = Vec::new();

        let len = line.len() as i32;
        let mut v = 0;

        let mut fst_ndx = 0;
        let mut lst_ndx = 0;
        let mut found_nb = false;
        let mut to_add = false;
        let mut was_star = false;


        let mut ndc_to_add = Vec::new();
        let mut j = 0;
        for c in line.chars() {
            if c.is_numeric() {
                let mut ndxs_gears = Vec::new();
                if !found_nb {
                    ndc_to_add = Vec::new();
                    v = c.to_digit(10).unwrap();
                    fst_ndx = j;
                    lst_ndx = j;
                    found_nb = true;
                } else {
                    v = v * 10 + c.to_digit(10).unwrap();
                    lst_ndx = j;
                }
                for (ndx, _) in &prev_stars {
                    if *ndx >= j - 1 && *ndx <= j + 1 {
                        if !ndc_to_add.contains(ndx) {
                            ndc_to_add.push(*ndx);
                        }
                    }
                }
                if j == len - 1 {
                    if was_star {
                        let (last_ndx, mut last_nbs): (i32, Vec<i32>) = stars.pop().unwrap();
                        last_nbs.push(v as i32);
                        stars.push((last_ndx, last_nbs));

                        for (ndx, nbs) in &mut prev_stars {
                            if ndc_to_add.contains(ndx) {
                                nbs.push(v as i32);
                            }    
                        }
                    }
                    else {
                        for ndx in &prev_ndc {
                            if *ndx >= fst_ndx - 1 && *ndx <= lst_ndx + 1 {
                                to_add = true;
                                if !ndxs_gears.contains(ndx) {
                                    ndxs_gears.push(*ndx);
                                }
                            }
                        }
                        if !to_add {
                            curr_nbs.push((v as i32, fst_ndx, lst_ndx));
                        }
                    }
                }
            } else {
                if c == '*' {
                    let mut numbers = Vec::new();
                    if found_nb {
                        numbers.push(v as i32);
                    }

                    let mut k = 0;
                    let mut ndc = Vec::new();
                    for (prev_v, prev_fst_ndx, prev_lst_ndx) in &prev_nb {
                        if j + 1 >= *prev_fst_ndx  && j <= prev_lst_ndx + 1 {
                            if !ndc.contains(&k)
                            {
                                numbers.push(*prev_v);
                                ndc.push(k)
                            }
                        }
                    k += 1;
                    }
                    for nxd in ndc.iter().rev() {
                        prev_nb.remove(*nxd);
                    }
                    was_star = true;
                    curr_ndc.push(j);
                    stars.push((j, numbers));  
                } else {
                    if found_nb {
                        for (ndx, nbs) in &mut prev_stars {
                            if ndc_to_add.contains(ndx) {
                                nbs.push(v as i32);
                            }
                        }
                        if !to_add {
                            curr_nbs.push((v as i32, fst_ndx, lst_ndx));
                        }
                        if was_star {
                            let (last_ndx, mut last_nbs) = stars.pop().unwrap();
                            last_nbs.push(v as i32);
                            stars.push((last_ndx, last_nbs));
                        }
                    }
                    was_star = false;
                    to_add = false;
                }
                found_nb = false;
                ndc_to_add = Vec::new();
            }
            j += 1;
        }
        prev_nb = curr_nbs.clone();
        prev_ndc = curr_ndc.clone();

        for (_, nbs) in &prev_stars {
            if nbs.len() == 2 {
                sum += nbs[0] * nbs[1];
            }
        }
        prev_stars = stars.clone();
    }

    for (_, nbs) in &prev_stars {
        if nbs.len() == 2 {
            sum += nbs[0] * nbs[1];
        }
    }

    println!("{sum}");
}
