use std::fs::read_to_string;
use std::time::Instant;
use std::collections::{HashMap, VecDeque};

fn main() {
    let start_time = Instant::now();
    
    let mut matrix: Vec<Vec<usize>> = Vec::new();
    let mut name_to_ndx: HashMap<&str, usize> = HashMap::new();

    let binding = read_to_string("./input.txt").unwrap();
    let mut found = 0;
    for line in binding.lines() {
        let parts: Vec<&str> = line.split(':').collect();
        let linked: Vec<&str> = parts[1].split(' ').skip(1).map(|w| w.trim()).collect();

        let (is_new, ndx): (bool, usize) =  if let Some(ndx) = name_to_ndx.get(parts[0]) {
            (false, *ndx)
        } else {
            name_to_ndx.insert(parts[0], found);
            found += 1;
            (true, found - 1)
        };

        for el in &linked {
            if let Some(el_ndx) = name_to_ndx.get(el) {
                matrix[*el_ndx].push(ndx);
            } else {
                name_to_ndx.insert(el, found);
                found += 1;
                matrix.push(vec![ndx]);
            }
        }

        let array = linked.into_iter().map(|s| name_to_ndx[s]).collect();
        if is_new {
            matrix.insert(ndx, array);
        } else {
            matrix[ndx].extend(array);
        }
    }

    let n = matrix.len();
    for i in 0..n-1 {
        for (r, i2) in matrix[i].iter().enumerate() {
            if i2 < &i {
                continue;
            }
            let mut new_mat = matrix.clone();
            new_mat[i].remove(r);
            new_mat[*i2].retain(|&x| x != i);
            let path = bfs(&new_mat, i, *i2, &Vec::new()).unwrap();
            for p in 0..path.len() - 1 {
                for q in p+1..path.len() {
                    new_mat[path[p]].retain(|&x| x != path[q]);
                    new_mat[path[q]].retain(|&x| x != path[p]);
                }
            }
            let reverse_path = bfs(&new_mat, *i2, i, &Vec::new()).unwrap();

            for j in 0..path.len() - 1 {
                for k in 0..reverse_path.len() - 1 {
                    if bfs(&matrix, i, *i2, &Vec::from([(i, *i2), (*i2, i), (path[j], path[j + 1]), (path[j + 1], path[j]), (reverse_path[k], reverse_path[k + 1]), (reverse_path[k + 1], reverse_path[k])])) == None {
                        println!(" in {:?}", start_time.elapsed());
                        return;
                    }
                }
            }
        }
    }
}

fn bfs(graph: &Vec<Vec<usize>>, start: usize, end: usize, forbidden_connections: &Vec<(usize, usize)>) -> Option<Vec<usize>> {
    let mut queue = VecDeque::new();
    let mut visited = vec![false; graph.len()];
    let mut parent = vec![usize::MAX; graph.len()];

    queue.push_back(start);
    visited[start] = true;

    while let Some(current) = queue.pop_front() {
        for &neighbor in &graph[current] {
            if !visited[neighbor] && !forbidden_connections.contains(&(current, neighbor)) {
                visited[neighbor] = true;
                parent[neighbor] = current;
                queue.push_back(neighbor);

                if neighbor == end {
                    let mut path = Vec::new();
                    let mut current = end;
                    while current != usize::MAX {
                        path.push(current);
                        current = parent[current];
                    }
                    path.reverse();
                    return Some(path);
                }
            }
        }
    }

    let mut k = 0;
    for el in &visited {
        if *el {
            k += 1;
        }
    }
    print!("{}", k * (visited.len() - k));
    None
}