class Solution:
    def asteroidCollision(self, asteroids):
        n = len(asteroids)
        st = []
        for i in range(n):
            if asteroids[i] > 0:
                st.append(asteroids[i])

            else:
                while st and st[-1] > 0 and st[-1] < abs(asteroids[i]):
                    st.pop()
                if st and st[-1] == abs(asteroids[i]):
                    st.pop()
                elif not st or st[-1] < 0:
                    st.append(asteroids[i])
        return st