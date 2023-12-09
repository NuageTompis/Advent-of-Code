use std::fs::read_to_string;

fn main() {
    let mut hands: Vec<(i32, i32)> = Vec::new();
    let interval = 2 * 13u32.pow(5);

    let binding = read_to_string("./input.txt").unwrap();
    for line in binding.lines() {
        let card = line.split(" ").collect::<Vec<_>>();
        let hand = card[0];
        
        let mut jokers = 0;
        let mut cards:Vec<(u32, u32)> = Vec::new();
        for c in hand.chars() {
            let mut found = false;
            let card_value = match c {
                '2' => 1,
                '3' => 2,
                '4' => 3,
                '5' => 4,
                '6' => 5,
                '7' => 6,
                '8' => 7,
                '9' => 8,
                'T' => 9,
                'J' => 0,
                'Q' => 10,
                'K' => 11,
                'A' => 12,
                _ => 0,
            };
            if card_value == 0 {
                jokers += 1;
            }
            else {
                for i in 0..cards.len() {
                    if cards[i].0 == card_value {
                        cards[i].1 += 1;
                        found = true;
                        break;
                    }
                }
                if !found {
                    cards.push((card_value, 1));
                }
            }
        }

        sort_tuples(&mut cards);
        
        if cards.len() > 0
        {
            cards[0].1 += jokers;
        }
        else {
            cards.push((0, 5))
        }

        let shift;
        let unique = cards.len();
        if cards.len() == 1 {
            shift = 6;
        }
        else if unique == 2 {
            if cards[0].1 == 4 || cards[1].1 == 4 {
                shift = 5;
            }
            else {
                shift = 4;
            }
        }
        else if unique == 3 {
            let mut found = false;
            for i in 0..3 {
                if cards[i].1 == 3 {
                    found = true;
                    break;
                }
            }
            if !found {
                shift = 2;
            }
            else {
                shift = 3;
            }
        }
        else if unique == 4 {
            shift = 1;
        }
        else {
            shift = 0;
        }
        
        let strenght = hand_strenght(hand);
        let bid = card[1].parse::<i32>().unwrap();
        hands.push((strenght + (shift * interval as i32), bid));

    }

    hands.sort_by(|a, b| a.0.cmp(&b.0));
    let mut sum2 = 0;
    for i in 0..hands.len() {
        sum2 += hands[i].1 * (i as i32 + 1);
    }
    println!("{}", sum2);

}

fn hand_strenght(s: &str) -> i32 {
    let ranks = "J23456789TQKA";
    let mut value = 0;

    for (i, c) in s.chars().enumerate() {
        if let Some(index) = ranks.find(c) {
            value += (index as i32) * 13i32.pow((4 - i) as u32);
        }
    }

    value
}

fn sort_tuples(v: &mut Vec<(u32, u32)>) {
    v.sort_by(|a, b| {
        match b.1.cmp(&a.1) {
            std::cmp::Ordering::Equal => b.0.cmp(&a.0),
            ordering => ordering,
        }
    });
}
