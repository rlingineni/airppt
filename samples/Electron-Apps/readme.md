## Going from AirPPT to Electron

1.  Generate your HTML/CSS files using AirPPT. Read instructions [here](#)

2.  Checkout this [getting started](https://electronjs.org/docs/tutorial/first-app) guide with electron, if you've never used it before. Replace the path to `index.html` in `main.js` with the with one AirPPT generated

3.  Update the window settings for absolutely positioned items:

```
 win = new BrowserWindow({width: 1200, height: 720})
```

4.  run

```
electron .
```

That's it! Checkout the electron samples in this repo.

### Examples:

Alphabetter - Application that cycles through the alphabet
