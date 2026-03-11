/* =====================================================
AUTOMOTIVE VEHICLE KNOWLEDGE GRAPH
Understands Pakistani vehicle naming
===================================================== */

const VEHICLE_GRAPH = {

{
  "vehicles": [

    {"brand":"Suzuki","model":"Alto","variant":"VX","years":"2019-2024"},
    {"brand":"Suzuki","model":"Alto","variant":"VXR","years":"2019-2024"},
    {"brand":"Suzuki","model":"Alto","variant":"VXL AGS","years":"2019-2024"},

    {"brand":"Suzuki","model":"Cultus","variant":"VXR","years":"2017-2024"},
    {"brand":"Suzuki","model":"Cultus","variant":"VXL","years":"2017-2024"},
    {"brand":"Suzuki","model":"Cultus","variant":"AGS","years":"2017-2024"},

    {"brand":"Suzuki","model":"Swift","variant":"DLX","years":"2010-2016"},
    {"brand":"Suzuki","model":"Swift","variant":"GL","years":"2022-2024"},
    {"brand":"Suzuki","model":"Swift","variant":"GLX","years":"2022-2024"},

    {"brand":"Suzuki","model":"WagonR","variant":"VXR","years":"2014-2024"},
    {"brand":"Suzuki","model":"WagonR","variant":"VXL","years":"2014-2024"},
    {"brand":"Suzuki","model":"WagonR","variant":"AGS","years":"2014-2024"},

    {"brand":"Suzuki","model":"Mehran","variant":"VX","years":"2000-2019"},
    {"brand":"Suzuki","model":"Mehran","variant":"VXR","years":"2000-2019"},
    {"brand":"Suzuki","model":"Mehran","variant":"VXR Euro II","years":"2012-2019"},

    {"brand":"Suzuki","model":"Bolan","variant":"VX","years":"2000-2024"},
    {"brand":"Suzuki","model":"Bolan","variant":"Cargo","years":"2000-2024"},

    {"brand":"Suzuki","model":"Ravi","variant":"Pickup","years":"2000-2024"},

    {"brand":"Suzuki","model":"Jimny","variant":"GLX","years":"2021-2024"}

,


    {"brand":"Toyota","model":"Corolla","variant":"XE","years":"1993-1997"},
    {"brand":"Toyota","model":"Corolla","variant":"SE Saloon","years":"1993-1997"},

    {"brand":"Toyota","model":"Corolla","variant":"XE","years":"1998-2002"},
    {"brand":"Toyota","model":"Corolla","variant":"SE Saloon","years":"1998-2002"},

    {"brand":"Toyota","model":"Corolla","variant":"XLi","years":"2003-2008"},
    {"brand":"Toyota","model":"Corolla","variant":"GLi","years":"2003-2008"},
    {"brand":"Toyota","model":"Corolla","variant":"Altis","years":"2003-2008"},

    {"brand":"Toyota","model":"Corolla","variant":"XLi","years":"2009-2014"},
    {"brand":"Toyota","model":"Corolla","variant":"GLi","years":"2009-2014"},
    {"brand":"Toyota","model":"Corolla","variant":"Altis","years":"2009-2014"},

    {"brand":"Toyota","model":"Corolla","variant":"Altis 1.6","years":"2014-2024"},
    {"brand":"Toyota","model":"Corolla","variant":"Altis Grande","years":"2017-2024"}

,


    {"brand":"Toyota","model":"Yaris","variant":"GLI MT 1.3","years":"2020-2024"},
    {"brand":"Toyota","model":"Yaris","variant":"GLI CVT 1.3","years":"2020-2024"},
    {"brand":"Toyota","model":"Yaris","variant":"ATIV MT 1.3","years":"2020-2024"},
    {"brand":"Toyota","model":"Yaris","variant":"ATIV X CVT 1.5","years":"2020-2024"}

,


    {"brand":"Toyota","model":"Hilux","variant":"Single Cabin","years":"2005-2016"},
    {"brand":"Toyota","model":"Hilux","variant":"Revo E","years":"2017-2024"},
    {"brand":"Toyota","model":"Hilux","variant":"Revo V","years":"2017-2024"},
    {"brand":"Toyota","model":"Hilux","variant":"Revo Rocco","years":"2020-2024"}

,


    {"brand":"Toyota","model":"Fortuner","variant":"Sigma","years":"2006-2015"},
    {"brand":"Toyota","model":"Fortuner","variant":"G","years":"2016-2024"},
    {"brand":"Toyota","model":"Fortuner","variant":"V","years":"2016-2024"},
    {"brand":"Toyota","model":"Fortuner","variant":"Legender","years":"2022-2024"}

,


    {"brand":"Honda","model":"Civic","variant":"EXi","years":"1995-2000"},
    {"brand":"Honda","model":"Civic","variant":"VTi","years":"1995-2000"},

    {"brand":"Honda","model":"Civic","variant":"EXi","years":"2001-2006"},
    {"brand":"Honda","model":"Civic","variant":"VTi","years":"2001-2006"},
    {"brand":"Honda","model":"Civic","variant":"VTi Oriel","years":"2001-2006"},

    {"brand":"Honda","model":"Civic","variant":"Reborn","years":"2007-2012"},
    {"brand":"Honda","model":"Civic","variant":"Oriel","years":"2007-2012"},

    {"brand":"Honda","model":"Civic","variant":"Rebirth","years":"2013-2016"},
    {"brand":"Honda","model":"Civic","variant":"Oriel","years":"2013-2016"},

    {"brand":"Honda","model":"Civic","variant":"Turbo","years":"2016-2021"},
    {"brand":"Honda","model":"Civic","variant":"RS Turbo","years":"2022-2024"}

,


    {"brand":"Honda","model":"City","variant":"iDSI","years":"2003-2008"},
    {"brand":"Honda","model":"City","variant":"Aspire","years":"2014-2020"},
    {"brand":"Honda","model":"City","variant":"1.2 MT","years":"2021-2024"},
    {"brand":"Honda","model":"City","variant":"1.5 CVT","years":"2021-2024"}

,


    {"brand":"Honda","model":"BRV","variant":"iVTEC","years":"2017-2024"},
    {"brand":"Honda","model":"HRV","variant":"VTI","years":"2022-2024"}

,


    {"brand":"KIA","model":"Picanto","variant":"Manual","years":"2019-2024"},
    {"brand":"KIA","model":"Picanto","variant":"Automatic","years":"2019-2024"},

    {"brand":"KIA","model":"Sportage","variant":"Alpha","years":"2019-2024"},
    {"brand":"KIA","model":"Sportage","variant":"FWD","years":"2019-2024"},
    {"brand":"KIA","model":"Sportage","variant":"AWD","years":"2019-2024"}

,


    {"brand":"KIA","model":"Stonic","variant":"EX","years":"2021-2024"},

    {"brand":"KIA","model":"Sorento","variant":"3.5","years":"2021-2024"}

,


    {"brand":"Hyundai","model":"Tucson","variant":"GLS","years":"2020-2024"},
    {"brand":"Hyundai","model":"Elantra","variant":"GL","years":"2021-2024"},
    {"brand":"Hyundai","model":"Sonata","variant":"2.5","years":"2021-2024"}

,


    {"brand":"MG","model":"HS","variant":"Excite","years":"2021-2024"},
    {"brand":"MG","model":"HS","variant":"Essence","years":"2021-2024"},
    {"brand":"MG","model":"ZS","variant":"EV","years":"2022-2024"}

,


    {"brand":"Changan","model":"Alsvin","variant":"Comfort","years":"2021-2024"},
    {"brand":"Changan","model":"Alsvin","variant":"Lumiere","years":"2021-2024"},
    {"brand":"Changan","model":"Oshan","variant":"X7","years":"2022-2024"}

,


    {"brand":"DFSK","model":"Glory","variant":"580","years":"2021-2024"},
    {"brand":"DFSK","model":"Glory","variant":"580 Pro","years":"2022-2024"}

,


    {"brand":"Proton","model":"Saga","variant":"Standard","years":"2021-2024"},
    {"brand":"Proton","model":"X70","variant":"Premium","years":"2021-2024"}

,


    {"brand":"Haval","model":"H6","variant":"1.5T","years":"2023-2024"},
    {"brand":"Haval","model":"H6","variant":"2.0T","years":"2023-2024"}

,


{"brand":"Toyota","model":"Land Cruiser","variant":"VX","years":"1998-2007"},
{"brand":"Toyota","model":"Land Cruiser","variant":"ZX","years":"2008-2015"},
{"brand":"Toyota","model":"Land Cruiser","variant":"ZX","years":"2016-2021"},
{"brand":"Toyota","model":"Land Cruiser","variant":"ZX","years":"2022-2024"},

{"brand":"Toyota","model":"Prado","variant":"TX","years":"2003-2009"},
{"brand":"Toyota","model":"Prado","variant":"TZ","years":"2003-2009"},
{"brand":"Toyota","model":"Prado","variant":"TXL","years":"2010-2017"},
{"brand":"Toyota","model":"Prado","variant":"VX","years":"2018-2024"},

{"brand":"Toyota","model":"Corolla Cross","variant":"Hybrid","years":"2023-2024"},
{"brand":"Toyota","model":"Corolla Cross","variant":"HEV","years":"2023-2024"},

{"brand":"Toyota","model":"Raize","variant":"1.0T","years":"2023-2024"},

{"brand":"Honda","model":"Accord","variant":"CL7","years":"2003-2007"},
{"brand":"Honda","model":"Accord","variant":"CL9","years":"2003-2007"},
{"brand":"Honda","model":"Accord","variant":"2.4","years":"2008-2012"},
{"brand":"Honda","model":"Accord","variant":"9th Gen","years":"2013-2017"},
{"brand":"Honda","model":"Accord","variant":"10th Gen","years":"2018-2022"},

{"brand":"Honda","model":"CRV","variant":"2.0","years":"2002-2006"},
{"brand":"Honda","model":"CRV","variant":"2.4","years":"2007-2012"},
{"brand":"Honda","model":"CRV","variant":"2.4 AWD","years":"2013-2017"},
{"brand":"Honda","model":"CRV","variant":"Turbo","years":"2018-2022"},

{"brand":"Honda","model":"Vezel","variant":"Hybrid","years":"2014-2018"},
{"brand":"Honda","model":"Vezel","variant":"Hybrid Z","years":"2014-2018"},
{"brand":"Honda","model":"Vezel","variant":"Hybrid RS","years":"2019-2024"},

{"brand":"KIA","model":"Carnival","variant":"EX","years":"2022-2024"},
{"brand":"KIA","model":"Carnival","variant":"SX","years":"2022-2024"},

{"brand":"Hyundai","model":"Santa Fe","variant":"AWD","years":"2021-2024"},
{"brand":"Hyundai","model":"Staria","variant":"Lounge","years":"2022-2024"},

{"brand":"MG","model":"HS","variant":"PHEV","years":"2022-2024"},
{"brand":"MG","model":"ZS","variant":"Essence","years":"2021-2024"},

{"brand":"Changan","model":"Karvaan","variant":"1.0","years":"2019-2024"},
{"brand":"Changan","model":"Karvaan","variant":"Plus","years":"2019-2024"},

{"brand":"DFSK","model":"Glory","variant":"330","years":"2019-2024"},

{"brand":"BAIC","model":"BJ40","variant":"Plus","years":"2022-2024"},

{"brand":"Haval","model":"Jolion","variant":"HEV","years":"2024"},

{"brand":"Audi","model":"A3","variant":"1.2T","years":"2015-2018"},
{"brand":"Audi","model":"A3","variant":"1.4T","years":"2019-2024"},
{"brand":"Audi","model":"A4","variant":"1.8T","years":"2015-2018"},
{"brand":"Audi","model":"A4","variant":"2.0T","years":"2019-2024"},
{"brand":"Audi","model":"A5","variant":"Sportback","years":"2018-2024"},
{"brand":"Audi","model":"A6","variant":"2.0T","years":"2016-2024"},
{"brand":"Audi","model":"Q3","variant":"2.0T","years":"2016-2024"},
{"brand":"Audi","model":"Q5","variant":"2.0T","years":"2016-2024"},
{"brand":"Audi","model":"Q7","variant":"3.0T","years":"2016-2024"},

{"brand":"BMW","model":"3 Series","variant":"318i","years":"2015-2018"},
{"brand":"BMW","model":"3 Series","variant":"320i","years":"2019-2024"},
{"brand":"BMW","model":"5 Series","variant":"520i","years":"2016-2024"},
{"brand":"BMW","model":"7 Series","variant":"730Li","years":"2016-2024"},
{"brand":"BMW","model":"X1","variant":"sDrive18i","years":"2017-2024"},
{"brand":"BMW","model":"X3","variant":"xDrive30i","years":"2018-2024"},
{"brand":"BMW","model":"X5","variant":"xDrive40i","years":"2019-2024"},

{"brand":"Mercedes","model":"C Class","variant":"C180","years":"2015-2018"},
{"brand":"Mercedes","model":"C Class","variant":"C200","years":"2019-2024"},
{"brand":"Mercedes","model":"E Class","variant":"E200","years":"2016-2024"},
{"brand":"Mercedes","model":"S Class","variant":"S450","years":"2018-2024"},
{"brand":"Mercedes","model":"GLA","variant":"200","years":"2017-2024"},
{"brand":"Mercedes","model":"GLC","variant":"300","years":"2017-2024"},
{"brand":"Mercedes","model":"GLE","variant":"450","years":"2019-2024"},

{"brand":"Land Rover","model":"Range Rover Evoque","variant":"SE","years":"2016-2024"},
{"brand":"Land Rover","model":"Range Rover Velar","variant":"R Dynamic","years":"2018-2024"},
{"brand":"Land Rover","model":"Range Rover Sport","variant":"HSE","years":"2017-2024"},
{"brand":"Land Rover","model":"Range Rover","variant":"Autobiography","years":"2017-2024"},

{"brand":"Porsche","model":"Macan","variant":"Base","years":"2017-2024"},
{"brand":"Porsche","model":"Cayenne","variant":"S","years":"2017-2024"},


{"brand":"Suzuki","model":"Every","variant":"GA","years":"2010-2014"},
{"brand":"Suzuki","model":"Every","variant":"Join Turbo","years":"2015-2024"},
{"brand":"Suzuki","model":"Baleno","variant":"GL","years":"1999-2005"},
{"brand":"Suzuki","model":"Baleno","variant":"GTi","years":"1999-2005"},
{"brand":"Suzuki","model":"Liana","variant":"RXi","years":"2006-2010"},
{"brand":"Suzuki","model":"Liana","variant":"Eminent","years":"2006-2010"},
{"brand":"Suzuki","model":"Khyber","variant":"GA","years":"1993-2000"},
{"brand":"Suzuki","model":"Margalla","variant":"GL","years":"1992-1998"},
{"brand":"Suzuki","model":"APV","variant":"Van","years":"2005-2010"},
{"brand":"Suzuki","model":"Carry","variant":"Truck","years":"2016-2024"},

{"brand":"Toyota","model":"Passo","variant":"X","years":"2010-2015"},
{"brand":"Toyota","model":"Passo","variant":"Moda","years":"2016-2024"},
{"brand":"Toyota","model":"Vitz","variant":"F","years":"2005-2010"},
{"brand":"Toyota","model":"Vitz","variant":"Jewela","years":"2011-2019"},
{"brand":"Toyota","model":"Aqua","variant":"S","years":"2012-2017"},
{"brand":"Toyota","model":"Aqua","variant":"G","years":"2018-2024"},
{"brand":"Toyota","model":"Prius","variant":"S","years":"2010-2015"},
{"brand":"Toyota","model":"Prius","variant":"A Touring","years":"2016-2024"},
{"brand":"Toyota","model":"Premio","variant":"X","years":"2008-2015"},
{"brand":"Toyota","model":"Premio","variant":"F EX","years":"2016-2021"},
{"brand":"Toyota","model":"Allion","variant":"A15","years":"2008-2015"},
{"brand":"Toyota","model":"Allion","variant":"A18","years":"2016-2021"},
{"brand":"Toyota","model":"Mark X","variant":"250G","years":"2009-2015"},
{"brand":"Toyota","model":"Mark X","variant":"300G","years":"2016-2019"},
{"brand":"Toyota","model":"C-HR","variant":"Hybrid","years":"2018-2024"},
{"brand":"Toyota","model":"Rush","variant":"G","years":"2019-2024"},
{"brand":"Toyota","model":"Roomy","variant":"Custom G","years":"2018-2024"},

{"brand":"Honda","model":"Fit","variant":"Hybrid","years":"2013-2019"},
{"brand":"Honda","model":"Fit","variant":"Hybrid RS","years":"2020-2024"},
{"brand":"Honda","model":"Grace","variant":"Hybrid","years":"2015-2019"},
{"brand":"Honda","model":"Insight","variant":"Hybrid","years":"2010-2014"},
{"brand":"Honda","model":"Insight","variant":"EX","years":"2019-2024"},
{"brand":"Honda","model":"Freed","variant":"Hybrid","years":"2015-2024"},
{"brand":"Honda","model":"Stepwagon","variant":"Spada","years":"2016-2024"},
{"brand":"Honda","model":"Airwave","variant":"M","years":"2005-2010"},
{"brand":"Honda","model":"Airwave","variant":"ST","years":"2005-2010"},

{"brand":"KIA","model":"Rio","variant":"Sedan","years":"2013-2017"},
{"brand":"KIA","model":"Rio","variant":"Hatchback","years":"2018-2024"},
{"brand":"KIA","model":"Cerato","variant":"1.6","years":"2014-2018"},
{"brand":"KIA","model":"Cerato","variant":"2.0","years":"2019-2024"},
{"brand":"KIA","model":"Seltos","variant":"FWD","years":"2023-2024"},
{"brand":"KIA","model":"Soul","variant":"EX","years":"2015-2020"},
{"brand":"KIA","model":"Soul","variant":"GT Line","years":"2021-2024"},

{"brand":"Hyundai","model":"Accent","variant":"GL","years":"2006-2011"},
{"brand":"Hyundai","model":"Accent","variant":"GLS","years":"2012-2017"},
{"brand":"Hyundai","model":"Elantra","variant":"Sport","years":"2017-2020"},
{"brand":"Hyundai","model":"i10","variant":"Magna","years":"2012-2017"},
{"brand":"Hyundai","model":"i20","variant":"Active","years":"2016-2024"},
{"brand":"Hyundai","model":"Creta","variant":"1.5","years":"2019-2024"},
{"brand":"Hyundai","model":"Palisade","variant":"AWD","years":"2023-2024"},

{"brand":"MG","model":"RX8","variant":"Lux","years":"2022-2024"},
{"brand":"MG","model":"GT","variant":"1.5T","years":"2023-2024"},
{"brand":"MG","model":"Marvel R","variant":"EV","years":"2024"},

{"brand":"Changan","model":"CS35","variant":"Plus","years":"2020-2024"},
{"brand":"Changan","model":"CS55","variant":"Plus","years":"2023-2024"},
{"brand":"Changan","model":"Hunter","variant":"Pickup","years":"2024"},
{"brand":"Changan","model":"UNI-T","variant":"1.5T","years":"2023-2024"},
{"brand":"Changan","model":"UNI-K","variant":"2.0T","years":"2024"},

{"brand":"DFSK","model":"K01","variant":"Pickup","years":"2019-2024"},
{"brand":"DFSK","model":"K07","variant":"Van","years":"2019-2024"},
{"brand":"DFSK","model":"Seres","variant":"3 EV","years":"2021-2024"},

{"brand":"Proton","model":"Persona","variant":"1.6","years":"2022-2024"},
{"brand":"Proton","model":"X50","variant":"Flagship","years":"2024"},

{"brand":"Haval","model":"H6","variant":"HEV","years":"2023-2024"},
{"brand":"Haval","model":"H9","variant":"SUV","years":"2024"},

{"brand":"Toyota","model":"Belta","variant":"X","years":"2006-2012"},
{"brand":"Toyota","model":"Belta","variant":"G","years":"2006-2012"},
{"brand":"Toyota","model":"Axio","variant":"Hybrid","years":"2013-2018"},
{"brand":"Toyota","model":"Axio","variant":"G","years":"2019-2024"},
{"brand":"Toyota","model":"Fielder","variant":"Hybrid","years":"2013-2018"},
{"brand":"Toyota","model":"Fielder","variant":"G","years":"2019-2024"},
{"brand":"Toyota","model":"Noah","variant":"X","years":"2014-2019"},
{"brand":"Toyota","model":"Noah","variant":"Si","years":"2020-2024"},
{"brand":"Toyota","model":"Voxy","variant":"ZS","years":"2014-2019"},
{"brand":"Toyota","model":"Voxy","variant":"Hybrid","years":"2020-2024"},
{"brand":"Toyota","model":"Esquire","variant":"Hybrid Gi","years":"2015-2021"},
{"brand":"Toyota","model":"Estima","variant":"Hybrid","years":"2009-2015"},
{"brand":"Toyota","model":"Estima","variant":"Aeras","years":"2016-2019"},
{"brand":"Toyota","model":"Alphard","variant":"2.5 Hybrid","years":"2016-2024"},
{"brand":"Toyota","model":"Vellfire","variant":"2.5 Hybrid","years":"2016-2024"},
{"brand":"Toyota","model":"Hilux Surf","variant":"SSR-X","years":"1998-2005"},
{"brand":"Toyota","model":"Surf","variant":"SSR-G","years":"2006-2009"},
{"brand":"Toyota","model":"Land Cruiser","variant":"AX","years":"2016-2021"},
{"brand":"Toyota","model":"Land Cruiser","variant":"GR Sport","years":"2022-2024"},

{"brand":"Honda","model":"Civic","variant":"VTi","years":"1992-1995"},
{"brand":"Honda","model":"Civic","variant":"EX","years":"1992-1995"},
{"brand":"Honda","model":"Civic","variant":"VTi Oriel","years":"1996-2000"},
{"brand":"Honda","model":"Civic","variant":"EXi","years":"1996-2000"},
{"brand":"Honda","model":"Civic","variant":"Hybrid","years":"2006-2010"},
{"brand":"Honda","model":"Civic","variant":"RS","years":"2022-2024"},
{"brand":"Honda","model":"City","variant":"EXi","years":"2000-2003"},
{"brand":"Honda","model":"City","variant":"iDSI","years":"2003-2008"},
{"brand":"Honda","model":"City","variant":"Aspire 1.5","years":"2015-2020"},
{"brand":"Honda","model":"City","variant":"Aspire Prosmatec","years":"2015-2020"},
{"brand":"Honda","model":"BRV","variant":"i-VTEC S","years":"2017-2020"},
{"brand":"Honda","model":"BRV","variant":"i-VTEC S CVT","years":"2021-2024"},
{"brand":"Honda","model":"HRV","variant":"VTI S","years":"2022-2024"},
{"brand":"Honda","model":"HRV","variant":"VTI L","years":"2022-2024"},

{"brand":"Suzuki","model":"Alto","variant":"VX","years":"2000-2012"},
{"brand":"Suzuki","model":"Alto","variant":"VXR","years":"2000-2012"},
{"brand":"Suzuki","model":"Alto","variant":"Eco","years":"2013-2018"},
{"brand":"Suzuki","model":"Alto","variant":"F","years":"2019-2024"},
{"brand":"Suzuki","model":"Cultus","variant":"VXLi","years":"2000-2007"},
{"brand":"Suzuki","model":"Cultus","variant":"VXRi","years":"2000-2007"},
{"brand":"Suzuki","model":"Cultus","variant":"Euro II","years":"2012-2016"},
{"brand":"Suzuki","model":"Swift","variant":"DLX","years":"2010-2017"},
{"brand":"Suzuki","model":"Swift","variant":"Automatic","years":"2018-2021"},
{"brand":"Suzuki","model":"WagonR","variant":"AGS Limited","years":"2020-2024"},
{"brand":"Suzuki","model":"Bolan","variant":"Euro II","years":"2013-2024"},
{"brand":"Suzuki","model":"Ravi","variant":"Euro II","years":"2013-2024"},

{"brand":"KIA","model":"Sportage","variant":"Limited Edition","years":"2022-2024"},
{"brand":"KIA","model":"Sportage","variant":"HEV","years":"2023-2024"},
{"brand":"KIA","model":"Picanto","variant":"AT","years":"2019-2024"},
{"brand":"KIA","model":"Sorento","variant":"2.4 FWD","years":"2021-2024"},
{"brand":"KIA","model":"Sorento","variant":"3.5 AWD","years":"2021-2024"},
{"brand":"KIA","model":"Stonic","variant":"EX Plus","years":"2021-2024"},

{"brand":"Hyundai","model":"Tucson","variant":"AWD Ultimate","years":"2021-2024"},
{"brand":"Hyundai","model":"Tucson","variant":"FWD GLS","years":"2020-2024"},
{"brand":"Hyundai","model":"Elantra","variant":"Hybrid","years":"2023-2024"},
{"brand":"Hyundai","model":"Sonata","variant":"N Line","years":"2021-2024"},
{"brand":"Hyundai","model":"Porter","variant":"H100","years":"2005-2024"},

{"brand":"MG","model":"HS","variant":"Trophy","years":"2021-2024"},
{"brand":"MG","model":"ZS","variant":"EV Long Range","years":"2023-2024"},
{"brand":"MG","model":"HS","variant":"Essence","years":"2021-2024"},

{"brand":"Changan","model":"Alsvin","variant":"Lumiere Black Edition","years":"2023-2024"},
{"brand":"Changan","model":"Oshan","variant":"X7 FutureSense","years":"2022-2024"},
{"brand":"Changan","model":"Karvaan","variant":"Power Plus","years":"2022-2024"},

{"brand":"Haval","model":"H6","variant":"GT","years":"2023-2024"},
{"brand":"Haval","model":"Jolion","variant":"Premium","years":"2023-2024"},

{"brand":"Proton","model":"Saga","variant":"Ace","years":"2021-2024"},
{"brand":"Proton","model":"X70","variant":"Executive","years":"2021-2024"},

{"brand":"BAIC","model":"BJ40","variant":"Champion","years":"2023-2024"},
{"brand":"DFSK","model":"Glory","variant":"580 CVT","years":"2021-2024"},

{"brand":"Toyota","model":"Crown","variant":"Royal Saloon","years":"2005-2010"},
{"brand":"Toyota","model":"Crown","variant":"Athlete","years":"2011-2018"},
{"brand":"Toyota","model":"Crown","variant":"RS Hybrid","years":"2019-2024"},
{"brand":"Toyota","model":"Harrier","variant":"Premium","years":"2014-2019"},
{"brand":"Toyota","model":"Harrier","variant":"Hybrid Z","years":"2020-2024"},
{"brand":"Toyota","model":"Sienta","variant":"Hybrid","years":"2016-2024"},
{"brand":"Toyota","model":"Spade","variant":"G","years":"2013-2020"},
{"brand":"Toyota","model":"Probox","variant":"DX","years":"2015-2024"},
{"brand":"Toyota","model":"TownAce","variant":"GL","years":"2012-2024"},
{"brand":"Toyota","model":"Hiace","variant":"Commuter","years":"2005-2018"},
{"brand":"Toyota","model":"Hiace","variant":"Grand Cabin","years":"2019-2024"},

{"brand":"Honda","model":"CRZ","variant":"Hybrid","years":"2010-2015"},
{"brand":"Honda","model":"Stream","variant":"RSZ","years":"2007-2013"},
{"brand":"Honda","model":"Odyssey","variant":"Absolute","years":"2009-2015"},
{"brand":"Honda","model":"Odyssey","variant":"Hybrid","years":"2016-2024"},
{"brand":"Honda","model":"Mobilio","variant":"iVTEC","years":"2015-2018"},
{"brand":"Honda","model":"Mobilio","variant":"RS","years":"2015-2018"},
{"brand":"Honda","model":"Shuttle","variant":"Hybrid","years":"2016-2024"},

{"brand":"Suzuki","model":"Ciaz","variant":"Manual","years":"2017-2020"},
{"brand":"Suzuki","model":"Ciaz","variant":"Automatic","years":"2017-2020"},
{"brand":"Suzuki","model":"Ignis","variant":"Hybrid","years":"2016-2022"},
{"brand":"Suzuki","model":"Hustler","variant":"Hybrid X","years":"2018-2024"},
{"brand":"Suzuki","model":"Spacia","variant":"Hybrid G","years":"2018-2024"},
{"brand":"Suzuki","model":"Palette","variant":"SW","years":"2009-2013"},

{"brand":"KIA","model":"Optima","variant":"2.4","years":"2013-2016"},
{"brand":"KIA","model":"Optima","variant":"GT Line","years":"2017-2020"},
{"brand":"KIA","model":"Telluride","variant":"SX","years":"2020-2024"},
{"brand":"KIA","model":"Niro","variant":"Hybrid","years":"2019-2024"},

{"brand":"Hyundai","model":"Verna","variant":"1.6","years":"2011-2016"},
{"brand":"Hyundai","model":"Verna","variant":"1.6 GLS","years":"2017-2022"},
{"brand":"Hyundai","model":"Kona","variant":"Electric","years":"2020-2024"},
{"brand":"Hyundai","model":"Venue","variant":"1.0T","years":"2020-2024"},
{"brand":"Hyundai","model":"Grand Starex","variant":"GLS","years":"2014-2020"},

{"brand":"MG","model":"ZS","variant":"Standard","years":"2021-2024"},
{"brand":"MG","model":"HS","variant":"Luxury","years":"2021-2024"},
{"brand":"MG","model":"5","variant":"Sedan","years":"2023-2024"},

{"brand":"Changan","model":"CS75","variant":"Plus","years":"2022-2024"},
{"brand":"Changan","model":"CS95","variant":"Flagship","years":"2024"},

{"brand":"Haval","model":"H2","variant":"1.5T","years":"2018-2021"},
{"brand":"Haval","model":"H4","variant":"1.5T","years":"2019-2022"},
{"brand":"Haval","model":"Dargo","variant":"2.0T","years":"2024"},

{"brand":"Proton","model":"Iriz","variant":"Standard","years":"2022-2024"},
{"brand":"Proton","model":"Persona","variant":"Premium","years":"2022-2024"},

{"brand":"BAIC","model":"X25","variant":"Comfort","years":"2018-2020"},
{"brand":"BAIC","model":"X55","variant":"Luxury","years":"2023-2024"},

{"brand":"DFSK","model":"C31","variant":"Pickup","years":"2019-2024"},
{"brand":"DFSK","model":"C32","variant":"Dual Cabin","years":"2019-2024"},

{"brand":"Toyota","model":"Avanza","variant":"1.5","years":"2014-2018"},
{"brand":"Toyota","model":"Avanza","variant":"1.5 AT","years":"2019-2024"},
{"brand":"Toyota","model":"Fortuner","variant":"TRD Sportivo","years":"2013-2015"},
{"brand":"Toyota","model":"Fortuner","variant":"GR Sport","years":"2022-2024"},
{"brand":"Toyota","model":"Hilux","variant":"Revo G","years":"2017-2024"},
{"brand":"Toyota","model":"Hilux","variant":"Revo GR Sport","years":"2023-2024"},
{"brand":"Toyota","model":"Camry","variant":"2.5 Hybrid","years":"2018-2024"},
{"brand":"Toyota","model":"Camry","variant":"2.4","years":"2012-2017"},
{"brand":"Toyota","model":"Land Cruiser Prado","variant":"TX","years":"2010-2013"},
{"brand":"Toyota","model":"Land Cruiser Prado","variant":"VX","years":"2014-2017"},
{"brand":"Toyota","model":"Land Cruiser Prado","variant":"VX","years":"2018-2024"},

{"brand":"Honda","model":"Accord","variant":"2.0T","years":"2018-2024"},
{"brand":"Honda","model":"CRV","variant":"Hybrid","years":"2020-2024"},
{"brand":"Honda","model":"HRV","variant":"Hybrid","years":"2023-2024"},
{"brand":"Honda","model":"City","variant":"1.3 MT","years":"2012-2014"},
{"brand":"Honda","model":"City","variant":"1.3 AT","years":"2012-2014"},
{"brand":"Honda","model":"City","variant":"1.5 Aspire MT","years":"2015-2020"},
{"brand":"Honda","model":"City","variant":"1.5 Aspire CVT","years":"2015-2020"},

{"brand":"Suzuki","model":"Swift","variant":"GL Auto","years":"2022-2024"},
{"brand":"Suzuki","model":"Swift","variant":"GLX CVT","years":"2022-2024"},
{"brand":"Suzuki","model":"Cultus","variant":"VXR Euro II","years":"2012-2016"},
{"brand":"Suzuki","model":"Cultus","variant":"VXL AGS","years":"2017-2024"},
{"brand":"Suzuki","model":"WagonR","variant":"VXR Limited","years":"2020-2024"},
{"brand":"Suzuki","model":"WagonR","variant":"Stingray Hybrid","years":"2018-2024"},
{"brand":"Suzuki","model":"Alto","variant":"L","years":"2019-2024"},
{"brand":"Suzuki","model":"Alto","variant":"Hybrid S","years":"2021-2024"},

{"brand":"KIA","model":"Sportage","variant":"Hybrid","years":"2023-2024"},
{"brand":"KIA","model":"Sportage","variant":"AWD Limited","years":"2023-2024"},
{"brand":"KIA","model":"Picanto","variant":"GT Line","years":"2023-2024"},
{"brand":"KIA","model":"Carnival","variant":"Limousine","years":"2023-2024"},

{"brand":"Hyundai","model":"Tucson","variant":"Hybrid","years":"2023-2024"},
{"brand":"Hyundai","model":"Elantra","variant":"GLS","years":"2021-2024"},
{"brand":"Hyundai","model":"Sonata","variant":"Hybrid","years":"2021-2024"},
{"brand":"Hyundai","model":"Santa Fe","variant":"Hybrid","years":"2023-2024"},

{"brand":"MG","model":"HS","variant":"Trophy AWD","years":"2022-2024"},
{"brand":"MG","model":"ZS","variant":"EV Trophy","years":"2022-2024"},
{"brand":"MG","model":"5","variant":"Luxury","years":"2023-2024"},

{"brand":"Changan","model":"Alsvin","variant":"Comfort Black Edition","years":"2023-2024"},
{"brand":"Changan","model":"Oshan","variant":"X7 Plus","years":"2023-2024"},
{"brand":"Changan","model":"CS55","variant":"Plus Limited","years":"2024"},

{"brand":"Haval","model":"H6","variant":"1.5T Premium","years":"2023-2024"},
{"brand":"Haval","model":"H6","variant":"2.0T AWD","years":"2023-2024"},
{"brand":"Haval","model":"Jolion","variant":"Luxury","years":"2023-2024"},

{"brand":"Proton","model":"Saga","variant":"Standard MT","years":"2021-2024"},
{"brand":"Proton","model":"Saga","variant":"Standard AT","years":"2021-2024"},
{"brand":"Proton","model":"X70","variant":"Premium AWD","years":"2021-2024"},

{"brand":"BAIC","model":"BJ40","variant":"Champion Edition","years":"2024"},
{"brand":"BAIC","model":"X35","variant":"Luxury","years":"2021-2023"},

{"brand":"DFSK","model":"Glory","variant":"580 Pro CVT","years":"2022-2024"},
{"brand":"DFSK","model":"Seres","variant":"3 EV Luxury","years":"2022-2024"},

{"brand":"Toyota","model":"Corolla","variant":"GLi 1.3","years":"2015-2017"},
{"brand":"Toyota","model":"Corolla","variant":"XLi 1.3","years":"2015-2017"},
{"brand":"Toyota","model":"Corolla","variant":"Altis 1.8","years":"2014-2017"},
{"brand":"Toyota","model":"Corolla","variant":"Altis Grande CVT","years":"2018-2021"},
{"brand":"Toyota","model":"Corolla","variant":"Altis Grande X CVT-i","years":"2021-2024"},

{"brand":"Toyota","model":"Yaris","variant":"ATIV X MT 1.5","years":"2020-2024"},
{"brand":"Toyota","model":"Yaris","variant":"ATIV X CVT 1.5 Beige","years":"2020-2024"},
{"brand":"Toyota","model":"Yaris","variant":"GLI CVT 1.3 Beige","years":"2020-2024"},

{"brand":"Honda","model":"Civic","variant":"VTi Prosmatec","years":"2013-2016"},
{"brand":"Honda","model":"Civic","variant":"VTi Oriel Prosmatec","years":"2013-2016"},
{"brand":"Honda","model":"Civic","variant":"1.8 i-VTEC","years":"2016-2021"},
{"brand":"Honda","model":"Civic","variant":"1.5 RS Turbo","years":"2022-2024"},

{"brand":"Honda","model":"City","variant":"1.5 Aspire MT","years":"2021-2024"},
{"brand":"Honda","model":"City","variant":"1.5 Aspire CVT","years":"2021-2024"},

{"brand":"Suzuki","model":"Swift","variant":"DLX Navigation","years":"2013-2017"},
{"brand":"Suzuki","model":"Swift","variant":"GLX CVT Navigation","years":"2022-2024"},

{"brand":"Suzuki","model":"Cultus","variant":"VXL Navigation","years":"2018-2024"},
{"brand":"Suzuki","model":"WagonR","variant":"VXL AGS Navigation","years":"2019-2024"},

{"brand":"KIA","model":"Sportage","variant":"Alpha Plus","years":"2021-2024"},
{"brand":"KIA","model":"Sportage","variant":"FWD Limited","years":"2021-2024"},
{"brand":"KIA","model":"Sportage","variant":"AWD Limited","years":"2021-2024"},

{"brand":"KIA","model":"Picanto","variant":"1.0 MT","years":"2019-2024"},
{"brand":"KIA","model":"Picanto","variant":"1.0 AT","years":"2019-2024"},

{"brand":"Hyundai","model":"Tucson","variant":"FWD A/T","years":"2020-2024"},
{"brand":"Hyundai","model":"Tucson","variant":"AWD A/T","years":"2020-2024"},

{"brand":"Hyundai","model":"Elantra","variant":"Smart","years":"2021-2024"},
{"brand":"Hyundai","model":"Elantra","variant":"GLS","years":"2021-2024"},

{"brand":"MG","model":"HS","variant":"1.5T Excite","years":"2021-2024"},
{"brand":"MG","model":"HS","variant":"1.5T Essence","years":"2021-2024"},

{"brand":"Changan","model":"Alsvin","variant":"1.5 Comfort","years":"2021-2024"},
{"brand":"Changan","model":"Alsvin","variant":"1.5 Lumiere","years":"2021-2024"},

{"brand":"Changan","model":"Oshan","variant":"X7 Comfort","years":"2022-2024"},
{"brand":"Changan","model":"Oshan","variant":"X7 FutureSense","years":"2022-2024"},

{"brand":"Haval","model":"H6","variant":"1.5T","years":"2023-2024"},
{"brand":"Haval","model":"H6","variant":"2.0T AWD","years":"2023-2024"},

{"brand":"Proton","model":"Saga","variant":"1.3 MT","years":"2021-2024"},
{"brand":"Proton","model":"Saga","variant":"1.3 AT","years":"2021-2024"},

{"brand":"Proton","model":"X70","variant":"Executive FWD","years":"2021-2024"},
{"brand":"Proton","model":"X70","variant":"Premium AWD","years":"2021-2024"},

{"brand":"Toyota","model":"Corolla","variant":"SE Limited","years":"2000-2002"},
{"brand":"Toyota","model":"Corolla","variant":"SE Saloon","years":"1998-2002"},
{"brand":"Toyota","model":"Corolla","variant":"Altis SR","years":"2005-2008"},
{"brand":"Toyota","model":"Corolla","variant":"Altis Cruisetronic","years":"2005-2008"},
{"brand":"Toyota","model":"Corolla","variant":"GLi Automatic","years":"2009-2014"},
{"brand":"Toyota","model":"Corolla","variant":"XLi VVTi","years":"2009-2014"},

{"brand":"Toyota","model":"Yaris","variant":"GLI MT 1.5","years":"2020-2024"},
{"brand":"Toyota","model":"Yaris","variant":"ATIV MT 1.5 Black","years":"2020-2024"},
{"brand":"Toyota","model":"Yaris","variant":"ATIV CVT 1.5 Black","years":"2020-2024"},

{"brand":"Toyota","model":"Fortuner","variant":"2.7 VVTi","years":"2016-2020"},
{"brand":"Toyota","model":"Fortuner","variant":"Sigma 4","years":"2012-2015"},
{"brand":"Toyota","model":"Fortuner","variant":"Legender 2.8","years":"2022-2024"},

{"brand":"Honda","model":"Civic","variant":"VTI Manual","years":"2001-2006"},
{"brand":"Honda","model":"Civic","variant":"VTI Automatic","years":"2001-2006"},
{"brand":"Honda","model":"Civic","variant":"Oriel Navigation","years":"2016-2021"},
{"brand":"Honda","model":"Civic","variant":"RS Navigation","years":"2022-2024"},

{"brand":"Honda","model":"City","variant":"1.3 i-VTEC","years":"2009-2014"},
{"brand":"Honda","model":"City","variant":"1.5 Aspire Navigation","years":"2015-2020"},

{"brand":"Suzuki","model":"Alto","variant":"VX Euro II","years":"2012-2018"},
{"brand":"Suzuki","model":"Alto","variant":"VXR Euro II","years":"2012-2018"},
{"brand":"Suzuki","model":"Alto","variant":"VXL AGS Navigation","years":"2019-2024"},

{"brand":"Suzuki","model":"Cultus","variant":"VXR Navigation","years":"2018-2024"},
{"brand":"Suzuki","model":"Cultus","variant":"VXL AGS Navigation","years":"2018-2024"},

{"brand":"Suzuki","model":"Swift","variant":"GLX Navigation","years":"2022-2024"},

{"brand":"KIA","model":"Sportage","variant":"Alpha Navigation","years":"2021-2024"},
{"brand":"KIA","model":"Sportage","variant":"FWD Navigation","years":"2021-2024"},
{"brand":"KIA","model":"Sportage","variant":"AWD Navigation","years":"2021-2024"},

{"brand":"KIA","model":"Stonic","variant":"EX Navigation","years":"2021-2024"},

{"brand":"Hyundai","model":"Tucson","variant":"GLS Navigation","years":"2020-2024"},
{"brand":"Hyundai","model":"Tucson","variant":"Ultimate AWD Navigation","years":"2021-2024"},

{"brand":"Hyundai","model":"Elantra","variant":"GL Navigation","years":"2021-2024"},

{"brand":"MG","model":"HS","variant":"Essence Panorama","years":"2021-2024"},
{"brand":"MG","model":"HS","variant":"PHEV Essence","years":"2022-2024"},

{"brand":"Changan","model":"Alsvin","variant":"Lumiere Navigation","years":"2021-2024"},

{"brand":"Changan","model":"Oshan","variant":"X7 Navigation","years":"2022-2024"},

{"brand":"Haval","model":"H6","variant":"HEV Hybrid","years":"2023-2024"},

{"brand":"Proton","model":"Saga","variant":"Premium AT","years":"2021-2024"},

{"brand":"Proton","model":"X70","variant":"Flagship AWD","years":"2021-2024"},

{"brand":"Toyota","model":"Corolla","variant":"XLi Special Edition","years":"2012-2014"},
{"brand":"Toyota","model":"Corolla","variant":"GLi Limited Edition","years":"2012-2014"},
{"brand":"Toyota","model":"Corolla","variant":"Altis SR Cruisetronic","years":"2005-2008"},
{"brand":"Toyota","model":"Corolla","variant":"Altis Grande Black Interior","years":"2018-2021"},
{"brand":"Toyota","model":"Corolla","variant":"Altis Grande X Black Interior","years":"2021-2024"},

{"brand":"Toyota","model":"Hilux","variant":"Revo E Automatic","years":"2017-2024"},
{"brand":"Toyota","model":"Hilux","variant":"Revo V Automatic","years":"2017-2024"},
{"brand":"Toyota","model":"Hilux","variant":"Revo Rocco Automatic","years":"2020-2024"},

{"brand":"Toyota","model":"Land Cruiser","variant":"VX Limited","years":"2008-2015"},
{"brand":"Toyota","model":"Land Cruiser","variant":"ZX Limited","years":"2016-2021"},
{"brand":"Toyota","model":"Land Cruiser","variant":"GR Sport","years":"2022-2024"},

{"brand":"Honda","model":"Civic","variant":"VTi Prosmatec Navigation","years":"2013-2016"},
{"brand":"Honda","model":"Civic","variant":"VTi Oriel Prosmatec Navigation","years":"2013-2016"},
{"brand":"Honda","model":"Civic","variant":"Turbo Oriel","years":"2016-2021"},
{"brand":"Honda","model":"Civic","variant":"RS Turbo Navigation","years":"2022-2024"},

{"brand":"Honda","model":"City","variant":"1.5 Aspire Prosmatec","years":"2015-2020"},
{"brand":"Honda","model":"City","variant":"1.2 CVT","years":"2021-2024"},
{"brand":"Honda","model":"City","variant":"1.5 Aspire CVT Navigation","years":"2021-2024"},

{"brand":"Suzuki","model":"WagonR","variant":"VXR Euro II","years":"2014-2018"},
{"brand":"Suzuki","model":"WagonR","variant":"VXL AGS","years":"2014-2024"},
{"brand":"Suzuki","model":"WagonR","variant":"VXL AGS Navigation","years":"2019-2024"},

{"brand":"Suzuki","model":"Swift","variant":"GL Manual","years":"2022-2024"},
{"brand":"Suzuki","model":"Swift","variant":"GL CVT","years":"2022-2024"},
{"brand":"Suzuki","model":"Swift","variant":"GLX CVT Navigation","years":"2022-2024"},

{"brand":"KIA","model":"Sportage","variant":"Alpha A/T","years":"2020-2024"},
{"brand":"KIA","model":"Sportage","variant":"FWD A/T","years":"2020-2024"},
{"brand":"KIA","model":"Sportage","variant":"AWD A/T","years":"2020-2024"},

{"brand":"KIA","model":"Sorento","variant":"2.4 FWD","years":"2021-2024"},
{"brand":"KIA","model":"Sorento","variant":"3.5 AWD","years":"2021-2024"},

{"brand":"Hyundai","model":"Tucson","variant":"GLS Sport","years":"2020-2024"},
{"brand":"Hyundai","model":"Tucson","variant":"Ultimate AWD","years":"2021-2024"},

{"brand":"Hyundai","model":"Sonata","variant":"2.5 Smart","years":"2021-2024"},
{"brand":"Hyundai","model":"Sonata","variant":"2.5 Signature","years":"2021-2024"},

{"brand":"MG","model":"HS","variant":"Excite Panorama","years":"2021-2024"},
{"brand":"MG","model":"HS","variant":"Essence Panorama","years":"2021-2024"},

{"brand":"Changan","model":"Alsvin","variant":"1.5 Comfort Automatic","years":"2021-2024"},
{"brand":"Changan","model":"Alsvin","variant":"1.5 Lumiere Automatic","years":"2021-2024"},

{"brand":"Changan","model":"Oshan","variant":"X7 Comfort Automatic","years":"2022-2024"},
{"brand":"Changan","model":"Oshan","variant":"X7 FutureSense Automatic","years":"2022-2024"},

{"brand":"Haval","model":"H6","variant":"1.5T Hybrid","years":"2023-2024"},
{"brand":"Haval","model":"H6","variant":"2.0T AWD Hybrid","years":"2023-2024"},

{"brand":"Proton","model":"Saga","variant":"Standard Manual","years":"2021-2024"},
{"brand":"Proton","model":"Saga","variant":"Standard Automatic","years":"2021-2024"},
{"brand":"Proton","model":"Saga","variant":"Ace Automatic","years":"2021-2024"},

{"brand":"Proton","model":"X70","variant":"Executive Automatic","years":"2021-2024"},
{"brand":"Proton","model":"X70","variant":"Premium Automatic","years":"2021-2024"},

{"brand":"Toyota","model":"Corolla","variant":"Altis 1.8 CVT-i","years":"2014-2017"},
{"brand":"Toyota","model":"Corolla","variant":"Altis 1.8 Grande CVT-i","years":"2017-2021"},
{"brand":"Toyota","model":"Corolla","variant":"Altis 1.6 Special Edition","years":"2019-2021"},
{"brand":"Toyota","model":"Corolla","variant":"Altis X Manual 1.6","years":"2021-2024"},
{"brand":"Toyota","model":"Corolla","variant":"Altis X CVT-i 1.8","years":"2021-2024"},

{"brand":"Toyota","model":"Hilux","variant":"Revo G Manual","years":"2017-2024"},
{"brand":"Toyota","model":"Hilux","variant":"Revo V Manual","years":"2017-2024"},
{"brand":"Toyota","model":"Hilux","variant":"Revo Rocco Manual","years":"2020-2024"},

{"brand":"Toyota","model":"Fortuner","variant":"G 2.7 VVTi","years":"2016-2020"},
{"brand":"Toyota","model":"Fortuner","variant":"V 2.7 VVTi","years":"2016-2020"},
{"brand":"Toyota","model":"Fortuner","variant":"Sigma 4 2.8 Diesel","years":"2016-2021"},
{"brand":"Toyota","model":"Fortuner","variant":"Legender 2.8 Diesel","years":"2022-2024"},

{"brand":"Honda","model":"Civic","variant":"VTi Manual","years":"2016-2021"},
{"brand":"Honda","model":"Civic","variant":"VTi Oriel CVT","years":"2016-2021"},
{"brand":"Honda","model":"Civic","variant":"RS Turbo CVT","years":"2022-2024"},

{"brand":"Honda","model":"City","variant":"1.5 MT","years":"2021-2024"},
{"brand":"Honda","model":"City","variant":"1.5 CVT","years":"2021-2024"},

{"brand":"Suzuki","model":"Swift","variant":"GL MT","years":"2022-2024"},
{"brand":"Suzuki","model":"Swift","variant":"GL CVT","years":"2022-2024"},
{"brand":"Suzuki","model":"Swift","variant":"GLX CVT","years":"2022-2024"},

{"brand":"Suzuki","model":"Cultus","variant":"VXR Manual","years":"2017-2024"},
{"brand":"Suzuki","model":"Cultus","variant":"VXL Manual","years":"2017-2024"},
{"brand":"Suzuki","model":"Cultus","variant":"VXL AGS","years":"2017-2024"},

{"brand":"Suzuki","model":"Alto","variant":"VXR Manual","years":"2019-2024"},
{"brand":"Suzuki","model":"Alto","variant":"VXL AGS","years":"2019-2024"},

{"brand":"KIA","model":"Sportage","variant":"Alpha Automatic","years":"2020-2024"},
{"brand":"KIA","model":"Sportage","variant":"FWD Automatic","years":"2020-2024"},
{"brand":"KIA","model":"Sportage","variant":"AWD Automatic","years":"2020-2024"},

{"brand":"KIA","model":"Stonic","variant":"EX Automatic","years":"2021-2024"},

{"brand":"Hyundai","model":"Tucson","variant":"GLS Automatic","years":"2020-2024"},
{"brand":"Hyundai","model":"Tucson","variant":"Ultimate AWD Automatic","years":"2021-2024"},

{"brand":"Hyundai","model":"Elantra","variant":"GL Automatic","years":"2021-2024"},
{"brand":"Hyundai","model":"Elantra","variant":"GLS Automatic","years":"2021-2024"},

{"brand":"MG","model":"HS","variant":"Excite 1.5T","years":"2021-2024"},
{"brand":"MG","model":"HS","variant":"Essence 1.5T","years":"2021-2024"},

{"brand":"Changan","model":"Alsvin","variant":"1.5 Comfort MT","years":"2021-2024"},
{"brand":"Changan","model":"Alsvin","variant":"1.5 Lumiere DCT","years":"2021-2024"},

{"brand":"Changan","model":"Oshan","variant":"X7 Comfort","years":"2022-2024"},
{"brand":"Changan","model":"Oshan","variant":"X7 FutureSense","years":"2022-2024"},

{"brand":"Haval","model":"H6","variant":"1.5T Hybrid Electric","years":"2023-2024"},
{"brand":"Haval","model":"H6","variant":"2.0T AWD Hybrid Electric","years":"2023-2024"},

{"brand":"Proton","model":"Saga","variant":"Standard MT 1.3","years":"2021-2024"},
{"brand":"Proton","model":"Saga","variant":"Standard AT 1.3","years":"2021-2024"},

{"brand":"Proton","model":"X70","variant":"Executive 1.5T","years":"2021-2024"},
{"brand":"Proton","model":"X70","variant":"Premium 1.5T AWD","years":"2021-2024"}

]
}

/* =====================================================
DETECT VEHICLE
===================================================== */

function detectVehicle(text){

const query = (text || "").toLowerCase()

for(const alias in VEHICLE_GRAPH){

if(query.includes(alias)){
return VEHICLE_GRAPH[alias]
}

}

return null

}

module.exports = {
detectVehicle
}
