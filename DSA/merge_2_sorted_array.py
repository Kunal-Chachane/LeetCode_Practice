num1 = []
num2 = []

stop_num1 = int(input("Enter the number of element you want to enter in array1: "))
while True:
   n1 = int(input("Enter the element: "))
   num1.append(n1)
   if len(num1)==stop_num1:
      break

print("Array 1: ",num1)

stop_num2 = int(input("Enter the number of element you want to enter in array2: "))

while True:
   n2 = int(input("Enter the element: "))
   num2.append(n2)
   if len(num2)==stop_num2:
      break
print("Array 2: ",num2)
def solution(num1, num2):
    result = []

    for x in num1:
        if x not in result:
            result.append(x)

    for x in num2:
        if x not in result:
            result.append(x)

    for i in range(0,len(result)-1):
        for j in range(i+1,len(result)):
            if result[i] > result[j]:
             result[i],result[j] = result[j],result[i]
        i=i+1
        j=j+1
    return result

sorted_array = solution (num1,num2)

print("The sorted array without duplicate element is: ",sorted_array)