You can use AirPPT to for websites and web apps. Checkout the [alphabetter](https://github.com/rlingineni/airppt/tree/master/samples/alphabetter) example to see a letter traversing electron app. The generated source code powers the [UI](https://github.com/rlingineni/airppt/tree/master/samples/alphabetter/app).

You may build the UI from scratch using **Slide 2** of the [sample](https://github.com/rlingineni/airppt/blob/master/sample.pptx) deck. 

```
node main.js -i sample.pptx --slide 2
```

## Going from AirPPT to Electron

1.  Generate your HTML/CSS files using AirPPT. Read instructions [here](https://github.com/rlingineni/airppt)

2.  Checkout this [getting started](https://electronjs.org/docs/tutorial/first-app) guide with electron, if you've never used it before. 

Replace the path to `index.html` in your Electron app's `main.js` with the with the new index file AirPPT generated

3.  Update the window settings to match an absolutely positioned coordinate system:

```
 win = new BrowserWindow({width: 1200, height: 720})
```

4.  run

```
electron .
```

That's it! Add more electron samples to this repo.

### Examples:

[Alphabetter](https://github.com/rlingineni/airppt/tree/master/samples/alphabetter) - Application that cycles through the alphabet
