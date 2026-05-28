List = ['Apple','Banana','Cherry']
List[2] = 'Blueberry'
print(List)

List.append('Grape')
print(List)

List.insert(4,"Pineapple")
print(List)

List_2 = ['Pomegrenade','Kiwi']
List.extend(List_2)
print(List)

List.remove("Kiwi")
print(List)

List.pop(2)
print(List)

List.clear
print(List)

a = [1,2,3]
b = [4,5]
result = a + b +[6]
print(result)