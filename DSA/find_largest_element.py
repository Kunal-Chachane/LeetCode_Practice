def largest_ele(num):
    large = num[0]
    for i in range(0,len(num)):
        if(num[i]>large):
            large = num[i]
    return large
num = [1,2,3,4,5]
print(largest_ele(num))

