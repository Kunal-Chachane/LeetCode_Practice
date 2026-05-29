num = int(input("Enter the number: "))

freq = {}

while num > 0:
    digit = num % 10

    if digit in freq:
        freq[digit] += 1
    else:
        freq[digit] = 1

    num = num // 10

print(freq)