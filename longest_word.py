def longest_word(filename):
    with open(filename, "r") as f:
        words = f.read().split()
        
    longest = 0
    for w in words:
        if len(w) > longest:
            longest = len(w)

    result = []
    for w in words:
        if len(w) == longest:
            result.append(w)

    return result


print(longest_word("test.txt"))
