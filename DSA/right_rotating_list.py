nums = []

stop = int(input("Enter the number of elements you want to enter: "))

while True:
    n = int(input("Enter the number: "))
    nums.append(n)

    if len(nums)==stop:
        break

print("The list of elements you entered: ",nums)

# [1,2,3,4,5] --> [5,1,2,3,4]
# [0,1,2,3,4]

def right_rotation(nums):
    m = len(nums)
    temp  = nums[m-1]
    for i in range(m-1,0,-1):
        nums[i] = nums[i-1]
    nums[0] = temp
    return nums

right_rotation(nums)
print("The right shifted list: ",nums)

