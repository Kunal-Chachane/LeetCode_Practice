stop = int(input("Enter the number of elements you want to enter : "))
nums = []
while True:
    n= int(input("Enter the elements: "))
    nums.append(n)
    if len(nums) == stop:
        break

def selection_sort(nums):
    for i in range(0,len(nums)):
        index = i
        for j in range(i+1,len(nums)):
            if nums[index]>nums[j]:
                nums[index],nums[j]=nums[j],nums[index]
    return nums
print(selection_sort(nums))