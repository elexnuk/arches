import { Diagram } from "./diagram";
const positions = ["left", "right", "center", "head"];

function round(value, n) {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

function renderWmDiagram(inputParties, options) {
    
    let sumdelegates = {left: 0, right: 0, center: 0, head: 0}
    let emptyseats = {left: 0, right: 0, center: 0, head: 0}

    for (let party of inputParties) {
        // todo error handling for invalid party

        sumdelegates[party.position] += party.seats;
    }

    // wingrows option -- i.e. how many rows in each wing
    let wingrows = options.wingrows || 0;
    if (wingrows == 0) {
        wingrows = Math.ceil(Math.sqrt(Math.max(1, sumdelegates.left, sumdelegates.right) / 20.0)) * 2;
    }

    wingrows = {left: wingrows, right: wingrows}

    // cozy option -- i.e. do we space parties out or not
    let wingcols = 0;
    if (options.cozy) {
        wingcols = Math.ceil(Math.max(sumdelegates.left, sumdelegates.right) / wingrows.left);
    } else {
        for (let wing of ['left', 'right']) { // todo: sort out this iteration
            // for each party in the wing
            for (let party of inputParties) {
                // if the party is in the wing
                if (party.position == wing) {
                    party.emptyseats = (wingrows[wing] + ((- party.seats) % wingrows[wing])) % wingrows[wing]; // check this, ugly negative modulous might be weird in pyhton
                    emptyseats[wing] += party.emptyseats;
                }
            }
        }
        wingcols = Math.ceil(Math.max(sumdelegates.left + emptyseats.left, sumdelegates.right + emptyseats.right) / wingrows.left);
    }

    // fullwidth option -- slim down one side of diagram? want to usethe full width of diagram
    if (options.fullwidth) {
        for (let wing of ['left', 'right']) {
            if (!options.cozy) {
                for (let i = wingrows[wing]; i > 1; i--) { // check this. python decr range goes to endpoint or not?
                    let tempgaps = 0
                    
                    for (let party of inputParties) {
                        if (party.position == wing) {
                            tempgaps += ((i-1) + ((-party.seats) % (i - 1))) % (i - 1); // once again negativ modulus
                        }
                    }

                    if (sumdelegates[wing] + tempgaps > wingcols * (i - 1)) {
                        break; // apparently set up correctly now
                    } else { // fits in i-1 rows
                        emptyseats[wing] = tempgaps;
                        wingrows[wing] = i-1;
                        for (let party of inputParties) {
                            if (party.position == wing) {
                                party.emptyseats = ((i-1) + ((-party.seats) % (i - 1))) % (i - 1); // once again negativ modulus
                            }
                        }
                    }

                }
            } else {
                wingrows[wing] = Math.ceil(sumdelegates[wing] / wingcols);
            }
        }
    }

    // TODO: maybe validation checks here as wel
    if (options.centercols == 0 || options.centercols == null) {
        options.centercols = Math.ceil(Math.sqrt(sumdelegates.center / 4.0))
    } 

    // whyyyyyyy
    let centerrows = Math.ceil(sumdelegates.center / options.centercols);
    if (isNaN(centerrows)) {
        centerrows = 0;
    }
    
    let totalcols, leftoffset;
    if (sumdelegates.head > 0) {
        totalcols = Math.max(wingcols + 1, sumdelegates.head);
        leftoffset = 1; // Speaker block should protude 1 to the left
    } else {
        leftoffset = 0;
        totalcols = wingcols;
    }

    if (sumdelegates.center > 0) {
        totalcols += 1 + options.centercols;
    }

    let totalrows = Math.max(wingrows.left + wingrows.right + 2, centerrows);
    let blocksize = 350.0 / Math.max(totalcols, totalrows);
  
    //console.log(blocksize);

    options.radius = Math.min(0.5, options.radius);
    let radius = options.radius * blocksize * (1-options.spacing);

    let svgwidth = blocksize * totalcols + 10;
    let svgheigh = blocksize * totalrows + 10;

    let poslist = {left: [], right: [], center: [], head: []}
    let centertop = svgheigh / 2 - blocksize * (1-options.spacing) / 2;
    centertop += (wingrows.left - wingrows.right) * blocksize / 2;

    for (let x = 0; x < sumdelegates.head; x++) {
        poslist.head.push([5.0 + blocksize * (x + options.spacing / 2), centertop])
    }

    for (let x = 0; x < options.centercols; x++) {
        let thiscol = Math.min(centerrows, sumdelegates.center - x*centerrows);
        for (let y = 0; y < thiscol; y++) {
            poslist.center.push([svgwidth - 5.0 - (options.centercols - x - options.spacing / 2) * blocksize, 
                ((svgheigh - thiscol * blocksize) / 2) + blocksize * (y + options.spacing / 2) ] );
            poslist.center.sort((a, b) => a[1] - b[1]);
        }
    }
  
  //console.log(wingcols, wingrows)

    for (let x = 0; x < wingcols; x++) {
        for (let y = 0; y < wingrows.left; y++) {
            poslist.left.push([5 + (leftoffset + x + options.spacing / 2) * blocksize, 
                centertop-(1.5 + y) * blocksize]);
        }
        for (let y = 0; y < wingrows.right; y++) {
            poslist.right.push([5 + (leftoffset + x + options.spacing / 2) * blocksize, 
                centertop+(1.5 + y) * blocksize]);
        }
    }
  
    for (let wing of ["left", "right"]) {
      //console.log(wing, sumdelegates[wing], poslist[wing])
        if (options.fullwidth && wingrows[wing] > 1) {
            if (wing == "right") {
                poslist[wing].sort((a, b) => a[1] - b[1]);
            } else {
                poslist[wing].sort((a, b) => b[1] - a[1]);
            }

            if (options.cozy) {
                poslist[wing] = poslist[wing].slice(0, sumdelegates[wing]); // + empty seats here?
                poslist[wing].sort((a, b) => a[0] - b[0]);
            } else {
                poslist[wing].sort((a, b) => a[0] - b[0]);
                let counter = 0
                let totspots = sumdelegates[wing] + emptyseats[wing];
                let extraspots = wingrows[wing] * wingcols - totspots
                for (let party of inputParties) {
                    if (party.position == wing) {
                        let pspots = party.seats + party.emptyseats;
                        let addspots;
                        try {
                            addspots = Math.round(extraspots * pspots / totspots);
                        } catch (e) {
                            addspots = 0;
                        }
                        addspots += -addspots % wingrows[wing];
                        let seatslice = poslist[wing].slice(counter, counter + pspots + addspots);
                        extraspots -= addspots;
                        totspots -= pspots + addspots
                        if (counter < (sumdelegates[wing] + emptyseats[wing]) / 2) {
                            seatslice.sort((a, b) => b[0] - a[0]);
                        }
                        if (wing == "right") {
                            seatslice.sort((a, b) => a[1] - b[1]);
                        } else {
                            seatslice.sort((a, b) => b[1] - a[1]); 
                        }
                        for (let i = party.seats; i < seatslice.length; i++) {
                            seatslice[i][0] = 999;
                        }
                        counter += pspots + addspots;
                    }
                    poslist[wing].sort((a, b) => a[0] - b[0]);
                }
            }
        } else {
            poslist[wing].sort((a, b) => a[0] - b[0]);
        }
    }

    // draw the diagram
    let svg = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n";
    svg += `<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1"
    width="${Math.round(svgwidth * 10) / 10}" height="${Math.round(svgheigh * 10) / 10}"
    viewBox="0 0 ${Math.round(svgwidth * 10) / 10} ${Math.round(svgheigh * 10) / 10}">
    <!-- Created with the Wikimedia parliament diagram creator (http://parliamentdiagram.toolforge.org/parliamentinputform.html) -->
<!-- generated by the elexnuk/arches web application (https://arches.elexn.uk/) -->`;

    svg += `<g id="diagram">`;

    svg += `<g id="speakers">`;
    let counter = -1;
    for (let party of inputParties) {
        if (party.position == "head") {
            svg += `<g style="fill: ${party.colour}" id="${party.name}"><title>${party.name}</title>`;
            let lim = counter + 1 + party.seats;
            for (counter = counter + 1; counter < lim; counter++) {
              //console.log(poslist.head);
                svg += `<rect x="${round(poslist.head[counter][0], 4)}" y="${round(poslist.head[counter][1], 4)}" rx="${round(radius, 2)}" ry="${round(radius, 2)}" width="${round(blocksize * (1.0 - options.spacing), 2)}" height="${round(blocksize * (1.0 - options.spacing), 2)}"></rect>`;
            }
            svg += `</g>`;
        }
    }
    svg += `</g>`;

    svg += `<g id="leftbench">`;
    //console.log(poslist.left)
    counter = 0;
    for (let party of inputParties) {
        if (party.position == "left") {
            svg += `<g style="fill: ${party.colour}" id="${party.name}">`;
            let lim = counter + party.seats;
            for (counter = counter; counter < lim; counter++) {
                // console.log(counter, "/", lim, poslist.left);
                svg += `<rect x="${round(poslist.left[counter][0], 4)}" y="${round(poslist.left[counter][1], 4)}" rx="${round(radius, 2)}" ry="${round(radius, 2)}" width="${round(blocksize * (1.0 - options.spacing), 2)}" height="${round(blocksize * (1.0 - options.spacing), 2)}"></rect>`;
            }
            if (!options.fullwidth && !options.cozy) {
                counter += (wingrows.left + ((-party.seats) % wingrows.left)) % wingrows.left;
                //console.log("jump",(wingrows.left + ((-party.seats) % wingrows.left)) % wingrows.left)
            }
            svg += `</g>`;
        }
    }
    svg += `</g>`;

    svg += `<g id="rightbench">`;
    counter = 0;
    for (let party of inputParties) {
        if (party.position == "right") {
            svg += `<g style="fill: ${party.colour}" id="${party.name}">`;
            let lim = counter + party.seats;
            for (counter = counter; counter < lim; counter++) {
                // console.log(counter, lim, poslist.right);
                svg += `<rect x="${round(poslist.right[counter][0], 4)}" y="${round(poslist.right[counter][1], 4)}" rx="${round(radius, 2)}" ry="${round(radius, 2)}" width="${round(blocksize * (1.0 - options.spacing), 2)}" height="${round(blocksize * (1.0 - options.spacing), 2)}"></rect>`;
            }
            if (!options.fullwidth && !options.cozy) {
                counter += (wingrows.right + ((-party.seats) % wingrows.left)) % wingrows.right
            }
            svg += `</g>`;
        }
    }
    svg += `</g>`;

    svg += `<g id="crossbench">`;
    counter = 0;
  //console.log(poslist.center);
    for (let party of inputParties) {
        if (party.position == "center") {
            svg += `<g style="fill: ${party.colour}" id="${party.name}">`;
            let lim = counter + party.seats;
            for (counter = counter; counter < lim; counter++) {
              //console.log(counter, lim);
                svg += `<rect x="${round(poslist.center[counter][0], 4)}" y="${round(poslist.center[counter][1], 4)}" rx="${round(radius, 2)}" ry="${round(radius, 2)}" width="${round(blocksize * (1.0 - options.spacing), 2)}" height="${round(blocksize * (1.0 - options.spacing), 2)}"></rect>`;
            }
            svg += `</g>`;
        }
    }
    svg += `</g>`;
    
    svg += "</g>";
    svg += "</svg>";

    return svg;
}

export class WestminsterDiagram extends Diagram {

    constructor(partyData, options) {
        super(partyData, options);

        this.diagOpts = {
            cozy: options.cozy,
            fullwidth: options.fullwidth,
            centercols: options.centercols || 0,
            wingrows: options.wingrows || 0,
            radius: options.radius || 0.5,
            spacing: options.spacing || 0.1
        };

        this.diagParties = [];
        for (let party of partyData) {
            if (!["left", "right", "head", "center"].includes(party.party.position)) {
                party.position = "left";
            }

            if (!party.seatCount || party.seatCount == 0) {
                continue;
            }

            this.diagParties.push({
                name: party.party.name,
                colour: party.party.fillColour,
                seats: party.seatCount,
                position: party.party.position,
                emptyseats: 0
            });
        }
    }

    get svg() {
        console.log(this.diagParties, this.diagOpts);
        return renderWmDiagram(this.diagParties, this.diagOpts);
    }

}
