/*
NDEstore Vehicle Database
Complete vehicle list extracted from Shopify menu
Used for AI vehicle detection for auto parts
*/

const VEHICLE_DATABASE = {

Toyota: {

Corolla_Altis: [
"Toyota Corolla 2002-2008",
"Toyota Corolla 2008-2021",
"Toyota Altis 1.8 2008-2018",
"Toyota Altis 1.6 2018-2021",
"Toyota Altis X 2021-2026",
"Toyota Corolla Grande 1.8 2008-2021",
"Toyota Grande X 2021-2026"
],

Yaris: [
"Toyota Yaris",
"Toyota Yaris 2024-2026",
"Toyota Yaris KSP210 2020-2026",
"Toyota Yaris Cross"
],

Hilux: [
"Toyota Hilux Vigo",
"Toyota Hilux Revo",
"Toyota Hilux Rocco"
],

Fortuner: [
"Toyota Fortuner",
"Toyota Fortuner GR-Sport"
],

Aqua: [
"Toyota Aqua 2011-2013",
"Toyota Aqua 2013-2014",
"Toyota Aqua 2014-2021",
"Toyota Aqua 2021-2026"
],

Vitz_1000: [
"Toyota Vitz 1000cc 1999-2005",
"Toyota Vitz 1000cc 2005-2010",
"Toyota Vitz 1000cc 2010-2014",
"Toyota Vitz 1000cc 2014-2018"
],

Raize: [
"Toyota Raize",
"Toyota Raize Hybrid"
],

Vitz_1300: [
"Toyota Vitz 1300cc 2005-2010",
"Toyota Vitz 1300cc 2010-2014",
"Toyota Vitz 1300cc 2014-2018",
"Toyota Vitz 1300cc 2018-2024"
],

Hilux_Surf: [
"Hilux Surf 2007-2009",
"Hilux Surf 2009-2013"
],

Land_Cruiser: [
"Land Cruiser Prado",
"Land Cruiser 70",
"Land Cruiser 80",
"Land Cruiser 90",
"Land Cruiser 100",
"Land Cruiser 120",
"Land Cruiser 200"
],

Crown: [
"Toyota Crown"
],

Delta: [
"Toyota Delta"
],

Prius: [
"Toyota Prius 2000-2005",
"Toyota Prius 2005-2010",
"Toyota Prius 2010-2015",
"Toyota Prius 2015-2021",
"Toyota Prius PHV"
],

Passo: [
"Toyota Passo 2004-2010",
"Toyota Passo 2010-2016"
],

Platz: [
"Toyota Platz 1999-2005"
],

Premio: [
"Toyota Premio 2001-2007",
"Toyota Premio 2007-2020"
],

Axio: [
"Toyota Axio 1.3",
"Toyota Axio 1.5"
],

Fielder: [
"Toyota Fielder"
],

C_HR: [
"Toyota C-HR"
],

Mark_X: [
"Toyota Mark X"
],

Probox: [
"Toyota Probox"
],

Rush: [
"Toyota Rush"
],

IQ: [
"Toyota iQ"
],

Corolla_Cross: [
"Toyota Corolla Cross"
]

},

Honda: {

Accord: [
"Honda Accord",
"Honda Accord CL9"
],

City: [
"Honda City 1996-2002",
"Honda City 2003-2008",
"Honda City 2009-2021"
],

Civic: [
"Honda Civic 1996-2000",
"Honda Civic 2001-2005",
"Honda Civic 2006-2012",
"Honda Civic 2013-2016",
"Honda Civic 2016-2021",
"Honda Civic 2022-Present"
],

BRV: ["Honda BRV"],
HRV: ["Honda HRV"],

Vezel: [
"Honda Vezel",
"Honda Vezel Hybrid"
],

N_Series: [
"Honda N Box",
"Honda N WGN"
],

Civic_JDM: ["Honda Civic JDM"],

Other_Models: [
"Honda Fit",
"Honda Freed",
"Honda Insight",
"Honda Jazz",
"Honda Life",
"Honda Amaze",
"Honda Zest",
"Honda Element",
"Honda Freed",
"Honda Crossroad"
]

},

Suzuki: {

Alto_Cultus: [
"Suzuki Alto 2009-2019",
"Suzuki Cultus",
"Suzuki Cultus Old Shape",
"Suzuki Cultus 2017-2021"
],

Swift: [
"Suzuki Swift",
"Suzuki Swift Sport"
],

Wagon_R: ["Suzuki Wagon R"],
Mehran: ["Suzuki Mehran"],
Alto: ["Suzuki Alto"],
Baleno: ["Suzuki Baleno"],
Ciaz: ["Suzuki Ciaz"],
Every: ["Suzuki Every"],
Hustler: ["Suzuki Hustler"],
Vitara: ["Suzuki Vitara"],
Jimny: ["Suzuki Jimny"],

Alto_JDM: [
"Suzuki Alto Eco",
"Suzuki Alto Works"
],

Liana: [
"Suzuki Liana 2005-2009"
],

Wagon_R_JDM: [
"Suzuki Wagon R 2003-2008",
"Suzuki Wagon R 2008-2013"
],

Every_Wagon: [
"Suzuki Every Wagon"
],

Swift_Sports: [
"Suzuki Swift Sports"
]

},

Hyundai: {

Elantra: [
"Hyundai Elantra",
"Hyundai Elantra Hybrid"
],

Tucson: [
"Hyundai Tucson",
"Hyundai Tucson Hybrid"
],

Santa_Fe: [
"Hyundai Santa Fe",
"Hyundai Santa Fe Hybrid"
],

Sonata: [
"Hyundai Sonata",
"Hyundai Sonata N Line"
],

Santro: ["Hyundai Santro"],
Grand_i10: ["Hyundai Grand i10"],
Accent: ["Hyundai Accent"]

},

KIA: {

Sportage: [
"KIA Sportage",
"KIA Sportage Alpha",
"KIA Sportage FWD"
],

Stonic: [
"KIA Stonic",
"KIA Stonic EX",
"KIA Stonic EX Plus"
],

Sorento: ["KIA Sorento"],
Carnival: ["KIA Grand Carnival"]

},

Daihatsu: {

Cuore: ["Daihatsu Cuore"],
Mira: ["Daihatsu Mira"],
Mira_ES: ["Daihatsu Mira ES"],
Move: ["Daihatsu Move"],
Boon: ["Daihatsu Boon"],
Charade: ["Daihatsu Charade"],
Copen: ["Daihatsu Copen"],
Terios: ["Daihatsu Terios"]

},

Changan: {

Alsvin: ["Changan Alsvin"],
Karvaan: ["Changan Karvaan"],
Oshan_X7: ["Changan Oshan X7"]

},

Haval: {

H6: ["Haval H6"],
Jolion: ["Haval Jolion"],
H9: ["Haval H9"]

},

Proton: {

Saga: ["Proton Saga"],
X70: ["Proton X70"]

},

MG: {

MG_HS: ["MG HS"],
MG_ZS: ["MG ZS"],
MG_ZS_EV: ["MG ZS EV"]

},

Nissan: {

Sunny: ["Nissan Sunny"],
Dayz: [
"Nissan Dayz",
"Nissan Dayz Highway Star"
],

Juke: ["Nissan Juke"],
Clipper: ["Nissan Clipper"],
Moco: ["Nissan Moco"],
Note: [
"Nissan Note",
"Nissan Note E Power"
],

Wingroad: ["Nissan Wingroad"],
AD_Van: ["Nissan AD Van"]

},

Mitsubishi: {

Lancer: ["Mitsubishi Lancer"],
EK_Wagon: ["Mitsubishi EK Wagon"],
Mirage: ["Mitsubishi Mirage"],
Pajero_Mini: ["Mitsubishi Pajero Mini"]

},

Lexus: [

"Lexus CT200h",
"Lexus ES",
"Lexus GS",
"Lexus IS",
"Lexus LS",
"Lexus LX",
"Lexus RX",
"Lexus UX"

],

Chevrolet: [

"Chevy Joy",
"Chevy Tracker"

],

Peugeot: [

"Peugeot 2008"

],

Mercedes: [

"Mercedes Benz C Class",
"Mercedes Benz E Class",
"Mercedes Benz CLA"

],

Audi: [

"Audi A3",
"Audi A4",
"Audi A5",
"Audi A6",
"Audi A7",
"Audi Q3",
"Audi Q5",
"Audi Q7"

],

BMW: [

"BMW 3 Series",
"BMW 5 Series",
"BMW 7 Series",
"BMW X1",
"BMW X3",
"BMW X5"

],

BYD: [

"BYD Atto 3",
"BYD Seal",
"BYD Shark"

],

JAC: [

"JAC T9"

],

Atlas: [

"Atlas Honda Truck"

]

};

module.exports = VEHICLE_DATABASE;
