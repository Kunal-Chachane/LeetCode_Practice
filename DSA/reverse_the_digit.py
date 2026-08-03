num = int(input("Enter the number you want to reverse: "))
digits = []
while num > 0:
    digit = num % 10
    print(f"The next reversed digit is: {digit}")
    num //= 10
    digits.append(digit)

print("The resultant digit is:", digits)