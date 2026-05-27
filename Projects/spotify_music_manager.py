import json

def load_data():
    try:
        with open('spotify.txt' as 'r') as file:
        return json.load(file)
    except FileNotFoundError:
        return []

def list_song(songs)


while True:
    print("\n SPOTIFY MUSIC MANAGER")
    print("1. List all songs")
    print("2. Add a song")
    print("3. Update a song details")
    print("4. Delete a song from playlist")
    print("5. Exit the app")

    choice = input("Enter your choice: ")
    match choice:
          case '1':
              list_song(songs)
          case '2':
              add_song(songs)
          case '3':
              update_song(songs)
          case '4':
              delete_song(songs)
          case '5'