# AirPPT

### Get Started
###### Making a UI Powerpoint
1. Create a blank powerpoint, call it whatever.

2. Delete everything on the slides, no placeholders or anything (a blank canvas).

3. Add some shapes. At the moment we really only support rectangles. Add some text. Colors.

4. Copy pasta some images from the internet to add some flare.

5. Add a 'textbox', note how they are different than rectangles (usually transparent and no outline)

###### The program 
1. Clone/Download this project. 

2. Move the powerpoint from step one into this folder

2. CD and open the project in your Terminal. You want to be in the `built` folder

3. Run the program like this

```
node main.js -i whatevermypowerpoint.pptx 
```

You can also pass in additional params like:
[slide][s] - The slide number you want to generate HTML/CSS for
[position][p] - `grid` or `abs`. If you choose grid, the layout will be proportional (better for responsive designs)



4. Check the contents of the `output` folder. It should have an index.html and an abs.css (or grid.css) depending on how you wanted the elements to be laid out.


### More Info:
Check out the wiki for some background, contributing and how this works.
