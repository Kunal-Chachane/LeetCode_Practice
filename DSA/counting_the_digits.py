# counting digits in logirathamic value

from math import log10

num = int(input("Enter the digit of log base 10: "))

def count_value(num):
    result = log10(num) + 1
    return result % 10   

print("Output:", count_value(num))
     