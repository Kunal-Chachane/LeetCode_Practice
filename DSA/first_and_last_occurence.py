nums = []
stop = int(input("Enter the number of elements you want to enter: "))

while len(nums) < stop:
    n = int(input("Enter the element: "))
    nums.append(n)

def first_last(nums, target):
    first = -1
    last = -1

    for i in range(len(nums)):
        if nums[i] == target:
            if first == -1:
                first = i
            last = i

    return first, last

target = int(input("Enter the target element: "))
result = first_last(nums, target)

print("The first occurrence and last occurrence of target is:", result)