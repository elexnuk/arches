/**
 * @typedef {import("./party").Party} Party
 */

/**
 * Representation of a Party with a seat count in a diagram. Optionally specifies the position of the party
 * on the diagram (e.g. specifynig a crossbench party or speaker)
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
    constructor(partyData, options) {
        this.partyData = partyData;
        this.options = options;
    }

    /**
     * Returns the SVG string which corresponds to the diagram
     * @returns {string} string-encoded SVG diagram 
     */
    get svg() {
        return "";
    }
}