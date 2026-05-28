a = int(input("Enter a number: "))

try: 
    print(10/a)

except Zero_Division_Error:
    print("Sorry! Enter a number greater or less than 0")
    
