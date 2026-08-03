nums = []

stop = int(input("Enter the number of elements you want to enter: "))
while True:
   n = int(input("Enter the element: "))
   nums.append(n)
   if len(nums)==stop:
      break
   
  # [1,2,3,4,5]

def linear_search(target):
   m = len(nums)
   for i in range(0,m):
      if nums[i] == target:
         return i

target = int(input("Enter the target element: "))
result = linear_search(target)

print("The target element is in location: ",result)