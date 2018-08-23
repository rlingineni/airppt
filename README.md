# AirPPT

AirPPT is a program to allow you to go from powerpoint slide to working (workable) HTML. No dirty stuff.

It was built from scratch. Type friendly, and extensible. Read on to get started or the [wiki](https://github.com/rlingineni/airppt/wiki) to understand how it works.

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
| --pos| -p | `grid` or `abs` | If you choose grid, the html element layout will be column row based, and absolute is coordinate based | `grid`  |

4. Check the contents of the `output` folder. It should have an index.html and an abs.css (or grid.css) depending on how you wanted the elements to be laid out.


### TO-DO:

I wish I had more time for this project. Willing to help anyway I can if anyone wants to tackle one of these

- Make a global NPM CLI
- Support configurable Output and Input Path
- Add more renderers that convert shapes (rectangle, shape, textbox)

### More Info:

Check out the [wiki](https://github.com/rlingineni/airppt/wiki) for some background, contributing and how this works.
