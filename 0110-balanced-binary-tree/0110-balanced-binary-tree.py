class Solution(object):
    def isBalanced(self, root):
        if root == None:
            return True
        left = self.height(root.left)
        right = self.height(root.right)
        if abs(left - right) > 1:
            return False
        return self.isBalanced(root.left) and self.isBalanced(root.right)

    def height(self, root):
        if root == None:
            return 0
        left = self.height(root.left)
        right = self.height(root.right)
        return 1 + max(left, right)