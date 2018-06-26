/**
 * Generates CSS Layout and Item Placement Classes as Per Slide
 */

module.exports = { generateAbsoluteCSS, generateGridCSS };

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

function generateAbsoluteCSS(scaler, elementName, elementPosition, elementOffsetPosition) {

    let scaledPositionCoordinates = scaler.getScaledCoordinate({ x: elementPosition.x, y: elementPosition.y });
    let scaledOffsetCoordinates = scaler.getScaledCoordinate({ x: elementOffsetPosition.cx, y: elementOffsetPosition.cy });
    let cssPosition = {
        position: 'absolute',
        top: scaledPositionCoordinates.y + 'px',
        right: scaledPositionCoordinates.x + 'px',
        width: scaledOffsetCoordinates.x + 'px',
        height: scaledOffsetCoordinates.y + 'px'
    }
    let elementStyleKey = '.' + elementName + '-style';
    let layoutStyle = {}
    layoutStyle[elementStyleKey] = cssPosition
    let css = generateCSS(layoutStyle);
    return css;

}


function generateGridCSS(scaler, elementName, elementPosition, elementOffsetPosition) {

    let cssPosition = scaler.getElementGridPlacement(
        { x: elementPosition.x, y: elementPosition.y },
        { x: elementOffsetPosition.cx, y: elementOffsetPosition.cy }
    )
    let elementStyleKey = '.' + elementName + '-style';
    let layoutStyle = {}
    layoutStyle[elementStyleKey] = cssPosition
    let css = generateCSS(layoutStyle);
    return css;

}