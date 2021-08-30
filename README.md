# jamesm2w / ParliamentDiagram

This is a Node.js and Vue.js rewrite of the [original parliament diagram creator](https://github.com/slashme/parliamentdiagram) designed for use on Wikipedia, Wikimedia Commons and Wikidata. 
My motivation was to create a modern web application to allow for a faster and easier workflow. The algorithms which generate the diagrams are credited to the original authors [David Richfield](https://en.wikipedia.org/wiki/User:Slashme), [Mathis Rade](https://github.com/Rade-Mathis), [Ranjith Siji](https://en.wikipedia.org/wiki/User:Ranjithsiji) and [Ambady Anand S](https://en.wikipedia.org/wiki/User:Ambadyanands).

![Sample image](https://parliament.jamesm2w.me/card_image.png)

The application is available at [parliament.jamesm2w.me](https://parliament.jamesm2w.me/) (a build of the latest main branch deployed on github pages).

## Build from Source

1. Download the source from this github repository. 
2. Install dependencies with `npm install`
3. Run `npm run build` to build the application into `/dist`
4. (Optional) Serve locally with `npm run serve`

## Development

1. Download source from the github repository
2. Install dependencies with `npm install`
3. Edit code in your favourite editor. 
4. Run development copy with `npm run dev`

## Dependencies

* Node.js & NPM
    - Application is tested to build on Node v14 and NPM v6

The following development dependencies are installed by running `npm install`
* Vue & Vite
* Autoprefixer
* PostCSS
* Tailwind CSS

### Included:
* jscolor, also available from [jscolor.com](jscolor.com).

## License

This tool is licensed GPL v2, see [LICENSE.md](LICENSE.md).
