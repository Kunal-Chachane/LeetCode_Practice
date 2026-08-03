class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, value):
        new_node = Node(value)

        if self.head is None:
            self.head = new_node
            return

        current = self.head
        while current.next:
            current = current.next

        current.next = new_node

    def create_cycle(self, pos):
        """
        Connect the last node to the node at index pos.
        pos = -1 means no cycle.
        """
        if pos == -1:
            return

        cycle_node = None
        current = self.head
        index = 0

        while current.next:
            if index == pos:
                cycle_node = current
            current = current.next
            index += 1

        if index == pos:
            cycle_node = current

        if cycle_node:
            current.next = cycle_node

    def has_cycle(self):
        slow = self.head
        fast = self.head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

            if slow == fast:
                return True

        return False


# User Input
n = int(input("Enter number of nodes: "))

ll = LinkedList()

for i in range(n):
    value = int(input(f"Enter node {i+1}: "))
    ll.append(value)

pos = int(input(
    "Enter index to connect last node to (-1 for no cycle): "
))

ll.create_cycle(pos)

if ll.has_cycle():
    print("Cycle detected")
else:
    print("No cycle detected")