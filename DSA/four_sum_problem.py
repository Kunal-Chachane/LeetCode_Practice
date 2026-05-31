nums = []
stop = int(input("Enter the number of elements you want to enter: "))

while True:
    n = int(input("Enter the element: "))
    nums.append(n)
    if len(nums)==stop:
        break

def four_sum_solu(nums):
    m = len(nums)
    result = set()

    for i in range(0,m - 3):
        for j in range(i + 1, m - 2):
            for k in range(j + 1, m-1):
                for l in range(k + 1, m):
                 if nums[i] + nums[j] + nums[k] + nums[l] == 0:
                    temp= tuple(sorted([nums[i], nums[j], nums[k], nums[l]]))
                    result.add(temp)

    return list(result)

result = four_sum_solu (nums)
print("The set of elements are: ",result)
