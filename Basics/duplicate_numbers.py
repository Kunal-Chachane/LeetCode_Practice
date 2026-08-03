arr = []
n = int(input("Enter number of elements: "))

for i in range(n):
    val = int(input("Enter element: "))
    arr.append(val)

found = False

for i in range(len(arr)):
    for j in range(i + 1, len(arr)):
        if arr[i] == arr[j]:
            print("Duplicate elements:")
            print(arr[i])
            found = True

if not found:
    print("No duplicates found.")