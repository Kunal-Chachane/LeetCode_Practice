Str = "kunal Chachane is learning Python!"

# Reversing a String
print(Str[::-1])

# Finding existence of an element
print(Str.find("m"))   # returns index if found, -1 if not

# Capitalizing the string
print(Str.capitalize())

# Finding index of an element 
print(Str.index("u"))  # throws error if not found

# Capitalizing every letter of a string
print(Str.upper())

# Finding length of a String
print(len(Str))

# Printing using unicode
print("\u0434")

# Concatenating two strings
A = "Hello"
B = "World"
print(A + " " + B)

# Using f-string
price = 747583558
color = "Metallic blue"
fact = f"The price of Lamborghini is {price} and {color} is rare"
print(fact)

# Repeating a string X times
a = "Kunal "
result = a * 3
print(result)