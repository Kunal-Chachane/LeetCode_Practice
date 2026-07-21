class Solution(object):
    def postorder(self, root):
        if root == None:
            return []
        ans = []
        for child in root.children:
            ans += self.postorder(child)
        ans.append(root.val)
        return ans