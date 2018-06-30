# Air PPT

### Background

I'm constantly coming up with ideas for apps that will help me in my daily use. I'm a good programmer, but not so much a UI guy. It's tedious and it takes up a lot of my time. The perfectionist in me isn't happy when the buttons aren't aligned or colored correctly, and I spend much more anticipated time then expected tinkering with CSS and HTML Element than I want to.

### This project

Powerpoint's simple drag and drop interface makes it easy to prototype and demonstrate UIs. However, whenever we want to build the "real" thing, we have to startover as nothing ports over from our intial powerpoint elements except the colors and layouts that we manually input. Tools such as Sketch or [GrapeJS](https://grapesjs.com/) exist, but they come with a learning curve, a cost and bloat. Existing PPT2HTML projects exist, but they aren't designed to be extensible - just for display in a browser.

This project will make my life easier because I can:

1.  Drop some shapes/images/textboxes in powerpoint for a UI,
2.  Generate HTML and CSS,
3.  Add life to the elements via Javascript
4.  Deploy my app with Electron or host on a server

## How it works?

The difficulty in this project is parsing Office Open XML format and converting that to renderable HTML. The project is written in `Typescript`. In order to remain extensible, this is a safe choice.

Here is the flow:

    Parse slide xml-->
    Retrieve shapes-->
    Convert shapes to localized PPT Element Model-->
    Call a Renderer that converts the PPT Element to HTML & CSS-->
    Generate HTML & CSS files

## Contributing

Powerpoint does a lot, this project doesn't. But the beauty of building from scratch is that I built it to be extensible. To make a renderer, head to the renderers folder:

```

```
