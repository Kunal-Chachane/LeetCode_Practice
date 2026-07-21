class Solution(object):
    def isBalanced(self, root):
        return self.height(root) != -1

    def height(self, root):
        if root == None:
            return 0
        left = self.height(root.left)
        right = self.height(root.right)

        if left == -1 or right == -1:
            return -1

        if abs(left - right) > 1:
            return -1
        return 1 + max(left, right)