/**
 * Generates CSS Layout and Item Placement Classes as Per Slide
 */

let gridCSS = [];
let absoluteCSS = [];

const beautify = require('beautify');

module.exports = { generateElementCSS, getCSS };

function generateCSS(obj) {
    const selectors = Object.keys(obj)
    let css = selectors
        .map(selector => {
            const definition = obj[selector]
            const rules = Object.keys(definition).map(rule => `${rule}:${definition[rule]}`).join(';')
            return `${selector} {${rules}}`
        })
        .join('')
    return css;
}

function getCSS(posType) {
    let css = ''
    if (posType != 'grid') {
        absoluteCSS.push(`.wrapper {
            position: fixed;
            width: 1280px;
            height: 720px;
            border-color: #000000;
            border-style: dotted
          }`)
        css = beautify(absoluteCSS.join(''), { format: 'css' });
    } else {
        css = beautify(gridCSS.join(''), { format: 'css' });
    }

    return css;
}


function generateElementCSS(scaler, elementName, elementPosition, elementOffsetPosition) {

    let absCSS = generateAbsoluteCSS(scaler, elementName, elementPosition, elementOffsetPosition)
    let gridCSS = generateGridCSS(scaler, elementName, elementPosition, elementOffsetPosition)
    return { absCSS, gridCSS }

}

function generateAbsoluteCSS(scaler, elementName, elementPosition, elementOffsetPosition) {

    let planeSize = scaler.getNewPlaneSize();
    let scaledPositionCoordinates = scaler.getScaledCoordinate({ x: elementPosition.x, y: elementPosition.y });
    let scaledOffsetCoordinates = scaler.getScaledCoordinate({ x: elementOffsetPosition.cx, y: elementOffsetPosition.cy });
    console.log(planeSize.width - scaledPositionCoordinates.x)
    console.log(scaledPositionCoordinates.x);
    let cssPosition = {
        position: 'absolute',
        top: scaledPositionCoordinates.y + 'px',
        left: scaledPositionCoordinates.x + 'px',
        width: scaledOffsetCoordinates.x + 'px',
        height: scaledOffsetCoordinates.y + 'px'
    }
    let elementStyleKey = '#' + elementName + '.position';
    let layoutStyle = {}
    layoutStyle[elementStyleKey] = cssPosition
    let css = generateCSS(layoutStyle);
    absoluteCSS.push(css);
    return css;

}

function generateGridCSS(scaler, elementName, elementPosition, elementOffsetPosition) {

    let cssPosition = scaler.getElementGridPlacement(
        { x: elementPosition.x, y: elementPosition.y },
        { x: elementOffsetPosition.cx, y: elementOffsetPosition.cy }
    )
    let elementStyleKey = '#' + elementName + '.position';
    let layoutStyle = {}
    layoutStyle[elementStyleKey] = cssPosition
    let css = generateCSS(layoutStyle);
    gridCSS.push(css);
    return css;

}