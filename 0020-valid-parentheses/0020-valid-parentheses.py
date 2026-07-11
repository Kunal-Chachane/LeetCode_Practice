class Solution:
    def isValid(self, s):
        stack = []

        for brackets in s:
            if brackets == "(" or brackets == "{" or brackets == "[":
                stack.append(brackets)

            else:
                if len(stack) == 0:
                    return False

                ch = stack.pop()

                if ((brackets == ")" and ch != "(") or 
                   (brackets == "}" and ch != "{") or 
                   (brackets == "]" and ch != "[")):
                    return False

        return len(stack) == 0