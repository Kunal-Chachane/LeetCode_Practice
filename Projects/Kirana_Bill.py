result = 0
while (True):
    cost = input("Enter the cost price of item (or 'q' to quit): ")

    if cost != 'q':
        result = result + int(cost)
        print(f"The total cost estimated is: {result}")
    else:
        print(f"Final Total: {result}")
        print("Thanks for shopping with us.")
        break
