# Day 15

To tackle this problem, I decided to go through each Sensor and compute two distances :
  - The distance from its closest beacon
  - The distance from the closest point at y=Y= 2 000 000

There are 3 distincs cases :
  - The distance to the beacon is greater than the distance to the point at y=Y (see sensor S1 in the picture) -> we get the positions closer than the beacon AND at y=Y. We store the corresponding interva
  - The distance to the beacon is inferior to the distance to the point at y=Y (see sensor S2 in the picture) -> we neglect this sensor
  - The distance to the beacon is greater than the distance to the point at y=Y BUT either the beacon or the sensor is at y=Y (see sensor S3 in the picture) -> we do the same as for case 1 but we also store the position of the element which is at y=Y. We will substract one to the final result
  
  Finally, we merge the retrieved intervals and print the sum of their lenght (minus the potential elements coming from case 3)
  
  For Part 2, we do the same thing but 4 000 000 times, It takes about 4s.
