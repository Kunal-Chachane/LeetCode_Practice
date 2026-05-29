num = int(input("Enter the number you want to check the palindrome: "))

original = num
result = 0

while num > 0:
    digit = num % 10
    result = result * 10 + digit
    num = num // 10

if original == result:
    print("Yes it is an Palindrome")
else:
    print("Not an Palindrome")