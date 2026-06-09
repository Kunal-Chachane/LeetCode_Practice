paraen = input("Enter the sequence of parentheses: ")

def remove_paren(paraen):
    count = 0
    result = ""

    for ch in paraen:
        if ch == "(":
            if count > 0:
                result += ch
            count += 1
        else:
            count -= 1
            if count > 0:
                result += ch

    return result

final_result = remove_paren(paraen)

print("After removing outermost parentheses:", final_result)