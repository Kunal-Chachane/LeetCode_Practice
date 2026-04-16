age1 = int(input("Enter the age of person 1: "))
age2 = int(input("Enter the age of person 2: "))
age3 = int(input("Enter the age of person 3: "))

if age1>age2 and age1>age3:
    print("The person 1 is oldest.")
elif age2>age3 and age2>age1:
    print("The person 2 is oldest.")
elif age3>age1 and age3>age1:
    print("The person 3 is oldest.")