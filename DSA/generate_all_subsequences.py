nums = []

stop = int(input("Enter the number of elements you want to enter: "))

while len(nums) < stop:
    n = int(input("Enter the element: "))
    nums.append(n)

print("List:", nums)

result = []

def gen_all_subsequence(index, subset):
    if index >= len(nums):
        result.append(subset.copy())
        return
    subset.append(nums[index])
    gen_all_subsequence(index + 1, subset)
    subset.pop()
    gen_all_subsequence(index + 1, subset)

gen_all_subsequence(0, [])

print("All subsequences:")
for subseq in result:
    print(subseq)