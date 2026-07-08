class Solution(object):
    def rotateString(self, s, goal):
        if len(s)!=len(goal):
            return False 
        result = s+s
        if goal in result:
            return True
        return False
        