const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname,"vehicle_list.txt");

const raw = fs.readFileSync(filePath,"utf8")
.split("\n")
.map(v => v.trim())
.filter(v => v.length > 0);

const vehicles = [];

let currentMake = "";

raw.forEach(line => {

line = line.trim();

if(!line) return;

/* Detect Make */

if(line === line.toUpperCase() && !line.includes("(")){
currentMake = line;
return;
}

/* Detect Year */

const yearMatch = line.match(/\((\d{4})-(\d{4}|ONWARD|ONWARDS)\)/);

if(yearMatch){

let start = parseInt(yearMatch[1]);
let end = yearMatch[2];

if(end === "ONWARD" || end === "ONWARDS"){
end = 2026;
}

end = parseInt(end);

let model = line
.replace(/\(.+\)/,"")
.replace(currentMake,"")
.trim();

vehicles.push({
make: currentMake,
model: model,
year_start: start,
year_end: end,
show_year_menu: true
});

}else{

if(line.includes(currentMake)){

let model = line.replace(currentMake,"").trim();

vehicles.push({
make: currentMake,
model: model,
year_start: 2000,
year_end: 2026,
show_year_menu: false
});

}

}

});

module.exports = {
vehicles
};
