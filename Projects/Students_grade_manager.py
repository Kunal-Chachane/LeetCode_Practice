Student = {}

print("---- STUDENT GRADE MANAGER ----")
while True:
    print("1. Add student")
    print("2. View all students")
    print("3. View result")
    print("4. Exit")

    choice = int(input("Enter your choice: "))

    #Add student
    if choice == 1:
        name = input("Enter the name: ")
        cgpa = float(input("Enter the CGPA: "))
        Student[name] = cgpa
        print(f"The student {name} is successfully added")
    
    #View all students
    elif choice == 2:
        if not Student:
            print("No data is present")
        else:
            for name, cgpa in Student.items():
                print(f"{name} : {cgpa}")

    elif choice == 3:
         name = input("Enter the name: ")
         if name in Student:
            cgpa = Student[name]
            if cgpa>=6:
              print(f"{name} PASSED with CGPA {cgpa}")
            else:
                print(f"{name} FAILED with CGPA {cgpa}")
         else:
            print(f"No data found for {name}")
    elif choice == 4:
        print("Exiting the program!")
        break

    else:
        print("Enter valid input")