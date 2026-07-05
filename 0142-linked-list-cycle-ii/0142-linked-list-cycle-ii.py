class Solution(object):
    def detectCycle(self, head):
        slow = head
        fast = head
        found = False

        while fast is not None and fast.next is not None:
            slow = slow.next
            fast = fast.next.next

            if slow == fast:
                found = True
                break

        if not found:
            return None

        slow = head

        while slow != fast:
            slow = slow.next
            fast = fast.next

        return slow