n = [5,3,2,2,1,5,5,7,5,10]
m = [10,111,1,9,5,67,2]

hash_map = [0] * 112  
for num in n:
    hash_map[num] += 1

for num in m:
    if num < len(hash_map) and hash_map[num] > 0:
        print(num, "is present")
    else:
        print(num, "is not present")