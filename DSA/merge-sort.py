arr = []

stop = int(input("Enter the number of elements you want to enter: "))
while True:
   n = int(input("Enter the element: "))
   arr.append(n)
   if len(arr)==stop:
      break
   
  # [1,2,3,4,5]

def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result += left[i:]
    result += right[j:]

    return result

print("Sorted:", merge_sort(arr))