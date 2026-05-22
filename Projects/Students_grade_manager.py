Student = {}

try:
    with open("cgpa.txt", "r") as file:
        for line in file:
            name, cgpa = line.strip().split(":")
            Student[name] = float(cgpa)
except FileNotFoundError:
    pass  

def save_all():
    with open("cgpa.txt", "w") as file:
        for name, cgpa in Student.items():
            file.write(f"{name}:{cgpa}\n")

def add_student():
    name = input("Enter name: ")
    cgpa = float(input("Enter CGPA: "))
    Student[name] = cgpa
    save_all()
    print(f"{name} added successfully!")

def view_students():
    if not Student:
        print("No student data available.")
    else:
        print("\n---- ALL STUDENTS ----")
        for name, cgpa in Student.items():
            print(f"{name} : {cgpa}")

def update_student():
    name = input("Enter name to update: ")
    if name in Student:
        new_cgpa = float(input("Enter new CGPA: "))
        Student[name] = new_cgpa
        save_all()
        print(f"{name}'s CGPA updated successfully!")
    else:
        print(f"No student found with name {name}")

def delete_student():
    name = input("Enter name to delete: ")
    if name in Student:
        del Student[name]
        save_all()
        print(f"{name} deleted successfully!")
    else:
        print(f"No student found with name {name}")

def view_result():
    name = input("Enter name: ")
    if name in Student:
        cgpa = Student[name]
        if cgpa >= 7:
            print(f"{name} PASSED with CGPA {cgpa}")
        else:
            print(f"{name} FAILED with CGPA {cgpa}")
    else:
        print(f"No student found with name {name}")

print("---- STUDENT GRADE MANAGER ----")

while True:
    print("\n1. Add student (Create)")
    print("2. View all students (Read)")
    print("3. Update student (Update)")
    print("4. Delete student (Delete)")
    print("5. View Result")
    print("6. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        add_student()
    elif choice == 2:
        view_students()
    elif choice == 3:
        update_student()
    elif choice == 4:
        delete_student()
    elif choice == 5:
        view_result()
    elif choice == 6:
        print("Exiting...")
        break
    else:
        print("Invalid choice. Try again.")