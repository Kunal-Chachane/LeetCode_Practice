import os

if __name__ == "__main__":
 while(True):
    x = input("Enter the speech: ")
    command = f'powershell -Command "Add-Type –AssemblyName System.Speech; ' \
              f'$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; ' \
              f'$speak.Speak(\'{x}\');"'
    os.system(command)