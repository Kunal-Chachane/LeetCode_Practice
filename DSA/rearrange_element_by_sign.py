nums = []
print("NOTE: Enter elements in sorted order")
stop = int(input("Enter the number of elements you want to enter: "))

while len(nums) < stop:
    n = int(input("Enter the element: "))
    nums.append(n)

print("Array:", nums)

# [-1,-1,1,2,3]  [1,-1,2,-2,3,-3]
def ele_by_sign (nums,stop):
   result = [0]*stop
   m = len(nums)
   pos=0
   neg=1
   for i in range (0,m):
       if nums[i]>=0:
           result[pos] = nums[i]
           pos+=2
       else : 
            result[neg] = nums[i]
            neg+=2
   return result

result_final= ele_by_sign (nums,stop)

print(result_final)
