class Solution(object):
    def levelOrder(self, root):
        if root == None:
            return []
        ans = []
        q = deque([root])
        while q:
            level = []
            for i in range(len(q)):
                node = q.popleft()
                level.append(node.val)

                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            ans.append(level)
        return ans