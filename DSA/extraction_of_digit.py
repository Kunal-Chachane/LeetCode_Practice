num = int(input("Enter a number: "))

def extract_number(num):
    if num == 0:
        return

    last_digit = num % 10
    print("Digit:", last_digit)

    extract_number(num // 10)
