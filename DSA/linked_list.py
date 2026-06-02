class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    # Insert at the end
    def append(self, value):
        new_node = Node(value)

        if self.head is None:
            self.head = new_node
            return
        else:
            current = self.head
            while current.next != None:
                current = current.next

        current.next = new_node

    # Insert at the beginning
    def prepend(self, value):
        new_node = Node(value)
        new_node.next = self.head
        self.head = new_node

    # Delete first occurrence of a value
    def delete(self, value):
        if self.head is None:
            return

        if self.head.val == value:
            self.head = self.head.next
            return

        current = self.head

        while current.next:
            if current.next.val == value:
                current.next = current.next.next
                return
            current = current.next

    # Search for a value
    def search(self, value):
        current = self.head

        while current:
            if current.val == value:
                return True
            current = current.next

        return False

    # Display the linked list
    def display(self):
        current = self.head

        while current:
            print(current.val, end="")
            if current.next:
                print(" --> ", end="")
            current = current.next

        print()

    # Length of linked list
    def length(self):
        count = 0
        current = self.head

        while current:
            count += 1
            current = current.next

        return count


ll = LinkedList()

ll.append(1)
ll.append(2)
ll.append(3)
ll.append(4)

print("Linked List:")
ll.display()

print("Length:", ll.length())

print("Search 3:", ll.search(3))
print("Search 10:", ll.search(10))

ll.prepend(0)
print("After prepend:")
ll.display()

ll.delete(2)
print("After deleting 2:")
ll.display()