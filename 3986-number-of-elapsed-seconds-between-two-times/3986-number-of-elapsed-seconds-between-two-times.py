class Solution:
    def secondsBetweenTimes(self, startTime, endTime):

        startH = int(startTime[:2])
        startM = int(startTime[3:5])
        startS = int(startTime[6:8])

        endH = int(endTime[:2])
        endM = int(endTime[3:5])
        endS = int(endTime[6:8])

        startSeconds = startH * 3600 + startM * 60 + startS
        endSeconds = endH * 3600 + endM * 60 + endS

        return endSeconds - startSeconds