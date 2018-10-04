# AirPPT

AirPPT is a program to allow you to go from powerpoint slide to working (workable) HTML and CSS. It handles shape conversions and css placements. Just drag, drop, and build a simple HTML UI.

It was built from scratch to be extensible. Read on to get started or the [wiki](https://github.com/rlingineni/airppt/wiki) to understand how it works and adding your own elements to be supported.


### Quick Start

```
git clone https://github.com/rlingineni/airppt
cd airppt
npm install
npm run build
cd built

node main.js -i sample.pptx -s 2 //you can change sample ppt, just put your pptx in the root directory

cd output //see the output html files
ls output
```

Open an issue if it didn't work.

Here are the params for the program:

| Long Args |   Short Arg          |      Value      | Desc.                                                                                                  | Default |
| ---------------- | --------|-------------| ------------------------------------------------------------------------------------------------------ | ------- |
| --input| -i    |   sample.pptx   | The name of the powerpoint file that sits in the folder                                                |
| --slide |-s    |        2        | The slide number you want to generate HTML/CSS for                                                     | 1       |
| --pos| -p | `grid` or `abs` | If you choose grid, the html element layout will be column row based, and absolute is coordinate based | `abs`  |

4. Check the contents of the `output` folder. It should have an index.html and an abs.css (or grid.css) depending on how you wanted the elements to be laid out.


### TO-DO:

I wish I had more time for this project. Willing to help anyway I can if anyone wants to tackle one of these

- Make a global NPM CLI
- Support configurable Output and Input Path
- Add more renderers that convert shapes
- Add custom extensions that can add elements like iframes

### Supported Elements

| PPT Element | Supported | Attributes            | Notes |
|-------------|-----------|-----------------------|-------|
|Rectangle| Yes| Text, Borders, Lines, ColorFill,ImageFill |       |  
|Triangle| Yes| Text, Borders, Lines, ColorFill,ImageFill |       | 
|Ellipse| Yes| Text, Borders, Lines, ColorFill,ImageFill |       |  
|TextBox| Yes| Borders, Lines, ColorFill |Textboxes are converted to HTML Input Boxes|  
|Images | Yes | LocalImages, Images from Online | No image edits are preserved, only sizes |

### More Info:

Check out the [wiki](https://github.com/rlingineni/airppt/wiki) for some background, contributing and how this works.
