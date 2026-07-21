class Solution(object):
    def preorderTraversal(self, root):
        ans = []
        def preorder(node):
            if node == None:
                return
            ans.append(node.val)
            preorder(node.left)
            preorder(node.right)
        preorder(root)
        return ans