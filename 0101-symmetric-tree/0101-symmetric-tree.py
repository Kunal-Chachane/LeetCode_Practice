class Solution(object):
    def isSymmetric(self, root):
        if root == None:
            return True
        return self.check(root.left, root.right)

    def check(self, left, right):
        if left == None and right == None:
            return True

        if left == None or right == None:
            return False

        if left.val != right.val:
            return False

        return self.check(left.left, right.right) and self.check(left.right, right.left)