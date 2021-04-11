# Plans for Future & Optional Contribution

End Goal: Have a working Jotto game where the user and the computer play in a match to guess each other's secret word. Eventually host the project on a server and develop a website for it.

# How to Play

Instructions:
https://en.wikipedia.org/wiki/Jotto#:~:text=Each%20player%20has%20a%20secret,words%20of%20all%20other%20players.

# To Do

**Rename the repository**

1. Develop an algorimth to cancel out the letters in the alphabet that cannot exist in the secret word.
2. Dive into threading and background processes for the combination algorithm.
3. Filter double results before running against dictionary
4. Add 'Unique' phrases count
5. Create Jotto.py
6. Create a custom user added words document for when computer cannot find phrases in its dictionary.
7. Make cryptology.py a callable background script
8. Add a backtrack feature to remove results with a set of cancelled characters and stop finding new results from that set of cancelled characters. (May not be possible for function to be directly embeded in cryptology.py, unless threading can be implemented)

# Known Issues

1. None
