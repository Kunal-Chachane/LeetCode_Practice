nums = []

stop = int(input("Enter the number of elements you want to enter: "))
while len(nums) < stop:
    n = int(input("Enter the element: "))
    nums.append(n)
target = int(input("Enter the target sum: "))

result = []

def seq_from_target(index, current_sum, subset):
    if index == len(nums):
        if current_sum == target:
            result.append(subset.copy())
        return

    subset.append(nums[index])
    seq_from_target(index + 1, current_sum + nums[index], subset)

    subset.pop()
    seq_from_target(index + 1, current_sum, subset)

seq_from_target(0, 0, [])

print("Subsequences with target sum:")
for subseq in result:
    print(subseq)