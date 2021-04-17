const { inlineSource } = require('inline-source');
const fs = require('fs');
const path = require('path');
const htmlpath = path.resolve('build/index.html');
let html;

inlineSource(htmlpath, {
    compress: true,
    rootpath: path.resolve('build'),
    attribute: false
}).then((html) => {
    fs.writeFile("RPG_Init.html", html, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("RPG_Init.html created");
    });
}).catch((err) => {
    console.log(err);
});