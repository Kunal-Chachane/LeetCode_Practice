def insertion_sort(num):
    n = len(num)

    for i in range(1,n):
        key = arr[i]
        for j in range(0,i-1):
