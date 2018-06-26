const JSZip = require('jszip');
const fs = require('fs');
const xml2js = require('xml2js-es6-promise');
const gridScaler = require('./gridscaler');
const layoutGen = require('./generators/layoutgenerator');

loadZip();
async function loadZip() {
    var zip = new JSZip();
    let data = await getData("TeluguApp.pptx");
    let xmlString = await getData("replacement.txt")
    let zipResult = await zip.loadAsync(data);


    let slideShowAttributes = await parseSlideAttributes(zipResult, 'ppt/presentation.xml');
    let slideSizeX = slideShowAttributes['p:presentation']['p:sldSz'][0]['$']['cx'];
    let slideSizeY = slideShowAttributes['p:presentation']['p:sldSz'][0]['$']['cy'];
    console.log(slideSizeX, slideSizeY);

    //TO-DO:

    //Parse ppt/presentation.xml and get size

    let scaler = new gridScaler(slideSizeX, slideSizeY, 12);
    console.log(scaler.getNewPlaneSize());

    //Place elements in right position for HTML
    let slideAttributes = await parseSlideAttributes(zipResult, 'ppt/slides/slide1.xml');
    let slideElements = slideAttributes["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:sp"];
    for (let element of slideElements) {
        let elementName = element['p:nvSpPr'][0]['p:cNvPr'][0]['$']['title'] || element['p:nvSpPr'][0]['p:cNvPr'][0]['$']['name'];
        let elementPosition = element['p:spPr'][0]['a:xfrm'][0]['a:off'][0]['$'];
        let elementOffsetPosition = element['p:spPr'][0]['a:xfrm'][0]['a:ext'][0]['$'];

        //console.log(layoutGen.generateAbsoluteCSS(scaler, elementName, elementPosition, elementOffsetPosition));
        //console.log(layoutGen.generateGridCSS(scaler, elementName, elementPosition, elementOffsetPosition));


        /* console.log(elementName, scaler.getScaledCoordinate({ x: elementPosition.x, y: elementPosition.y }), scaler.getScaledCoordinate({ x: elementOffsetPosition.cx, y: elementOffsetPosition.cy }));
         let cssPosition = scaler.getElementGridPlacement({ x: elementPosition.x, y: elementPosition.y }, { x: elementOffsetPosition.cx, y: elementOffsetPosition.cy })
 
         let scaledPositionCoordinates = scaler.getScaledCoordinate({ x: elementPosition.x, y: elementPosition.y });
         let scaledOffsetCoordinates = scaler.getScaledCoordinate({ x: elementOffsetPosition.cx, y: elementOffsetPosition.cy });
         let cssOffsetPosition = {
             position: 'absolute',
             top: scaledPositionCoordinates.y + 'px',
             right: scaledPositionCoordinates.x + 'px',
             width: scaledOffsetCoordinates.x + 'px',
             height: scaledOffsetCoordinates.y + 'px'
         }
 
         console.log(cssOffsetPosition)
         let elementStyleKey = '.' + elementName + '-style';
         let layoutStyle = {}
         layoutStyle[elementStyleKey] = cssPosition
         let css = layoutGen.generateCSS(layoutStyle);*/
    }
    // console.log(JSON.stringify(slideAttributes));


    //Convert PPT shapes

    //Create Output HTML file






    /** Rezip file and Slides 
    zip.file("ppt/slides/slide1.xml", xmlString)
    console.log(zipResult);
    console.log("done");

    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream('InteractivePPT-x.ppsm'))
        .on('finish', function () {
            // JSZip generates a readable stream with a "end" event,
            // but is piped here in a writable stream which emits a "finish" event.
            console.log("out.zip written.");
        });
    */

}


async function parseSlideAttributes(zipResult, fileName) {
    let presentationSlide = await zipResult.file(fileName).async("string");
    let parsedPresentationSlide = await xml2js(presentationSlide, { trim: true });
    return parsedPresentationSlide;
}


function getData(fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}