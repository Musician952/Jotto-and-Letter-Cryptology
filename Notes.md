Notes

Math

Case(1) If the repetition of letters are allowed than different combinations can be formed by 5 letters.

_ _ _ _ _

so for every letter in 5 letter word we have 26 options (Alphabets =26) of picking letters

then the possible combination is 26 x 26 x 26 x 26 x 26 (for 5 letters) so the answer is 11,881,376

Case (2) If the repetition of letters are not allowed than different combinations can be formed by 5 letters

_ _ _ _ _

so for every letters we have different options of picking letters ( its like you have to randomly pick a letter chose it for the letter position in word and remove this option for the next letter so you have one less options for successive letters and this goes on)

then the possible combination is 26 x 25 x 24 x 23 x 22 so the answer is 7,893,600.

- - - - -

theory - so if the above is true (tested true) then to find progress through our iterations, we need a formula that does these calculations with the minimum thru maximum requested lengths in mind. Basically, running the formula to with each possible length in mind and then adding all the possible combinations together to get the true sum.

Example - Our string (with 26 characters) is the alphabet ABCDEFGHIJKLMNOPQRSTUVWXYZ, minimum_length is 5 and maximum_length is 7, and duplicates are allowed. The forumla would be 26^5 + 26^6 + 25^7 to find our total possible combinations which is 11,881,376 + 308,915,776 + 8,031,810,176 = 8,352,607,328

If the terms are the same except duplicates are not allowed, then the formula would be (26 x 25 x 24 x 23 x 22) + (26 x 25 x 24 x 23 x 22 x 21) + (26 x 25 x 24 x 23 x 22 x 21 x 20)

Formula

#Find the difference between maximum and minimum length
lengthrange = maximum_length - minimum length
while lengthrange >= 0:
    totalcombos = totalcombos + (len(string) ** (maximum_length - lengthrange))
    lengthrange -= 1
