class Solution(object):
    def leafSimilar(self, root1, root2):
        if self.leaves(root1) == self.leaves(root2):
            return True
        return False

    def leaves(self, root):
        if root == None:
            return []

        if root.left == None and root.right == None:
            return [root.val]
        return self.leaves(root.left) + self.leaves(root.right)