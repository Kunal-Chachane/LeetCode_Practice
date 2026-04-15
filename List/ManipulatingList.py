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