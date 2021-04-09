import time
import collections
from itertools import product
from collections import Counter
from nltk.corpus import words
from nltk.corpus import wordnet

#listDictFilter = []

def main():
    while True:

        #x = 0
        listOutput = []
        string = input("Enter string: ")
        minimum_length = int(input("Enter minimum combination length: "))
        maximum_length = int(input("Enter maximum combination length: "))
        duplicates = str(input("Leave out duplicate charactered combinations? (y/n): "))
        filtergibberish = str(input("Leave out gibberish? (y/n): "))
        
        listOutput = dothecombobaby(string, minimum_length, maximum_length, duplicates, filtergibberish, listOutput)
            
        time.sleep(2)

        dictcheck = str(input('Run dictionary check? (y): '))

        if dictcheck == 'y':
            lookitupbaby(string, listOutput, filtergibberish)
            
        #elif dictcheck == 'n':
            #do nothing
        # else:
        #     print('Input not understood.')

        time.sleep(3)
        
        again = str(input('Run again? (y/n): '))

        if again == 'y':
            continue
        elif again == 'n':
            print("Goodbye")
            break
        else:
            print('Input not understood.')
            break
    return

def dothecombobaby(string, minimum_length, maximum_length, duplicates, filtergibberish, listOutput):

        i = 0
        j = 0
        totalcombos = 0
        #Find the difference between maximum and minimum length
        lengthrange = maximum_length - minimum_length
        while lengthrange >= 0:
            totalcombos = totalcombos + (len(string) ** (maximum_length - lengthrange))
            lengthrange -= 1

        for length in range(minimum_length, maximum_length + 1):
            for combo in product(string, repeat=length):
                j = j + 1
                print ('Finding Valid Combinations... ' + str(j) + ' of ' + str(totalcombos), end="\r")
                val = ''.join(combo)
                if duplicates == 'y':
                    if len(set(val)) == len(val):
                        if filtergibberish == 'y':
                            
                            #Boolean
                            wordexists = val.lower() in (string.lower() for string in words.words())

                            if wordexists == False:
                                #progress
                                continue
                            else:
                                i = i + 1
                                listOutput.append(val)
                                print("                                                      \033[A")
                                print('Combo ' + str(i) + ': ' + val)
                        else:
                            i = i + 1
                            listOutput.append(val)
                            print("                                                      \033[A")
                            print('Combo ' + str(i) + ': ' + val)

                elif duplicates == 'n':
                    if filtergibberish == 'y':
                            
                        #Boolean
                        wordexists = val.lower() in (string.lower() for string in words.words())

                        if wordexists == False:
                            #progress
                            continue
                        else:
                            i = i + 1
                            listOutput.append(val)
                            print("                                                      \033[A")
                            print('Combo ' + str(i) + ': ' + val)
                    else:
                        i = i + 1
                        listOutput.append(val)
                        print("                                                      \033[A")
                        print('Combo ' + str(i) + ': ' + val)

                else:
                    print("                                                      \033[A")
                    print('Input not understood.')
                    break
                

        print('There are ' + str(i) + ' combinations of the string ' + string + '!')

        return listOutput

def lookitupbaby(string, listOutput, filtergibberish):

    garbage = []
    i = 0
    if filtergibberish != 'y':
        for result in listOutput:

            #Boolean
            wordexists = result.lower() in (string.lower() for string in words.words())

            i = i + 1

            print('Result ' + str(i) + ' of ' + (str(len(listOutput))) + ': ' + str(wordexists), end="\r")
            if wordexists == False:
                garbage.append(result)
            else:
                print("                                                      \033[A")
                print("Found " + result)

        
        print("                                                      \033[A")
        print('removing ', garbage)
        listDictFilter = [k for k in listOutput if k not in garbage]
        print('remaining ', listDictFilter)
    else:
        listDictFilter = [k for k in listOutput if k not in garbage]
        print('Gibberish already filtered...')

    time.sleep(1)
    
    print('Pulling Definitions...')

    for x in range(0, len(listDictFilter)):
        listOutputDefinition = wordnet.synsets(str(listDictFilter[x]))
        
        print('Combo ' + str(x + 1) + ': ' + listDictFilter[x])
        for y in range(0, len(listOutputDefinition)):
            print('Definition ' + str(y + 1) + ": " + listOutputDefinition[y].definition())
            print('Examples ' + str(y + 1) + ": " + str(listOutputDefinition[y].examples()))

    print('There are ' + str(len(listDictFilter)) + ' combinations of the string ' + string + '!')

    return 

main()