
def bubble_sort(num):
 for i in range(len(num)):
    for j in range(0,len(num)-1):
        if(num[j]>num[j+1]):
            num[j],num[j+1] = num[j+1],num[j]
        
num = [5,4,3,2,1]
bubble_sort(num)
print(num)