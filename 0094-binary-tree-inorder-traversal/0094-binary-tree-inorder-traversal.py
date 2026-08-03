class Solution(object):
    def __init__(self):
        self.result = []
    def inorderTraversal(self, root):
        if root == None:
            return self.result
        self.inorderTraversal(root.left)
        self.result.append(root.val)
        self.inorderTraversal(root.right)
        return self.result