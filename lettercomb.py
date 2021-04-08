import time
import collections
from itertools import product
from collections import Counter
from nltk.corpus import words
from nltk.corpus import wordnet
while True:
    i = 0
    x = 0
    listOutput = []
    listDictFilter = []
    string = input("Enter string: ")
    minimum_length = int(input("Enter minimum combination length: "))
    maximum_length = int(input("Enter maximum combination length: "))
    duplicates = str(input("Leave out duplicate charactered combinations? (y/n): "))
    
    if duplicates == 'y':
        for length in range(minimum_length, maximum_length + 1):
            for combo in product(string, repeat=length):
                val = ''.join(combo)
                if len(set(val)) == len(val):
                    i = i + 1
                    listOutput.append(val)
                    print('Combo ' + str(i) + ': ' + val)

        print('There are ' + str(i) + ' combinations of the string ' + string + '!')
    elif duplicates == 'n':
        for length in range(minimum_length, maximum_length + 1):
            for combo in product(string, repeat=length):
                val = ''.join(combo)
                i = i + 1
                listOutput.append(val)
                print('Combo ' + str(i) + ': ' + val)

        print('There are ' + str(i) + ' combinations of the string ' + string + '!')
    else:
        print('Input not understood.')
        
    time.sleep(2)

    dictcheck = str(input('Run dictionary check? (y/n): '))

    if dictcheck == 'y':
        garbage = []
        for j in listOutput:

            wordexists = j.lower() in (string.lower() for string in words.words())

            print(wordexists)
            if wordexists == False:
                garbage.append(j)
            else:
                print("Found " + j)

        print('removing ', garbage)
        listDictFilter = [k for k in listOutput if k not in garbage]
        print('remaining ', listDictFilter)

        time.sleep(1)
        

        for x in range(0, len(listDictFilter)):
            listOutputDefinition = wordnet.synsets(str(listDictFilter[x]))
            
            print('Combo ' + str(x + 1) + ': ' + listDictFilter[x])
            for y in range(0, len(listOutputDefinition)):
                print('Definition ' + str(y + 1) + ": " + listOutputDefinition[y].definition())
                print('Examples ' + str(y + 1) + ": " + str(listOutputDefinition[y].examples()))

        print('There are ' + str(len(listDictFilter)) + ' combinations of the string ' + string + '!')
    elif dictcheck == 'n':
        continue
    else:
        print('Input not understood.')

    time.sleep(3)
    
    again = str(input('Run again? (y/n): '))

    if again == 'y':
        continue
    elif again == 'n':
        print("Goodbye")
        break
    else:
        print('Input not understood.')
