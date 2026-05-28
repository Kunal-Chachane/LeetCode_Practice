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

attempt = 0
print("Guess the sceret word")

while True:
    guess = input(print("Enter the word: ")).lower()
    attempt += 1

    if guess == secret:
       print(f"Congratulations! You guessed the word in {attempt} attempts")
       break
hint = ""

