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

# Concanating two strings
A = "Hello"
B = "World"
print(A+ " " +B)