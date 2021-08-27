/**
 * @typedef PartyRepresentation
 * @type {object}
 * @property {Party} party Party object
 * @property {number} seatCount Number of seats in the diagram
 * @property {string} [position] Position of party in the diagram
 */

/**
 * Represents a diagram created by the user which has a SVG representation
 */
export class Diagram {
    /**
     * Creates a new diagram with given parties and seat counts
     * @param {PartyRepresentation[]} partyData List of parties and seat counts 
     * @param {object} [options] Optional diagram display options
     */
    constructor (partyData, options) {
        this.partyData = partyData;
        this.options = options;
    }

    /**
     * Returns the SVG string which corresponds to the diagram
     */
    get svg () {
        // Draw the svg
        return "";
    }
}