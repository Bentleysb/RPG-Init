# RPG Init

RPG Init is a free and open source initiative tracker for the Dungeons & Dragons 5e game by Wizards of the Coast LLC. It was developed by Bentley Breithaupt and John Bartholomew, and written by Bentley Breithaupt.

The program's main function is to make creating and running encounters easier for game masters (GM). To this end, the program has two main features. The first is a list of players and creatures. This list includes stats and abilities for GM controlled creatures. The second is an ordering system for encounters. The ordering system auto rolls and sorts initiative for the encounter (player initiative rolls must still be manually entered), highlights the active or dead/unconscious creatures, and makes health and other variables easy to track.  

## Running the Program

The program is compiled to a single html file. If using a precompiled distribution, all that is required to run the program is open RPG_Init.html in a web browser.

The program is tested in Mozilla Firefox and Google Chrome. It is recommended use one of these web browsers to run the program.

If using an uncompiled distribution (containing public, scripts, and src folders), see below for how to build the project and then run as above.

## Using the Program

See [Manual.md](Manual.md)

## Building the Program from Source

This program is written in html, css, and javascript, and uses React.js and JSX. Babel and inline.js are used to compile the project. Node Package Manager (NPM) is used to handle compiling dependencies and execution.

Compile using NPM 6.7.0+

### To Compile

From the root of the project run:  
`npm install`  
`npm run build`  

You should see
`Creating an optimized build...`
followed by some build details and
`RPG_Init.html created`

At this point all files have been compiled to RPG_Init.html.


## Contribution and Licensing

RPG Init is a free and open source program under the MIT license.  
Feel free to modify and distribute the program to suit your needs.  
Contributions and suggestions are welcome on the project's [github](https://github.com/Bentleysb/RPG-Init).
