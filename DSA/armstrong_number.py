num = int(input("Enter an number to if it is an armstrong number or not: "))
original = num
result = 0
count = 0

#Count the digits
temp = num
while temp > 0:
    temp //= 10
    count += 1

# Calculate armstrong value
temp = num
while temp >0:
    digit = temp %10
    result += digit ** count
    temp = temp // 10

if original == result:
    print("The given number is an armstrong number")
else:
    print("The given number is not an armstrong number")

print(result)