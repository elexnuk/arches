/**
 * Represents a party in a parliament diagram
 */
export class Party {
    /**
     * Represents a party in a parliament diagram
     * 
     * @param {number} id Integer ID of the party - should be unique in its list.
     * @param {string} name Name of the party
     * @param {string} fillColour The fill colour of the party spot
     * @param {string} outlineColour The outline colour of the party spot
     * @param {number} outlineWidth The outline width of the party spot
     * @param {string} position The position of the party in the diagram (left, right, center, head)
     */
    constructor(id, name = "New Party", fillColour = "#DDDDDD", outlineColour = "#000000", outlineWidth = 0, position = "left") {
        /**
         * Integer ID of the party - should be unique in the list
         * @type {number}
         */
        this.id = id;
        /**
         * Name of the party
         * @type {string}
         */
        this.name = name;
        /**
         * Hex colour of the party fill in a diagram
         * @type {string}
         */
        this.fillColour = fillColour;
        /**
         * Hex colour of the party outline in a diagram
         * @type {string}
         */
        this.outlineColour = outlineColour;
        /**
         * Outline width of the party in diagram
         * @type {number}
         */
        this.outlineWidth = outlineWidth;
        /**
         * Position of the party in the diagram. left, right, center, head
         * @type {string}
         */
        this.position = position;
    }
}