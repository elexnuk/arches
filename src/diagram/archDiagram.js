import { Diagram } from "./diagram";
import { Party } from "./party";

/**
 * @typedef {import("./diagram").PartyRepresentation} PartyRepresentation 
 * @typedef {import("./diagram").Diagram} Diagram
 */

/** 
 * Maximum totals for each row.
 * @type {number[]} 
 */
const totals = [
    3, 15, 33, 61, 95, 138, 189, 247, 313, 388, 469, 559, 657, 762, 876, 997,
    1126, 1263, 1408, 1560, 1722, 1889, 2066, 2250, 2442, 2641, 2850, 3064,
    3289, 3519, 3759, 4005, 4261, 4522, 4794, 5071, 5358, 5652, 5953, 6263,
    6581, 6906, 7239, 7581, 7929, 8287, 8650, 9024, 9404, 9793, 10187, 10594,
    11003, 11425, 11850, 12288, 12729, 13183, 13638, 14109, 14580, 15066, 15553,
    16055, 16557, 17075, 17592, 18126, 18660, 19208, 19758, 20323, 20888, 21468,
    22050, 22645, 23243, 23853, 24467, 25094, 25723, 26364, 27011, 27667, 28329,
    29001, 29679, 30367, 31061
];

/** @type {string} */
const SVG_HEADER = name => `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 360 ${name == "" ? 185 : 205}">
<!-- Created with the Wikimedia parliament diagram creator (http://parliamentdiagram.toolforge.org/parliamentinputform.html) -->
<!-- Created with jamesm2w/ParliamentDiagram web application (https://parliament.jamesm2w.me/) -->
<g>`;

/** @type {string} */
const SVG_FOOTER = `</g></svg>`;

/**
 * @typedef SeatPositions
 * @type {object}
 * @property {number} angle Angle of seat around the row
 * @property {number} x x-coordiante of the seat centre
 * @property {number} y y-coordinate of the seat centre
 */

/**
 * User options for the Arch Diagram
 * @typedef ArchDiagramOptions
 * @type {object}
 * @property {string} [diagramTitle=""] Title of the diagram - defaults to no title
 * @property {boolean} [denseRows=false] Should the diagram be compacted to save space - defaults to false.
 */

/**
 * Represents a diagram of arched rows with seats represented by a circle
 * Corresponding proportions of seats are coloured by the parties represented.
 * 
 * @extends Diagram
 */
export class ArchDiagram extends Diagram {
    /**
     * Creates a new arched diagram
     * @param {PartyRepresentation[]} partyData List of parties and their seat counts 
     * @param {ArchDiagramOptions} [options] Options to change the display of the diagram 
     */
    constructor(partyData, options) {
        super(partyData, options);
        this.denseRows = options.denseRows;
        this.diagramTitle = options.diagramTitle;

        this.totalSeats = 0;
        this.rowCount = 0;
        this.circleRadius = 0;
    }

    /**
     * The number of seats may be small enough so we don't need to fill all the
     * possible rows, but only the outermost ones. This says how much do we
     * actually need.
     * 
     * @returns {[number, number]} Number of innermost rows to discard, Measure of diagram fullness
     */
    optimiseRows() {
        let handledSpots = 0;

        for (let i = this.rowCount; i > 0; i--) {
            // Determines the maximum number of seats in the row
            // Magic Number Math from @slashme
            let magicNumber = 3 * this.rowCount + 4 * i - 2;
            let maximumSeatsInRow = Math.PI / (2 * Math.asin(2 / magicNumber));
            handledSpots += Math.trunc(maximumSeatsInRow);

            if (handledSpots >= this.totalSeats) {
                let wastedRows = i - 1;
                let diagramFullness = this.totalSeats / handledSpots;
                return [wastedRows, diagramFullness];
            }
        }

        return [0, 0];
    }

    /**
     * Append the seat positions into the positions list
     * 
     * @param {SeatPositions[]} positions List of positions of seats
     * @param {number} seatsInRow Number of seats in the current row
     * @param {number} rowRadius Radius of the arch row
     * @returns {SeatPositions[]} Updated list of positions.
     */
    appendSeatPositions(positions, seatsInRow, rowRadius) {
        let ratio = Math.sin(this.circleRadius / rowRadius);
        for (let i = 0; i < seatsInRow; i++) {
            let angle = 0;
            if (seatsInRow == 1) {
                angle = Math.PI / 2;
            } else {
                angle = i
                    * (Math.PI - 2 * ratio)
                    / (seatsInRow - 1)
                    + ratio;
            }
            positions.push({
                angle: angle,
                x: rowRadius * Math.cos(angle) + 1.75,
                y: rowRadius * Math.sin(angle)
            });
        }

        return positions;
    }

    /**
     * Adds the current row's worth of seats into the position list.
     * 
     * @param {SeatPositions[]} positions List of seat positions
     * @param {number} index Which index row this is
     * @param {number} diagramFullness Measure of how full the diagram is
     * @returns {SeatPositions[]} Updated list of seat positions
     */
    appendRowSeats(positions, index, diagramFullness) {
        let magicNumber = 3.0 * this.rowCount + 4.0 * index - 2.0
        let maximumSeatsInRow = Math.PI / (2 * Math.asin(2.0 / magicNumber))

        // Fill the row proportionally to the "fullness" of the diagram
        let seatsInCurrentRow = Math.trunc(diagramFullness * maximumSeatsInRow)

        // The radius of the ith row in an N-row diagram (Ri) is (3n+4*i-2)/(4n)
        let currentRowRadius = magicNumber / (4.0 * this.rowCount)
        return this.appendSeatPositions(positions, seatsInCurrentRow, currentRowRadius);
    }

    /**
     * Adds the final leftover seats into the diagram
     * 
     * @param {SeatPositions[]} positions Positions of seats in the diagram
     * @returns {SeatPositions[]} Updated list of seat positions
     */
    appendFinalSeats(positions) {
        let leftoverSeats = this.totalSeats - positions.length;
        let finalRowRadius = (7 * this.rowCount - 2) / (4 * this.rowCount);
        return this.appendSeatPositions(positions, leftoverSeats, finalRowRadius);
    }

    /**
     * Create a list of the centre positions of all spots in the diagram
     * @return {SeatPositions[]}
     */
    getSpotCentres() {
        let discardRows = 0;
        let diagramFullness = 0;

        if (this.denseRows) {
            [discardRows, diagramFullness] = this.optimiseRows();
        } else {
            diagramFullness = this.totalSeats / totals[this.rowCount - 1];
        }

        /** @type {SeatPositions[]} */
        let positions = [];
        for (let i = discardRows + 1; i < this.rowCount; i++) {
            positions = this.appendRowSeats(positions, i, diagramFullness);
        }
        positions = this.appendFinalSeats(positions);
        // Sort descending
        positions.sort((left, right) => {
            let cmpAngle = right.angle - left.angle;
            if (cmpAngle == 0) {
                let cmpX = right.x - left.x;
                if (cmpX == 0) return right.y - left.y;
                return cmpX;
            }
            return cmpAngle;
        });
        return positions;
    }

    /**
     * Constructs an SVG representation of the diagram
     * @returns {string} SVG of the diagram in string form.
     */
    get svg() {

        if (this.partyData.length == 0) {
            return "";
        }

        /** @type {number} */
        this.totalSeats = this.partyData.reduce((total, partyRepresentation) => {
            return { seatCount: total.seatCount + partyRepresentation.seatCount };
        }).seatCount;

        if (this.totalSeats > 0) {
            this.rowCount = totals.findIndex(el => el >= this.totalSeats) + 1;

            if (this.rowCount <= 0) {
                return "";
            }

            // Maximum radius is 0.5/rowCount but leave some space.
            this.circleRadius = 0.4 / this.rowCount;
            let seatPositions = this.getSpotCentres();
            let svgString = "";
            svgString += SVG_HEADER(this.options.diagramTitle);

            svgString +=
                `<text x="175" y="175"
                style="font-size:36px;font-weight:bold;text-align:center;text-anchor:middle;font-family:sans-serif;">
                ${this.totalSeats}
            </text>\n`;

            if (this.diagramTitle != "") {
                svgString += `<text x="175" y="200" 
                style="font-size:20px;font-weight:bold;text-align:center;text-anchor:middle;font-family:sans-serif;">
                    ${this.diagramTitle}
                </text>`
            }

            let drawnSeats = 0;
            let index = 0;
            for (let partyRepresentation of this.partyData) {
                let party = partyRepresentation.party;
                let sanitisedName = party.name.replace(/[^a-zA-Z0-9_-]+/g, "-");
                svgString += `<g 
                    style="fill: ${party.fillColour}; 
                    stroke-width: ${(party.outlineWidth / 100) * this.circleRadius * 100}; 
                    stroke: ${party.outlineColour};" 
                    id="${sanitisedName}_${index}"><title>${party.name}</title>`;

                for (let i = drawnSeats; i < drawnSeats + partyRepresentation.seatCount; i++) {
                    svgString += `<circle cx="${5.0 + 100.0 * seatPositions[i].x}"
                                    cy="${5.0 + 100.0 * (1.75 - seatPositions[i].y)}"
                                    r="${this.circleRadius * 100.0 - (party.outlineWidth / 100) / 2.0}" />\n`;
                }
                svgString += "</g>";
                drawnSeats += partyRepresentation.seatCount;
                index++;
            }

            svgString += SVG_FOOTER;
            return svgString;
        } else {
            return "";
        }
    }
}
