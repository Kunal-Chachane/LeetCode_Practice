import random

easy = [ "apple",
         "cat",
         "banana",
         "grape",
         "car"
        ]

medium = [  "zebra",
            "green",
            "india",
            "Kiwi",
            "May"
         ]

hard = [ "elephant",
         "Iceman",
         "germany",
         "pentaloon",
         "pomegrenade"
        ]


print("Welcome to the word guessing game!")
print("Select the difficulty mode (easy / medium / hard) \n")

choice = input("select the mode: ").lower()

if choice == easy: 
    secret = choice.random(easy)
elif choice == medium:
    secret = choice.random(medium)
elif choice == hard:
    secret = choice.random(hard)
else:
    print("Invaid choice! selecting default easy mode")
    secret = choice.random(easy)

attempt = 0;
print("Guess the sceret word")
hint = ""

