import random
import string

passwords = {}

try:
    with open("password.txt","r") as file:
        for line in line:
            website,pwd = line.strip().split(" : ")
            passwords[website] = pwd
except:
    pass

def generate_pass():
    chars = string.ascii_lowercase +string.digits + "!@#$%^&*"
    password = "".join(random.choice(chars) for i in range(8))
    return password

while True:
     print("----- PERSONAL PASSWORD GENERATOR -----")
     print("\n1. Save Password")
     print("2. View Password")
     print("3. Generate Password")
     print("4. Exiting....")

     choice = int(input("Enter your choice:"))

     if choice == 1:
         site = input("Enter your site: ")