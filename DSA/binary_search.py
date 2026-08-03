nums = []
print("NOTE: Enter elements in sorted order")
stop = int(input("Enter the number of elements you want to enter: "))

while len(nums) < stop:
    n = int(input("Enter the element: "))
    nums.append(n)

print("Array:", nums)

target = int(input("Enter the target element: "))

def binary_search(nums, target):
    lb = 0
    ub = len(nums) - 1

    while lb <= ub:
        mid = (lb + ub) // 2

        if nums[mid] == target:
            return mid

        elif nums[mid] > target:
            ub = mid - 1

        else:
            lb = mid + 1

    return -1

result = binary_search(nums, target)

if result != -1:
    print("Element found at index:", result)
else:
    print("Element not found in the array")