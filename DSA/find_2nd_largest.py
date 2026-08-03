nums = []
stop = int(input("Enter how many element you want to enter: "))
while True:
    n = int(input("Enter a number: "))
    nums.append(n)
    if len(nums) == stop:
        break

print(nums)

def sec_largest(nums):
    largest = float("-inf")
    slargest = float("-inf")
    for i in range(0,len(nums)):
        if nums[i]>largest:
            slargest = largest
            largest = nums[i]
    return slargest

print(sec_largest(nums))
