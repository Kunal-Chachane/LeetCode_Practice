stop = int(input("Enter the number of elements you want to enter : "))
nums = []
while True:
    n= int(input("Enter the elements: "))
    nums.append(n)
    if len(nums) == stop:
        break

    def sortColors(nums):
        n = len(nums)
        for i in range(n):
            min_index = i
            for j in range(i + 1, n):
                if nums[j] < nums[min_index]:
                    min_index = j
            nums[i], nums[min_index] = nums[min_index], nums[i]

        return nums
    
print(sortColors(nums))