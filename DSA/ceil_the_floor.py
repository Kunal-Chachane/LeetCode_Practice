nums = []
print("NOTE: Enter elements in sorted order")
stop = int(input("Enter the number of elements you want to enter: "))

while len(nums) < stop:
    n = int(input("Enter the element: "))
    nums.append(n)

print("Array:", nums)

target = int(input("Enter the target element: "))

# [1,3,5,7,9]

def ceil_floor(nums, target):
    left, right = 0, len(nums) - 1
   
    floor = float("-inf")
    ceil = float("inf")

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
           floor = target
           ceil = target

        elif nums[mid] < target:
            floor = nums[mid]
            left = mid + 1

        else:
            ceil = nums[mid]
            right = mid - 1

    return floor, ceil

result = ceil_floor(nums, target)

print("The floor and ceil of the target is : ",result)