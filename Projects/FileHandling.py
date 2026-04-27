from pathlib import Path

def readfilefromfolder():
    path = Path('x')  
    items = list(path.rglob('*'))
    for i, item in enumerate(items):
        print(f"{i+1} : {item}")

def createfile():
    try:
        readfilefromfolder()
        name = input("Enter the file name: ")
        p = Path(name)

        if not p.exists():
            with open(p, "w") as f:
                data = input("Enter the data you want to write: ")
                f.write(data)
                print("File has been created successfully!")
        else:
            print(f"The file {name} already exists!")

    except Exception as err:
        print(f"Error occurred: {err}")

def readfile():
    name = input("Enter file name to read: ")
    p = Path(name)

    if p.exists():
        with open(p, "r") as f:
            print("\nFile content:\n")
            print(f.read())
    else:
        print("File does not exist!")

def updatefile():
    name = input("Enter file name to update: ")
    p = Path(name)

    if p.exists():
        with open(p, "a") as f:
            data = input("Enter data to append: ")
            f.write("\n" + data)
            print("File updated successfully!")
    else:
        print("File does not exist!")

def deletefile():
    name = input("Enter file name to delete: ")
    p = Path(name)

    if p.exists():
        p.unlink()
        print("File deleted successfully!")
    else:
        print("File does not exist!")

print("Press 1 for creating a file")
print("Press 2 for reading a file")
print("Press 3 for updating a file")
print("Press 4 for deleting a file")

check = int(input("Enter your choice: "))

while True:
    try:
        check = int(input("Enter your choice: "))

        if check == 1:
            createfile()
        elif check == 2:
            readfile()
        elif check == 3:
            updatefile()
        elif check == 4:
            deletefile()
        elif check == 5:
            print("Exiting program...")
            break
        else:
            print("Invalid choice!")

    except ValueError:
        print("Please enter a valid number!")
