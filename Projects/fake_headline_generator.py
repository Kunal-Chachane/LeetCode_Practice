import random

subject = [
    "Kunal Chachane",
    "Rapper Drake",
    "Cow in Delhi",
    "Speaker Charlie Kirk",
    "A cat from mumbai",
]

actions = [
    "goes viral after shocking video",
    "accidentally trends worldwide",
    "sparks massive debate online",
    "reveals unexpected secret",
    "creates chaos at midnight",
]

places_or_things = [
    "on Instagram Live",
    "at a local street market",
    "during a live interview",
    "in the middle of traffic",
    "inside a luxury hotel",
]

while (True):
   
    a = random.choice(subject)
    b = random.choice(actions)
    c = random.choice(places_or_things)

    result = print(f"BREAKING NEWS: {a} {b} {c}")

    ans = input("Do you want to generate more headlines (yes / no ): ").strip().lower()
    if ans == "no":
        print("Thanks for using our fake headline generator!")
        break


 