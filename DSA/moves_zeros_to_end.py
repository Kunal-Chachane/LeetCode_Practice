nums = []

stop = int(input("Enter the number of elements you want to enter: "))

while True:
    n = int(input("Enter the element: "))
    nums.append(n)

    if len(nums)==stop:
        break

# [1,0,0,3,4,0]

def zeros_to_end(nums):
    m = len(nums)
    for i in range(0,m-1):
        for j in range(i+1,m):
            if nums[i] == 0:
                nums[i],nums[j] = nums[j],nums[i]
            
        i += 1
        j += 1
    return nums

result = zeros_to_end(nums)

print(result)