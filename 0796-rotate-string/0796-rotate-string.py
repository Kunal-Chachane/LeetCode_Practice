class Solution(object):
    def rotateString(self, s, goal):
        if len(s)!=len(goal):
            return False 
        result = []
        temp = s
        for i in range(0,len(temp)):
           if temp==goal:
            return True
           temp = temp[-1]+temp[:-1]
        return False
        