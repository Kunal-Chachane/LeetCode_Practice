
class Solution(object):
    def repeatedSubstringPattern(self, s):
        doubled = s + s
        return s in doubled[1:-1]
