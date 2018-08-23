# AirPPT

AirPPT is a program to allow you to go from powerpoint slide to working (workable) HTML. No dirty stuff. 

It was built from scratch. Type friendly, and extensible. Read here 

### Quick Start

You can use this template [powerpoint](https://github.com/rlingineni/airppt/blob/master/sample.pptx) and run through the slides to see the different outputs.

```
git clone https://github.com/rlingineni/airppt

cd airppt

npm install 

--- add your pptx that you want to convert in this folder ---

node main.js -i template.pptx 

```

Here are the params for the program:

| Args     | Value           | Desc. | Default
| ------------- |:-------------:| -----|
| [--input] [i] |powerpoint file name| 
| [--slide][-s]     | 2 | The slide number you want to generate HTML/CSS for | 1 |
| [--position][-p]     | `grid` or `abs` |  If you choose grid, the html element layout will be column row based, and absolute is coordinate based| `grid`|


4. Check the contents of the `output` folder. It should have an index.html and an abs.css (or grid.css) depending on how you wanted the elements to be laid out.

##### Making your Own UI Powerpoint
1. Create a blank powerpoint, call it whatever.

2. Delete everything on the slides, no placeholders or anything (a blank canvas).

3. Add some shapes. At the moment we really only support rectangles. Add some text. Colors.

4. Copy pasta some images from the internet to add some flare.

5. Add a 'textbox', note how they are different than rectangles (usually transparent and no outline)

### TO-DO

- Make a global NPM CLI
- Add more renderers that convert shapes (rectangle, shape, textbox)


### More Info:
Check out the wiki for some background, contributing and how this works.


