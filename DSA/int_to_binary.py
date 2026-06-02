num = int(input("Enter an number: "))

def int_to_binary (num):
    temp = ""
    while num>0:
        if num%2 == 1:
            temp +="1"
        else:
            temp +="0"
        num//=2
    m = len(temp)
    return temp [m-1::-1]

result = int_to_binary (num)

print("The binary form of the given integer is : ",result)
