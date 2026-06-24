import os
import subprocess
from datetime import datetime, timedelta

# ==========================
# Configuration
# ==========================
REPO_PATH = r"C:\Users\hp\OneDrive\Desktop\NOTES\Python Practice"   # Change this
BRANCH = "main"

START_DATE = "2026-06-24"
END_DATE = "2026-06-26"

COMMITS_PER_DAY = 2

FILE_NAME = "contributions.txt"
# ==========================


os.chdir(REPO_PATH)

start = datetime.strptime(START_DATE, "%Y-%m-%d")
end = datetime.strptime(END_DATE, "%Y-%m-%d")

current = start

while current <= end:
    date_str = current.strftime("%Y-%m-%d")

    for i in range(COMMITS_PER_DAY):

        with open(FILE_NAME, "a") as f:
            f.write(f"{date_str} Commit {i+1}\n")

        subprocess.run(["git", "add", FILE_NAME], check=True)

        env = os.environ.copy()
        commit_time = f"{date_str} 12:{i:02d}:00"

        env["GIT_AUTHOR_DATE"] = commit_time
        env["GIT_COMMITTER_DATE"] = commit_time

        subprocess.run(
            ["git", "commit", "-m", f"Contribution {i+1} on {date_str}"],
            env=env,
            check=True
        )

    current += timedelta(days=1)

subprocess.run(["git", "push", "origin", BRANCH], check=True)

print("Done!")