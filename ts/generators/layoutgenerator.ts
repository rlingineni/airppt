/**
 * Generates CSS Layout and Item Placement Classes as Per Slide
 */

const beautify = require('beautify');

class LayoutGenerator {

    private gridCSS = [];
    private absoluteCSS = [];

    constructor() {

    }

    private generateCSS(obj: any) {
        const selectors = Object.keys(obj);
        let css = selectors
            .map(selector => {
                const definition = obj[selector];
                const rules = Object.keys(definition).map(rule => `${rule}:${definition[rule]}`).join(';');
                return `${selector} {${rules}}`;
            })
            .join('');
        return css;
    }


    public getCSS(posType) {
        let css = '';
        if (posType != 'grid') {
            this.absoluteCSS.push(`.wrapper {
            position: fixed;
            width: 1280px;
            height: 720px;
            border-color: #000000;
            border-style: dotted
          }`);
            css = beautify(this.absoluteCSS.join(''), { format: 'css' });
        }
        else {
            css = beautify(this.gridCSS.join(''), { format: 'css' });
        }
        return css;
    }

    public generateElementCSS(scaler, elementName, elementPosition, elementOffsetPosition) {
        let absCSS = this.generateAbsoluteCSS(scaler, elementName, elementPosition, elementOffsetPosition);
        let gridCSS = this.generateGridCSS(scaler, elementName, elementPosition, elementOffsetPosition);
        return { absCSS, gridCSS };
    }


    private generateAbsoluteCSS(scaler, elementName, elementPosition, elementOffsetPosition) {
        let planeSize = scaler.getNewPlaneSize();
        let scaledPositionCoordinates = scaler.getScaledCoordinate({ x: elementPosition.x, y: elementPosition.y });
        let scaledOffsetCoordinates = scaler.getScaledCoordinate({ x: elementOffsetPosition.cx, y: elementOffsetPosition.cy });
        console.log(planeSize.width - scaledPositionCoordinates.x);
        console.log(scaledPositionCoordinates.x);
        let cssPosition = {
            position: 'absolute',
            top: scaledPositionCoordinates.y + 'px',
            left: scaledPositionCoordinates.x + 'px',
            width: scaledOffsetCoordinates.x + 'px',
            height: scaledOffsetCoordinates.y + 'px'
        };
        let elementStyleKey = '#' + elementName + '.position';
        let layoutStyle = {};
        layoutStyle[elementStyleKey] = cssPosition;
        let css = this.generateCSS(layoutStyle);
        this.absoluteCSS.push(css);
        return css;
    }
    private generateGridCSS(scaler, elementName, elementPosition, elementOffsetPosition) {
        let cssPosition = scaler.getElementGridPlacement({ x: elementPosition.x, y: elementPosition.y }, { x: elementOffsetPosition.cx, y: elementOffsetPosition.cy });
        let elementStyleKey = '#' + elementName + '.position';
        let layoutStyle = {};
        layoutStyle[elementStyleKey] = cssPosition;
        let css = this.generateCSS(layoutStyle);
        this.gridCSS.push(css);
        return css;
    }
}

export default LayoutGenerator;
