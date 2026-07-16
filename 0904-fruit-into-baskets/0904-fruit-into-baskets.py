class Solution:
    def totalFruit(self, fruits):
        my_set = {}
        left = 0
        right = 0
        n = len(fruits)
        max_length = 0
        while right < n:
            my_set[fruits[right]] = my_set.get(fruits[right], 0) + 1
            if len(my_set) > 2:
                my_set[fruits[left]] -= 1
                if my_set[fruits[left]] == 0:
                    del my_set[fruits[left]]
                left += 1
            if len(my_set) <= 2:
                max_length = max(max_length, right - left + 1)
            right = right + 1
        return max_length