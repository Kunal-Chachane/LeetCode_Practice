"""
# Definition for a Node.
class Node(object):
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children
"""

class Solution(object):
    def preorder(self, root):
        if root == None:
            return []
        ans = [root.val]
        for i in root.children:
            ans += self.preorder(i)

        return ans
        