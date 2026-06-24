
def func(sum,i,n):
    if i>n:
        return sum
    else:
        sum = sum + i
        return func(sum,i+1,n)

result = func(0,1,10)
print(result)