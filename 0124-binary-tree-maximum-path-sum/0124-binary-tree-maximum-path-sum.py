class Solution(object):
    def maxPathSum(self, root):
        self.ans = float("-inf")
        def dfs(root):
            if root == None:
                return 0

            left = dfs(root.left)
            right = dfs(root.right)

            if left < 0:
                left = 0

            if right < 0:
                right = 0

            self.ans = max(self.ans, root.val + left + right)
            return root.val + max(left, right)

        dfs(root)
        return self.ans