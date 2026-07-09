class MinStack(object):

    def __init__(self):
        self.stack = []
        self.minStack = []

    def push(self, value):
        self.stack.append(value)
        if not self.minStack or value <= self.minStack[-1]:
            self.minStack.append(value)

    def pop(self):
        if self.stack[-1] == self.minStack[-1]:
            self.minStack.pop()
        self.stack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.minStack[-1]