/* =====================================================
AUTOMOTIVE PARTS GRAPH
===================================================== */

const PARTS = {

"engine oil":[
"engine oil",
"motor oil"
],

"gear oil":[
"gear oil",
"transmission gear oil"
],

"power steering oil":[
"power steering oil",
"steering fluid"
],

"brake fluid":[
"brake fluid",
"brake oil"
],

"coolant":[
"coolant",
"radiator coolant"
],

"radiator cap":[
"radiator cap",
"coolant radiator cap"
],

"radiator hose":[
"radiator hose",
"coolant hose"
],

"water pump":[
"water pump",
"engine water pump"
],

"thermostat":[
"engine thermostat",
"coolant thermostat"
],

"radiator fan":[
"radiator fan",
"cooling fan"
],

"fan motor":[
"radiator fan motor",
"cooling fan motor"
],

"alternator":[
"alternator",
"car alternator"
],

"starter motor":[
"starter motor",
"engine starter"
],

"battery":[
"car battery",
"vehicle battery"
],

"battery terminal":[
"battery terminal",
"battery connector"
],

"battery clamp":[
"battery clamp",
"battery holder"
],

"battery cable":[
"battery cable",
"battery wire"
],

"fuse":[
"car fuse",
"automotive fuse"
],

"relay":[
"automotive relay",
"car relay"
],

"wiper blade":[
"wiper blade",
"windshield wiper blade"
]

"timing belt":[
"timing belt",
"engine timing belt"
],

"serpentine belt":[
"serpentine belt",
"drive belt"
],

"fan belt":[
"fan belt",
"engine fan belt"
],

"idler pulley":[
"idler pulley",
"belt idler pulley"
],

"tensioner pulley":[
"belt tensioner pulley",
"tensioner pulley"
],

"timing chain":[
"timing chain",
"engine timing chain"
],

"camshaft":[
"camshaft",
"engine camshaft"
],

"crankshaft":[
"crankshaft",
"engine crankshaft"
],

"piston":[
"engine piston",
"piston set"
],

"piston ring":[
"piston ring",
"piston ring set"
],

"connecting rod":[
"connecting rod",
"engine con rod"
],

"cylinder head":[
"cylinder head",
"engine head"
],

"head gasket":[
"head gasket",
"engine head gasket"
],

"valve cover":[
"valve cover",
"engine valve cover"
],

"valve seal":[
"valve seal",
"engine valve seal"
],

"engine gasket kit":[
"engine gasket kit",
"full gasket kit"
],

"oil pump":[
"oil pump",
"engine oil pump"
],

"oil pan":[
"oil pan",
"engine oil sump"
],

"dipstick":[
"engine dipstick",
"oil dipstick"
],

"dipstick tube":[
"dipstick tube",
"oil dipstick tube"
]

"brake caliper":[
"brake caliper",
"disc brake caliper"
],

"brake master cylinder":[
"brake master cylinder",
"master brake cylinder"
],

"brake booster":[
"brake booster",
"brake servo"
],

"brake hose":[
"brake hose",
"brake pipe hose"
],

"brake line":[
"brake line",
"brake pipe"
],

"abs sensor":[
"abs sensor",
"wheel abs sensor"
],

"abs pump":[
"abs pump",
"abs module"
],

"wheel cylinder":[
"brake wheel cylinder",
"drum brake cylinder"
],

"hand brake cable":[
"hand brake cable",
"parking brake cable"
],

"brake drum":[
"brake drum",
"rear brake drum"
],

"brake shoe":[
"brake shoe",
"drum brake shoe"
],

"brake hardware kit":[
"brake hardware kit",
"brake fitting kit"
],

"brake adjuster":[
"brake adjuster",
"drum brake adjuster"
],

"brake sensor":[
"brake wear sensor",
"brake pad sensor"
],

"disc shield":[
"brake disc shield",
"rotor dust shield"
],

"brake backing plate":[
"brake backing plate",
"drum backing plate"
],

"brake reservoir":[
"brake fluid reservoir",
"brake oil tank"
],

"brake proportioning valve":[
"brake proportioning valve",
"brake pressure valve"
],

"brake switch":[
"brake switch",
"brake pedal switch"
],

"brake pedal pad":[
"brake pedal pad",
"brake rubber pad"
]

"shock absorber":[
"shock absorber",
"car shock"
],

"strut":[
"suspension strut",
"macpherson strut"
],

"coil spring":[
"coil spring",
"suspension spring"
],

"leaf spring":[
"leaf spring",
"rear leaf spring"
],

"stabilizer link":[
"stabilizer link",
"sway bar link"
],

"stabilizer bush":[
"sway bar bush",
"stabilizer bush"
],

"control arm":[
"control arm",
"suspension arm"
],

"ball joint":[
"ball joint",
"suspension ball joint"
],

"tie rod":[
"tie rod",
"steering tie rod"
],

"tie rod end":[
"tie rod end",
"outer tie rod"
],

"rack end":[
"rack end",
"inner tie rod"
],

"steering rack":[
"steering rack",
"steering gear rack"
],

"power steering pump":[
"power steering pump",
"steering pump"
],

"steering column":[
"steering column",
"steering shaft column"
],

"steering knuckle":[
"steering knuckle",
"wheel knuckle"
],

"wheel hub":[
"wheel hub",
"wheel hub assembly"
],

"wheel bearing":[
"wheel bearing",
"hub bearing"
],

"hub bolt":[
"wheel hub bolt",
"hub bolt"
],

"wheel stud":[
"wheel stud",
"wheel bolt"
],

"lug nut":[
"lug nut",
"wheel nut"
]

"headlight":[
"headlight",
"front headlamp"
],

"headlight bulb":[
"headlight bulb",
"car headlight bulb"
],

"tail light":[
"tail light",
"rear tail lamp"
],

"brake light bulb":[
"brake light bulb",
"stop light bulb"
],

"indicator bulb":[
"indicator bulb",
"turn signal bulb"
],

"fog light":[
"fog light",
"fog lamp"
],

"fog light bulb":[
"fog light bulb",
"fog lamp bulb"
],

"number plate light":[
"number plate light",
"license plate light"
],

"interior dome light":[
"dome light",
"interior light"
],

"map light":[
"map light",
"reading light"
],

"dashboard bulb":[
"dashboard bulb",
"cluster bulb"
],

"reverse light":[
"reverse light",
"backup light"
],

"daytime running light":[
"daytime running light",
"drl light"
],

"parking light":[
"parking light",
"side marker light"
],

"corner light":[
"corner light",
"corner lamp"
],

"reflector":[
"rear reflector",
"car reflector"
],

"headlight switch":[
"headlight switch",
"light control switch"
],

"indicator switch":[
"indicator switch",
"turn signal switch"
],

"hazard switch":[
"hazard switch",
"emergency light switch"
],

"brake light switch":[
"brake light switch",
"stop light switch"
]

"front bumper":[
"front bumper",
"car front bumper"
],

"rear bumper":[
"rear bumper",
"car rear bumper"
],

"bumper bracket":[
"bumper bracket",
"bumper support bracket"
],

"bumper clip":[
"bumper clip",
"bumper fastener clip"
],

"bumper grille":[
"bumper grille",
"lower grille"
],

"front grille":[
"front grille",
"radiator grille"
],

"grille emblem":[
"grille emblem",
"front badge"
],

"hood":[
"car hood",
"engine bonnet"
],

"hood hinge":[
"hood hinge",
"bonnet hinge"
],

"hood latch":[
"hood latch",
"bonnet lock"
],

"hood cable":[
"hood cable",
"bonnet cable"
],

"fender":[
"front fender",
"car fender"
],

"fender liner":[
"fender liner",
"wheel arch liner"
],

"mud flap":[
"mud flap",
"mud guard"
],

"side mirror":[
"side mirror",
"door mirror"
],

"mirror cover":[
"mirror cover",
"side mirror cover"
],

"mirror glass":[
"mirror glass",
"side mirror glass"
],

"mirror indicator":[
"mirror indicator",
"side mirror signal"
],

"door":[
"car door",
"vehicle door"
],

"door hinge":[
"door hinge",
"car door hinge"
]

"door handle":[
"door handle",
"car door handle"
],

"door lock":[
"door lock",
"car door lock"
],

"door latch":[
"door latch",
"door lock latch"
],

"window regulator":[
"window regulator",
"power window regulator"
],

"window motor":[
"window motor",
"power window motor"
],

"window switch":[
"power window switch",
"window switch"
],

"door trim":[
"door trim",
"door panel"
],

"door weatherstrip":[
"door weatherstrip",
"door rubber seal"
],

"glass run channel":[
"glass run channel",
"window rubber channel"
],

"window glass":[
"door window glass",
"car window glass"
],

"quarter glass":[
"quarter glass",
"side quarter glass"
],

"windshield":[
"windshield",
"front windshield"
],

"rear windshield":[
"rear windshield",
"back glass"
],

"windshield washer pump":[
"washer pump",
"windshield washer pump"
],

"washer nozzle":[
"washer nozzle",
"windshield nozzle"
],

"washer reservoir":[
"washer reservoir",
"washer bottle"
],

"wiper motor":[
"wiper motor",
"windshield wiper motor"
],

"wiper linkage":[
"wiper linkage",
"wiper transmission"
],

"wiper arm":[
"wiper arm",
"windshield wiper arm"
],

"rear wiper":[
"rear wiper",
"rear wiper blade"
]

"seat cover":[
"seat cover",
"car seat cover"
],

"floor mat":[
"floor mat",
"car floor mat"
],

"trunk mat":[
"trunk mat",
"cargo mat"
],

"dashboard cover":[
"dashboard cover",
"dash cover"
],

"steering cover":[
"steering cover",
"steering wheel cover"
],

"gear knob":[
"gear knob",
"gear shift knob"
],

"handbrake cover":[
"handbrake cover",
"parking brake cover"
],

"sun visor":[
"sun visor",
"car sun visor"
],

"sun shade":[
"sun shade",
"car sunshade"
],

"car curtain":[
"car curtain",
"window curtain"
],

"phone holder":[
"phone holder",
"car mobile holder"
],

"car charger":[
"car charger",
"usb car charger"
],

"dashboard camera":[
"dash cam",
"car dash camera"
],

"parking sensor":[
"parking sensor",
"car parking sensor"
],

"reverse camera":[
"reverse camera",
"backup camera"
],

"car stereo":[
"car stereo",
"car audio system"
],

"speaker":[
"car speaker",
"audio speaker"
],

"subwoofer":[
"car subwoofer",
"audio subwoofer"
],

"amplifier":[
"car amplifier",
"audio amplifier"
],

"antenna":[
"car antenna",
"radio antenna"
]

"roof rack":[
"roof rack",
"car roof carrier"
],

"roof rail":[
"roof rail",
"car roof rail"
],

"roof spoiler":[
"roof spoiler",
"rear spoiler"
],

"side skirt":[
"side skirt",
"side body kit"
],

"body kit":[
"body kit",
"car body kit"
],

"window visor":[
"window visor",
"door visor"
],

"rain guard":[
"rain guard",
"window rain visor"
],

"door guard":[
"door guard",
"door protector"
],

"bumper guard":[
"bumper guard",
"bumper protector"
],

"trunk spoiler":[
"trunk spoiler",
"boot spoiler"
],

"rear diffuser":[
"rear diffuser",
"bumper diffuser"
],

"hood scoop":[
"hood scoop",
"bonnet scoop"
],

"exhaust tip":[
"exhaust tip",
"muffler tip"
],

"exhaust muffler":[
"exhaust muffler",
"car muffler"
],

"exhaust pipe":[
"exhaust pipe",
"car exhaust pipe"
],

"catalytic converter":[
"catalytic converter",
"cat converter"
],

"resonator":[
"exhaust resonator",
"muffler resonator"
],

"oxygen sensor spacer":[
"o2 sensor spacer",
"oxygen sensor spacer"
],

"heat shield":[
"exhaust heat shield",
"engine heat shield"
],

"engine cover":[
"engine cover",
"top engine cover"
]

"key chain":[
"car key chain",
"car keychain"
],

"key cover":[
"car key cover",
"key remote cover"
],

"key shell":[
"key shell",
"car key shell"
],

"key battery":[
"key battery",
"remote battery"
],

"remote case":[
"remote case",
"key remote shell"
],

"remote button":[
"remote button",
"keypad button"
],

"remote circuit":[
"remote circuit",
"key remote pcb"
],

"steering lock":[
"steering lock",
"wheel lock"
],

"tire valve":[
"tire valve",
"wheel valve"
],

"valve cap":[
"valve cap",
"tire valve cap"
],

"tire inflator":[
"tire inflator",
"air compressor"
],

"tire pressure gauge":[
"tire pressure gauge",
"tp gauge"
],

"wheel cap":[
"wheel cap",
"hub cap"
],

"center cap":[
"center cap",
"wheel center cap"
],

"lug cover":[
"lug cover",
"wheel nut cover"
],

"wheel spacer":[
"wheel spacer",
"rim spacer"
],

"tire repair kit":[
"tire repair kit",
"puncture repair kit"
],

"tow hook":[
"tow hook",
"car tow hook"
],

"tow strap":[
"tow strap",
"recovery strap"
],

"car cover":[
"car cover",
"vehicle cover"
]

"fuel pump":[
"fuel pump",
"engine fuel pump"
],

"fuel injector":[
"fuel injector",
"engine injector"
],

"injector nozzle":[
"injector nozzle",
"fuel injector nozzle"
],

"fuel rail":[
"fuel rail",
"injector rail"
],

"fuel pressure regulator":[
"fuel pressure regulator",
"fuel regulator"
],

"fuel tank":[
"fuel tank",
"car fuel tank"
],

"fuel tank cap":[
"fuel tank cap",
"fuel cap"
],

"fuel tank strap":[
"fuel tank strap",
"tank mounting strap"
],

"fuel hose":[
"fuel hose",
"fuel pipe hose"
],

"fuel pipe":[
"fuel pipe",
"fuel line pipe"
],

"throttle cable":[
"throttle cable",
"accelerator cable"
],

"accelerator pedal":[
"accelerator pedal",
"gas pedal"
],

"throttle position sensor":[
"throttle position sensor",
"tps sensor"
],

"idle air control valve":[
"idle air control valve",
"iac valve"
],

"map sensor":[
"map sensor",
"manifold pressure sensor"
],

"knock sensor":[
"knock sensor",
"engine knock sensor"
],

"crankshaft sensor":[
"crankshaft sensor",
"crank position sensor"
],

"camshaft sensor":[
"camshaft sensor",
"cam position sensor"
],

"engine temperature sensor":[
"engine temperature sensor",
"coolant temp sensor"
],

"intake manifold":[
"intake manifold",
"engine intake manifold"
]

"intake hose":[
"intake hose",
"air intake hose"
],

"air intake duct":[
"air intake duct",
"air duct pipe"
],

"intercooler":[
"intercooler",
"turbo intercooler"
],

"intercooler hose":[
"intercooler hose",
"turbo hose"
],

"turbocharger":[
"turbocharger",
"engine turbo"
],

"turbo actuator":[
"turbo actuator",
"wastegate actuator"
],

"wastegate":[
"turbo wastegate",
"waste gate valve"
],

"blow off valve":[
"blow off valve",
"bov valve"
],

"pcv valve":[
"pcv valve",
"positive crankcase valve"
],

"vacuum hose":[
"vacuum hose",
"engine vacuum pipe"
],

"vacuum pump":[
"vacuum pump",
"engine vacuum pump"
],

"engine cover bolt":[
"engine cover bolt",
"engine top bolt"
],

"timing cover":[
"timing cover",
"timing belt cover"
],

"timing tensioner":[
"timing tensioner",
"timing belt tensioner"
],

"cam gear":[
"cam gear",
"camshaft gear"
],

"crank pulley":[
"crank pulley",
"crankshaft pulley"
],

"harmonic balancer":[
"harmonic balancer",
"crank balancer"
],

"flywheel":[
"flywheel",
"engine flywheel"
],

"flex plate":[
"flex plate",
"automatic flywheel"
],

"clutch kit":[
"clutch kit",
"clutch set"
]

"clutch plate":[
"clutch plate",
"clutch disc"
],

"clutch pressure plate":[
"clutch pressure plate",
"pressure plate"
],

"clutch bearing":[
"clutch bearing",
"release bearing"
],

"clutch fork":[
"clutch fork",
"release fork"
],

"clutch cable":[
"clutch cable",
"clutch wire"
],

"clutch master cylinder":[
"clutch master cylinder",
"clutch pump"
],

"clutch slave cylinder":[
"clutch slave cylinder",
"clutch cylinder"
],

"gear shifter":[
"gear shifter",
"gear lever"
],

"shift cable":[
"shift cable",
"gear cable"
],

"shift knob":[
"shift knob",
"gear knob"
],

"transmission":[
"transmission",
"gearbox"
],

"gearbox mount":[
"gearbox mount",
"transmission mount"
],

"drive shaft":[
"drive shaft",
"propeller shaft"
],

"cv axle":[
"cv axle",
"drive axle"
],

"cv joint":[
"cv joint",
"constant velocity joint"
],

"cv boot":[
"cv boot",
"axle boot"
],

"differential":[
"differential",
"rear differential"
],

"differential mount":[
"differential mount",
"diff mount"
],

"differential gear":[
"differential gear",
"diff gear"
],

"axle shaft":[
"axle shaft",
"drive shaft axle"
]

"heater core":[
"heater core",
"heater radiator"
],

"heater hose":[
"heater hose",
"heater pipe"
],

"blower motor":[
"blower motor",
"ac blower motor"
],

"blower resistor":[
"blower resistor",
"blower control resistor"
],

"ac compressor":[
"ac compressor",
"aircon compressor"
],

"ac condenser":[
"ac condenser",
"aircon condenser"
],

"ac evaporator":[
"ac evaporator",
"evaporator coil"
],

"ac expansion valve":[
"ac expansion valve",
"txv valve"
],

"ac dryer":[
"ac dryer",
"receiver dryer"
],

"ac pressure switch":[
"ac pressure switch",
"aircon pressure switch"
],

"ac pipe":[
"ac pipe",
"aircon pipe"
],

"ac hose":[
"ac hose",
"aircon hose"
],

"ac control panel":[
"ac control panel",
"climate control panel"
],

"cabin blower":[
"cabin blower",
"interior blower"
],

"heater valve":[
"heater valve",
"heater control valve"
],

"temperature control knob":[
"temperature knob",
"ac temperature knob"
],

"ac relay":[
"ac relay",
"compressor relay"
],

"ac fan":[
"ac fan",
"condenser fan"
],

"ac fan motor":[
"ac fan motor",
"condenser fan motor"
],

"ac clutch":[
"ac clutch",
"compressor clutch"
]

"hood strut":[
"hood strut",
"bonnet gas strut"
],

"tailgate strut":[
"tailgate strut",
"boot gas strut"
],

"trunk latch":[
"trunk latch",
"boot lock"
],

"trunk hinge":[
"trunk hinge",
"boot hinge"
],

"trunk handle":[
"trunk handle",
"boot handle"
],

"trunk trim":[
"trunk trim",
"boot interior trim"
],

"spare wheel":[
"spare wheel",
"spare tire"
],

"spare tire carrier":[
"spare tire carrier",
"spare wheel holder"
],

"jack":[
"car jack",
"vehicle jack"
],

"jack handle":[
"jack handle",
"jack lever"
],

"wheel wrench":[
"wheel wrench",
"lug wrench"
],

"tool kit":[
"car tool kit",
"vehicle tool kit"
],

"wheel lock nut":[
"wheel lock nut",
"locking lug nut"
],

"wheel lock key":[
"wheel lock key",
"lock nut key"
],

"wheel arch trim":[
"wheel arch trim",
"arch molding"
],

"door molding":[
"door molding",
"side molding"
],

"body molding":[
"body molding",
"side body trim"
],

"pillar trim":[
"pillar trim",
"pillar cover"
],

"roof molding":[
"roof molding",
"roof trim"
],

"window trim":[
"window trim",
"window molding"
]

"seat belt":[
"seat belt",
"car seat belt"
],

"seat belt buckle":[
"seat belt buckle",
"belt buckle"
],

"seat belt retractor":[
"seat belt retractor",
"belt retractor"
],

"seat rail":[
"seat rail",
"seat slider"
],

"seat foam":[
"seat foam",
"seat cushion foam"
],

"seat frame":[
"seat frame",
"seat structure"
],

"seat motor":[
"seat motor",
"power seat motor"
],

"seat switch":[
"seat switch",
"power seat switch"
],

"headrest":[
"headrest",
"seat headrest"
],

"armrest":[
"armrest",
"center armrest"
],

"cup holder":[
"cup holder",
"car cup holder"
],

"center console":[
"center console",
"console box"
],

"glove box":[
"glove box",
"dashboard glove box"
],

"glove box latch":[
"glove box latch",
"glove lock"
],

"dashboard panel":[
"dashboard panel",
"instrument panel"
],

"instrument cluster":[
"instrument cluster",
"speedometer cluster"
],

"speedometer":[
"speedometer",
"speed gauge"
],

"tachometer":[
"tachometer",
"rpm gauge"
],

"fuel gauge":[
"fuel gauge",
"fuel meter"
],

"temperature gauge":[
"temperature gauge",
"engine temp gauge"
]

"horn":[
"car horn",
"vehicle horn"
],

"horn relay":[
"horn relay",
"horn switch relay"
],

"horn button":[
"horn button",
"steering horn button"
],

"ignition coil":[
"ignition coil",
"coil pack"
],

"ignition module":[
"ignition module",
"ignition control module"
],

"ignition switch":[
"ignition switch",
"starter switch"
],

"ignition lock":[
"ignition lock",
"ignition cylinder"
],

"starter relay":[
"starter relay",
"starter solenoid relay"
],

"starter solenoid":[
"starter solenoid",
"starter switch solenoid"
],

"spark plug wire":[
"spark plug wire",
"ignition wire"
],

"distributor":[
"ignition distributor",
"engine distributor"
],

"distributor cap":[
"distributor cap",
"distributor cover"
],

"rotor":[
"distributor rotor",
"rotor arm"
],

"coil wire":[
"coil wire",
"ignition coil wire"
],

"ground wire":[
"ground wire",
"earth wire"
],

"fuse box":[
"fuse box",
"fuse panel"
],

"fuse holder":[
"fuse holder",
"fuse socket"
],

"wiring harness":[
"wiring harness",
"engine wiring harness"
],

"connector plug":[
"connector plug",
"wiring connector"
],

"terminal connector":[
"terminal connector",
"wire terminal"
]

"bumper reflector":[
"bumper reflector",
"rear bumper reflector"
],

"bumper lip":[
"bumper lip",
"front lip"
],

"grille mesh":[
"grille mesh",
"front grille mesh"
],

"hood emblem":[
"hood emblem",
"bonnet emblem"
],

"trunk emblem":[
"trunk emblem",
"boot emblem"
],

"side emblem":[
"side emblem",
"fender badge"
],

"model badge":[
"model badge",
"car model emblem"
],

"letter badge":[
"letter badge",
"chrome letter badge"
],

"number badge":[
"number badge",
"chrome number badge"
],

"decal sticker":[
"car decal",
"bumper sticker"
],

"vin plate":[
"vin plate",
"vehicle vin plate"
],

"license frame":[
"license plate frame",
"number plate frame"
],

"plate screw":[
"number plate screw",
"plate mounting screw"
],

"plate light cover":[
"plate light cover",
"license light cover"
],

"bumper sensor":[
"bumper sensor",
"parking sensor"
],

"sensor bracket":[
"sensor bracket",
"parking sensor bracket"
],

"tow cover":[
"tow hook cover",
"bumper tow cover"
],

"fog light bezel":[
"fog light bezel",
"fog lamp trim"
],

"headlight bezel":[
"headlight bezel",
"lamp bezel"
],

"tail light trim":[
"tail light trim",
"rear lamp trim"
]

"car perfume":[
"car perfume",
"car air freshener"
],

"air freshener":[
"air freshener",
"car fragrance"
],

"dashboard ornament":[
"dashboard ornament",
"car dashboard idol"
],

"dashboard mat":[
"dashboard mat",
"dash mat"
],

"sun visor clip":[
"sun visor clip",
"visor holder clip"
],

"visor mirror":[
"visor mirror",
"sun visor mirror"
],

"interior trim clip":[
"interior trim clip",
"panel clip"
],

"door clip":[
"door panel clip",
"door trim clip"
],

"bumper clip fastener":[
"bumper clip fastener",
"bumper plastic clip"
],

"push clip":[
"push clip",
"plastic push clip"
],

"plastic rivet":[
"plastic rivet",
"trim rivet"
],

"screw fastener":[
"screw fastener",
"panel screw"
],

"trim screw":[
"trim screw",
"interior screw"
],

"rubber grommet":[
"rubber grommet",
"wire grommet"
],

"weatherstrip clip":[
"weatherstrip clip",
"rubber seal clip"
],

"insulation pad":[
"insulation pad",
"engine insulation pad"
],

"heat insulation":[
"heat insulation",
"engine insulation"
],

"hood insulation":[
"hood insulation",
"bonnet insulation"
],

"floor insulation":[
"floor insulation",
"car floor insulation"
],

"sound deadener":[
"sound deadener",
"noise insulation mat"
]

"engine mount bracket":[
"engine mount bracket",
"engine bracket"
],

"alternator bracket":[
"alternator bracket",
"alternator mount bracket"
],

"ac bracket":[
"ac bracket",
"compressor bracket"
],

"power steering bracket":[
"power steering bracket",
"steering pump bracket"
],

"battery tray":[
"battery tray",
"battery base"
],

"battery cover":[
"battery cover",
"battery top cover"
],

"engine splash shield":[
"engine splash shield",
"engine under cover"
],

"engine undercover":[
"engine undercover",
"engine bottom cover"
],

"skid plate":[
"skid plate",
"engine protection plate"
],

"transmission pan":[
"transmission pan",
"gearbox oil pan"
],

"transmission filter gasket":[
"transmission filter gasket",
"gearbox gasket"
],

"drain plug":[
"oil drain plug",
"engine drain plug"
],

"drain washer":[
"drain washer",
"oil drain washer"
],

"oil filler cap":[
"oil filler cap",
"engine oil cap"
],

"coolant cap":[
"coolant cap",
"radiator coolant cap"
],

"washer cap":[
"washer cap",
"washer bottle cap"
],

"power steering cap":[
"power steering cap",
"steering reservoir cap"
],

"brake reservoir cap":[
"brake reservoir cap",
"brake fluid cap"
],

"fuse cover":[
"fuse cover",
"fuse box cover"
],

"relay cover":[
"relay cover",
"relay box cover"
]

"engine valve":[
"engine valve",
"intake valve"
],

"exhaust valve":[
"exhaust valve",
"engine exhaust valve"
],

"valve spring":[
"valve spring",
"engine valve spring"
],

"valve lifter":[
"valve lifter",
"hydraulic lifter"
],

"rocker arm":[
"rocker arm",
"engine rocker arm"
],

"push rod":[
"push rod",
"engine pushrod"
],

"valve guide":[
"valve guide",
"engine valve guide"
],

"valve seat":[
"valve seat",
"engine valve seat"
],

"engine block":[
"engine block",
"cylinder block"
],

"cylinder liner":[
"cylinder liner",
"engine sleeve"
],

"engine timing gear":[
"timing gear",
"engine timing gear"
],

"timing chain guide":[
"timing chain guide",
"timing guide rail"
],

"timing chain tensioner":[
"timing chain tensioner",
"timing tensioner"
],

"oil strainer":[
"oil strainer",
"engine oil strainer"
],

"oil pickup":[
"oil pickup",
"oil pickup tube"
],

"oil cooler":[
"oil cooler",
"engine oil cooler"
],

"oil cooler hose":[
"oil cooler hose",
"oil cooling pipe"
],

"engine breather":[
"engine breather",
"crankcase breather"
],

"breather hose":[
"breather hose",
"engine breather pipe"
],

"breather filter":[
"breather filter",
"engine breather filter"
]

"fuel sender":[
"fuel sender",
"fuel level sender"
],

"fuel float":[
"fuel float",
"tank float"
],

"fuel strainer":[
"fuel strainer",
"fuel pump strainer"
],

"fuel pump relay":[
"fuel pump relay",
"pump relay"
],

"fuel pump module":[
"fuel pump module",
"fuel module assembly"
],

"fuel return line":[
"fuel return line",
"fuel return hose"
],

"fuel filler neck":[
"fuel filler neck",
"fuel inlet pipe"
],

"fuel filler hose":[
"fuel filler hose",
"fuel inlet hose"
],

"fuel door":[
"fuel door",
"fuel lid"
],

"fuel door hinge":[
"fuel door hinge",
"fuel lid hinge"
],

"fuel door latch":[
"fuel door latch",
"fuel lid lock"
],

"fuel cap tether":[
"fuel cap tether",
"fuel cap string"
],

"fuel filter housing":[
"fuel filter housing",
"filter housing"
],

"fuel pump gasket":[
"fuel pump gasket",
"pump seal"
],

"injector seal":[
"injector seal",
"injector o ring"
],

"injector clip":[
"injector clip",
"fuel injector clip"
],

"fuel rail sensor":[
"fuel rail sensor",
"fuel pressure sensor"
],

"fuel pump wiring":[
"fuel pump wiring",
"pump wiring harness"
],

"fuel pump bracket":[
"fuel pump bracket",
"pump mount bracket"
],

"fuel pump bolt":[
"fuel pump bolt",
"pump mounting bolt"
]

"radiator support":[
"radiator support",
"radiator frame"
],

"radiator bracket":[
"radiator bracket",
"radiator mount bracket"
],

"radiator drain plug":[
"radiator drain plug",
"radiator plug"
],

"coolant hose clamp":[
"coolant hose clamp",
"radiator hose clamp"
],

"coolant sensor":[
"coolant sensor",
"coolant level sensor"
],

"coolant flange":[
"coolant flange",
"coolant outlet flange"
],

"coolant pipe":[
"coolant pipe",
"engine coolant pipe"
],

"coolant bypass pipe":[
"coolant bypass pipe",
"bypass hose"
],

"heater pipe":[
"heater pipe",
"heater coolant pipe"
],

"heater clamp":[
"heater clamp",
"heater hose clamp"
],

"radiator mounting":[
"radiator mounting",
"radiator mount"
],

"fan shroud":[
"fan shroud",
"radiator fan shroud"
],

"fan clutch":[
"fan clutch",
"cooling fan clutch"
],

"cooling fan relay":[
"cooling fan relay",
"fan relay"
],

"cooling fan resistor":[
"cooling fan resistor",
"fan resistor"
],

"cooling fan blade":[
"cooling fan blade",
"fan blade"
],

"cooling fan housing":[
"cooling fan housing",
"fan frame"
],

"cooling fan connector":[
"cooling fan connector",
"fan wiring plug"
],

"radiator bush":[
"radiator bush",
"radiator rubber mount"
],

"radiator mounting bolt":[
"radiator mounting bolt",
"radiator bolt"
]

"door seal":[
"door seal",
"door rubber seal"
],

"window seal":[
"window seal",
"window rubber seal"
],

"windshield seal":[
"windshield seal",
"front glass rubber"
],

"rear glass seal":[
"rear glass seal",
"back glass rubber"
],

"door weatherstrip clip":[
"door weatherstrip clip",
"seal clip"
],

"window molding clip":[
"window molding clip",
"molding fastener"
],

"door lock actuator":[
"door lock actuator",
"central lock actuator"
],

"door lock switch":[
"door lock switch",
"central lock switch"
],

"central locking motor":[
"central locking motor",
"door lock motor"
],

"central locking module":[
"central locking module",
"lock control module"
],

"window motor gear":[
"window motor gear",
"regulator gear"
],

"window motor relay":[
"window motor relay",
"window relay"
],

"door striker":[
"door striker",
"door lock striker"
],

"door check strap":[
"door check strap",
"door stopper"
],

"door stopper":[
"door stopper",
"door stop"
],

"door latch cable":[
"door latch cable",
"door cable"
],

"door handle cable":[
"door handle cable",
"handle wire"
],

"door handle bracket":[
"door handle bracket",
"handle mount bracket"
],

"door trim screw":[
"door trim screw",
"panel screw"
],

"door trim fastener":[
"door trim fastener",
"panel fastener"
]

"front seat":[
"front seat",
"driver seat"
],

"rear seat":[
"rear seat",
"back seat"
],

"seat bracket":[
"seat bracket",
"seat mount bracket"
],

"seat bolt":[
"seat bolt",
"seat mounting bolt"
],

"seat latch":[
"seat latch",
"seat lock"
],

"seat hinge":[
"seat hinge",
"seat folding hinge"
],

"seat lever":[
"seat lever",
"seat adjust lever"
],

"seat cable":[
"seat cable",
"seat adjust cable"
],

"seat track":[
"seat track",
"seat rail track"
],

"seat stopper":[
"seat stopper",
"seat stop"
],

"seat trim":[
"seat trim",
"seat panel"
],

"seat side cover":[
"seat side cover",
"seat plastic cover"
],

"seat handle":[
"seat handle",
"seat adjust handle"
],

"seat lock":[
"seat lock",
"seat latch lock"
],

"seat frame bolt":[
"seat frame bolt",
"seat bolt set"
],

"seat foam pad":[
"seat foam pad",
"seat cushion pad"
],

"seat back panel":[
"seat back panel",
"seat rear cover"
],

"seat pocket":[
"seat pocket",
"seat storage pocket"
],

"seat hook":[
"seat hook",
"seat hanger"
],

"seat clip":[
"seat clip",
"seat plastic clip"
]

"steering wheel":[
"steering wheel",
"car steering wheel"
],

"steering wheel hub":[
"steering wheel hub",
"steering hub"
],

"steering wheel trim":[
"steering wheel trim",
"wheel trim"
],

"steering wheel switch":[
"steering wheel switch",
"wheel control switch"
],

"steering wheel cover":[
"steering wheel cover",
"wheel cover"
],

"steering shaft":[
"steering shaft",
"steering column shaft"
],

"steering joint":[
"steering joint",
"steering universal joint"
],

"steering coupler":[
"steering coupler",
"steering coupling"
],

"steering damper":[
"steering damper",
"steering stabilizer"
],

"steering bush":[
"steering bush",
"rack bush"
],

"steering rack boot":[
"steering rack boot",
"rack boot"
],

"steering rack seal":[
"steering rack seal",
"rack oil seal"
],

"steering rack clamp":[
"steering rack clamp",
"rack clamp"
],

"steering pump pulley":[
"steering pump pulley",
"pump pulley"
],

"steering pump hose":[
"steering pump hose",
"power steering hose"
],

"steering pump reservoir":[
"steering pump reservoir",
"steering tank"
],

"steering sensor":[
"steering sensor",
"steering angle sensor"
],

"steering control module":[
"steering control module",
"eps module"
],

"steering motor":[
"steering motor",
"eps motor"
],

"steering motor bracket":[
"steering motor bracket",
"motor bracket"
]

"brake disc bolt":[
"brake disc bolt",
"rotor bolt"
],

"brake caliper bolt":[
"brake caliper bolt",
"caliper mounting bolt"
],

"brake caliper pin":[
"brake caliper pin",
"caliper slide pin"
],

"brake caliper boot":[
"brake caliper boot",
"caliper rubber boot"
],

"brake caliper piston":[
"brake caliper piston",
"caliper piston"
],

"brake caliper seal":[
"brake caliper seal",
"piston seal"
],

"brake spring":[
"brake spring",
"drum brake spring"
],

"brake hold down":[
"brake hold down",
"shoe hold down"
],

"brake shoe spring":[
"brake shoe spring",
"shoe return spring"
],

"brake lever":[
"brake lever",
"parking brake lever"
],

"brake cable bracket":[
"brake cable bracket",
"hand brake bracket"
],

"brake pedal sensor":[
"brake pedal sensor",
"brake pedal switch"
],

"brake pedal bracket":[
"brake pedal bracket",
"pedal mount bracket"
],

"brake pedal spring":[
"brake pedal spring",
"pedal return spring"
],

"brake pedal stopper":[
"brake pedal stopper",
"pedal stop"
],

"brake hose bracket":[
"brake hose bracket",
"hose holder"
],

"brake hose clip":[
"brake hose clip",
"hose fastener"
],

"brake fluid sensor":[
"brake fluid sensor",
"fluid level sensor"
],

"brake reservoir hose":[
"brake reservoir hose",
"reservoir pipe"
],

"brake reservoir bracket":[
"brake reservoir bracket",
"reservoir mount"
]

"side step":[
"side step",
"running board"
],

"door sill plate":[
"door sill plate",
"sill protector"
],

"scuff plate":[
"scuff plate",
"door scuff plate"
],

"bumper step":[
"bumper step",
"rear bumper step"
],

"tailgate handle":[
"tailgate handle",
"rear gate handle"
],

"tailgate lock":[
"tailgate lock",
"rear gate lock"
],

"tailgate cable":[
"tailgate cable",
"rear gate cable"
],

"tailgate hinge":[
"tailgate hinge",
"rear gate hinge"
],

"tailgate seal":[
"tailgate seal",
"boot seal"
],

"tailgate trim":[
"tailgate trim",
"rear gate trim"
],

"tailgate emblem":[
"tailgate emblem",
"rear badge"
],

"tailgate garnish":[
"tailgate garnish",
"boot garnish"
],

"tailgate lamp":[
"tailgate lamp",
"rear gate light"
],

"tailgate wiring":[
"tailgate wiring",
"rear gate harness"
],

"tailgate strut bracket":[
"tailgate strut bracket",
"boot strut bracket"
],

"tailgate stopper":[
"tailgate stopper",
"boot stop"
],

"tailgate hook":[
"tailgate hook",
"boot hook"
],

"tailgate latch":[
"tailgate latch",
"boot latch"
],

"tailgate lock motor":[
"tailgate lock motor",
"boot lock motor"
],

"tailgate sensor":[
"tailgate sensor",
"boot open sensor"
]

"wheel rim":[
"wheel rim",
"alloy rim"
],

"steel rim":[
"steel rim",
"steel wheel"
],

"alloy wheel":[
"alloy wheel",
"alloy rim"
],

"wheel balance weight":[
"wheel balance weight",
"wheel weight"
],

"tire bead":[
"tire bead",
"tyre bead"
],

"tire sidewall":[
"tire sidewall",
"tyre sidewall"
],

"tire tread":[
"tire tread",
"tyre tread"
],

"tire tube":[
"tire tube",
"inner tube"
],

"tire valve stem":[
"tire valve stem",
"valve stem"
],

"tire sensor":[
"tire sensor",
"tpms sensor"
],

"tpms valve":[
"tpms valve",
"tpms valve stem"
],

"tpms module":[
"tpms module",
"tire pressure module"
],

"wheel alignment bolt":[
"wheel alignment bolt",
"camber bolt"
],

"wheel spacer bolt":[
"wheel spacer bolt",
"spacer bolt"
],

"wheel nut lock":[
"wheel nut lock",
"locking nut"
],

"wheel center ring":[
"wheel center ring",
"hub ring"
],

"wheel hub seal":[
"wheel hub seal",
"hub oil seal"
],

"wheel hub nut":[
"wheel hub nut",
"hub nut"
],

"wheel bearing seal":[
"wheel bearing seal",
"bearing seal"
],

"wheel bearing grease":[
"wheel bearing grease",
"bearing grease"
]

"car vacuum cleaner":[
"car vacuum cleaner",
"auto vacuum cleaner"
],

"car polish":[
"car polish",
"auto polish"
],

"car wax":[
"car wax",
"vehicle wax"
],

"car shampoo":[
"car shampoo",
"auto wash shampoo"
],

"microfiber cloth":[
"microfiber cloth",
"car cleaning cloth"
],

"wash mitt":[
"wash mitt",
"car wash glove"
],

"wheel brush":[
"wheel brush",
"rim brush"
],

"tire brush":[
"tire brush",
"tyre brush"
],

"glass cleaner":[
"glass cleaner",
"car glass cleaner"
],

"interior cleaner":[
"interior cleaner",
"dashboard cleaner"
],

"leather cleaner":[
"leather cleaner",
"seat leather cleaner"
],

"plastic restorer":[
"plastic restorer",
"trim restorer"
],

"engine degreaser":[
"engine degreaser",
"engine cleaner"
],

"bug remover":[
"bug remover",
"bug cleaner"
],

"tar remover":[
"tar remover",
"road tar remover"
],

"scratch remover":[
"scratch remover",
"paint scratch remover"
],

"headlight polish":[
"headlight polish",
"headlight restorer"
],

"tire shine":[
"tire shine",
"tyre shine"
],

"foam sprayer":[
"foam sprayer",
"car foam gun"
],

"wash bucket":[
"wash bucket",
"car wash bucket"
]

"sunroof motor":[
"sunroof motor",
"roof motor"
],

"sunroof switch":[
"sunroof switch",
"roof control switch"
],

"sunroof glass":[
"sunroof glass",
"roof glass"
],

"sunroof seal":[
"sunroof seal",
"roof rubber seal"
],

"sunroof rail":[
"sunroof rail",
"sunroof track"
],

"sunroof cable":[
"sunroof cable",
"roof cable"
],

"sunroof shade":[
"sunroof shade",
"roof sunshade"
],

"sunroof frame":[
"sunroof frame",
"roof frame"
],

"sunroof drain":[
"sunroof drain",
"roof drain pipe"
],

"sunroof bracket":[
"sunroof bracket",
"roof bracket"
],

"sunroof gear":[
"sunroof gear",
"roof gear"
],

"sunroof motor relay":[
"sunroof relay",
"sunroof motor relay"
],

"sunroof trim":[
"sunroof trim",
"roof trim"
],

"sunroof handle":[
"sunroof handle",
"roof handle"
],

"sunroof lock":[
"sunroof lock",
"roof lock"
],

"sunroof hinge":[
"sunroof hinge",
"roof hinge"
],

"sunroof stopper":[
"sunroof stopper",
"roof stopper"
],

"sunroof clip":[
"sunroof clip",
"roof clip"
],

"sunroof gasket":[
"sunroof gasket",
"roof gasket"
],

"sunroof deflector":[
"sunroof deflector",
"roof wind deflector"
]

"engine wiring":[
"engine wiring",
"engine wiring harness"
],

"dashboard wiring":[
"dashboard wiring",
"dash wiring harness"
],

"door wiring":[
"door wiring",
"door harness"
],

"tailgate wiring":[
"tailgate wiring",
"boot wiring harness"
],

"headlight wiring":[
"headlight wiring",
"lamp wiring harness"
],

"fog light wiring":[
"fog light wiring",
"fog lamp harness"
],

"radiator fan wiring":[
"fan wiring",
"radiator fan harness"
],

"injector wiring":[
"injector wiring",
"injector harness"
],

"sensor wiring":[
"sensor wiring",
"sensor harness"
],

"abs wiring":[
"abs wiring",
"abs harness"
],

"airbag wiring":[
"airbag wiring",
"srs harness"
],

"steering wiring":[
"steering wiring",
"wheel wiring harness"
],

"battery wiring":[
"battery wiring",
"battery harness"
],

"alternator wiring":[
"alternator wiring",
"alternator harness"
],

"starter wiring":[
"starter wiring",
"starter harness"
],

"ground strap":[
"ground strap",
"engine ground strap"
],

"ground cable":[
"ground cable",
"earth cable"
],

"fuse tap":[
"fuse tap",
"fuse adapter"
],

"relay socket":[
"relay socket",
"relay holder"
],

"wiring sleeve":[
"wiring sleeve",
"wire protection sleeve"
]

"engine gasket":[
"engine gasket",
"engine seal gasket"
],

"oil pan gasket":[
"oil pan gasket",
"oil sump gasket"
],

"valve cover gasket":[
"valve cover gasket",
"rocker cover gasket"
],

"intake gasket":[
"intake gasket",
"intake manifold gasket"
],

"exhaust gasket":[
"exhaust gasket",
"exhaust manifold gasket"
],

"turbo gasket":[
"turbo gasket",
"turbo seal gasket"
],

"water pump gasket":[
"water pump gasket",
"pump gasket"
],

"thermostat gasket":[
"thermostat gasket",
"thermostat seal"
],

"radiator gasket":[
"radiator gasket",
"radiator seal"
],

"fuel pump gasket":[
"fuel pump gasket",
"pump seal"
],

"injector gasket":[
"injector gasket",
"injector seal gasket"
],

"throttle gasket":[
"throttle gasket",
"throttle body gasket"
],

"egr gasket":[
"egr gasket",
"egr valve gasket"
],

"oil cooler gasket":[
"oil cooler gasket",
"cooler seal gasket"
],

"timing cover gasket":[
"timing cover gasket",
"timing seal"
],

"rear main seal":[
"rear main seal",
"crankshaft rear seal"
],

"front crank seal":[
"front crank seal",
"crankshaft seal"
],

"cam seal":[
"cam seal",
"camshaft oil seal"
],

"valve seal":[
"valve seal",
"engine valve seal"
],

"oil seal":[
"oil seal",
"engine oil seal"
]

"bumper reinforcement":[
"bumper reinforcement",
"bumper support bar"
],

"bumper absorber":[
"bumper absorber",
"impact absorber"
],

"bumper energy absorber":[
"energy absorber",
"bumper energy absorber"
],

"bumper mounting":[
"bumper mounting",
"bumper mount bracket"
],

"bumper side bracket":[
"bumper side bracket",
"bumper side mount"
],

"bumper retainer":[
"bumper retainer",
"bumper holder"
],

"bumper screw":[
"bumper screw",
"bumper bolt"
],

"bumper washer":[
"bumper washer",
"mount washer"
],

"bumper clip holder":[
"bumper clip holder",
"clip holder"
],

"grille bracket":[
"grille bracket",
"grille mount bracket"
],

"grille screw":[
"grille screw",
"grille bolt"
],

"grille clip":[
"grille clip",
"grille fastener"
],

"grille trim":[
"grille trim",
"front grille trim"
],

"grille molding":[
"grille molding",
"grille chrome trim"
],

"hood support":[
"hood support",
"bonnet support"
],

"hood insulation clip":[
"hood insulation clip",
"bonnet insulation clip"
],

"hood striker":[
"hood striker",
"bonnet striker"
],

"hood safety latch":[
"hood safety latch",
"bonnet safety latch"
],

"hood rubber stopper":[
"hood rubber stopper",
"bonnet stopper"
],

"hood trim":[
"hood trim",
"bonnet trim"
]

"engine bay fuse":[
"engine bay fuse",
"main fuse"
],

"main relay":[
"main relay",
"engine relay"
],

"ecu":[
"ecu",
"engine control unit"
],

"pcm":[
"pcm",
"powertrain control module"
],

"tcm":[
"tcm",
"transmission control module"
],

"bcm":[
"bcm",
"body control module"
],

"abs module":[
"abs module",
"abs control unit"
],

"airbag module":[
"airbag module",
"srs module"
],

"immobilizer":[
"immobilizer",
"anti theft module"
],

"key immobilizer":[
"key immobilizer",
"immobilizer chip"
],

"remote receiver":[
"remote receiver",
"key receiver"
],

"door control module":[
"door control module",
"door ecu"
],

"seat control module":[
"seat control module",
"seat ecu"
],

"climate control module":[
"climate control module",
"ac ecu"
],

"parking sensor module":[
"parking sensor module",
"sensor ecu"
],

"tpms module":[
"tpms module",
"tire pressure module"
],

"lighting control module":[
"lighting control module",
"lamp control unit"
],

"window control module":[
"window control module",
"window ecu"
],

"mirror control module":[
"mirror control module",
"mirror ecu"
],

"steering ecu":[
"steering ecu",
"eps ecu"
]

"mirror motor":[
"mirror motor",
"side mirror motor"
],

"mirror switch":[
"mirror switch",
"mirror control switch"
],

"mirror heater":[
"mirror heater",
"heated mirror element"
],

"mirror bracket":[
"mirror bracket",
"mirror mount bracket"
],

"mirror base":[
"mirror base",
"mirror mounting base"
],

"mirror frame":[
"mirror frame",
"side mirror frame"
],

"mirror seal":[
"mirror seal",
"mirror rubber seal"
],

"mirror cap":[
"mirror cap",
"mirror top cover"
],

"mirror hinge":[
"mirror hinge",
"mirror folding hinge"
],

"mirror wiring":[
"mirror wiring",
"mirror harness"
],

"mirror folding motor":[
"mirror folding motor",
"power fold motor"
],

"mirror indicator lens":[
"mirror indicator lens",
"mirror signal lens"
],

"mirror indicator bulb":[
"mirror indicator bulb",
"mirror signal bulb"
],

"mirror indicator housing":[
"mirror indicator housing",
"signal housing"
],

"mirror trim":[
"mirror trim",
"mirror chrome trim"
],

"mirror mount":[
"mirror mount",
"mirror holder"
],

"mirror clip":[
"mirror clip",
"mirror fastener"
],

"mirror screw":[
"mirror screw",
"mirror bolt"
],

"mirror washer":[
"mirror washer",
"mount washer"
],

"mirror gasket":[
"mirror gasket",
"mirror seal gasket"
]

"engine cover clip":[
"engine cover clip",
"engine clip"
],

"engine cover screw":[
"engine cover screw",
"engine bolt"
],

"engine cover nut":[
"engine cover nut",
"cover nut"
],

"engine cover gasket":[
"engine cover gasket",
"top cover gasket"
],

"engine cover bracket":[
"engine cover bracket",
"cover bracket"
],

"engine cover mount":[
"engine cover mount",
"cover mount"
],

"engine cover trim":[
"engine cover trim",
"engine trim"
],

"engine cover insulation":[
"engine cover insulation",
"cover insulation"
],

"engine cover badge":[
"engine cover badge",
"engine emblem"
],

"engine cover rubber":[
"engine cover rubber",
"cover rubber"
],

"engine cover spacer":[
"engine cover spacer",
"cover spacer"
],

"engine cover holder":[
"engine cover holder",
"cover holder"
],

"engine cover fastener":[
"engine cover fastener",
"cover fastener"
],

"engine cover clamp":[
"engine cover clamp",
"cover clamp"
],

"engine cover support":[
"engine cover support",
"cover support"
],

"engine cover pad":[
"engine cover pad",
"cover pad"
],

"engine cover insulation clip":[
"insulation clip",
"cover insulation clip"
],

"engine cover frame":[
"engine cover frame",
"cover frame"
],

"engine cover hinge":[
"engine cover hinge",
"cover hinge"
],

"engine cover latch":[
"engine cover latch",
"cover latch"
]

"license plate":[
"license plate",
"number plate"
],

"plate bracket":[
"plate bracket",
"number plate bracket"
],

"plate bolt":[
"plate bolt",
"number plate bolt"
],

"plate clip":[
"plate clip",
"number plate clip"
],

"plate holder":[
"plate holder",
"number plate holder"
],

"plate frame":[
"plate frame",
"license frame"
],

"plate trim":[
"plate trim",
"plate garnish"
],

"plate lamp":[
"plate lamp",
"number plate lamp"
],

"plate lamp bulb":[
"plate lamp bulb",
"plate light bulb"
],

"plate lamp housing":[
"plate lamp housing",
"plate light housing"
],

"plate lamp lens":[
"plate lamp lens",
"plate light lens"
],

"plate lamp wiring":[
"plate lamp wiring",
"plate harness"
],

"plate lamp screw":[
"plate lamp screw",
"lamp screw"
],

"plate lamp clip":[
"plate lamp clip",
"lamp clip"
],

"plate seal":[
"plate seal",
"plate rubber seal"
],

"plate gasket":[
"plate gasket",
"plate seal gasket"
],

"plate mount":[
"plate mount",
"plate holder mount"
],

"plate fastener":[
"plate fastener",
"plate clip fastener"
],

"plate cover":[
"plate cover",
"number plate cover"
],

"plate protector":[
"plate protector",
"plate guard"
]

"cargo net":[
"cargo net",
"trunk net"
],

"cargo organizer":[
"cargo organizer",
"trunk organizer"
],

"cargo hook":[
"cargo hook",
"trunk hook"
],

"cargo cover":[
"cargo cover",
"trunk cover"
],

"cargo tray":[
"cargo tray",
"trunk tray"
],

"cargo mat":[
"cargo mat",
"boot mat"
],

"cargo light":[
"cargo light",
"trunk light"
],

"cargo light bulb":[
"cargo light bulb",
"trunk bulb"
],

"cargo light lens":[
"cargo light lens",
"trunk light lens"
],

"cargo light switch":[
"cargo light switch",
"trunk switch"
],

"cargo latch":[
"cargo latch",
"trunk latch"
],

"cargo lock":[
"cargo lock",
"trunk lock"
],

"cargo seal":[
"cargo seal",
"trunk seal"
],

"cargo trim":[
"cargo trim",
"trunk trim panel"
],

"cargo bracket":[
"cargo bracket",
"trunk bracket"
],

"cargo clip":[
"cargo clip",
"trunk clip"
],

"cargo screw":[
"cargo screw",
"trunk screw"
],

"cargo fastener":[
"cargo fastener",
"trunk fastener"
],

"cargo insulation":[
"cargo insulation",
"trunk insulation"
],

"cargo floor":[
"cargo floor",
"trunk floor board"
]

"car key":[
"car key",
"vehicle key"
],

"key blade":[
"key blade",
"key metal blade"
],

"key remote":[
"key remote",
"car remote key"
],

"remote battery holder":[
"remote battery holder",
"key battery holder"
],

"remote shell":[
"remote shell",
"key remote shell"
],

"remote button pad":[
"remote button pad",
"keypad rubber"
],

"remote chip":[
"remote chip",
"transponder chip"
],

"remote pcb":[
"remote pcb",
"key circuit board"
],

"remote antenna":[
"remote antenna",
"key antenna"
],

"remote screw":[
"remote screw",
"key screw"
],

"remote gasket":[
"remote gasket",
"key seal"
],

"remote clip":[
"remote clip",
"key clip"
],

"remote ring":[
"remote ring",
"key ring"
],

"remote keychain":[
"remote keychain",
"car key chain"
],

"remote cover":[
"remote cover",
"key cover"
],

"remote protector":[
"remote protector",
"key protector"
],

"remote holder":[
"remote holder",
"key holder"
],

"remote pouch":[
"remote pouch",
"key pouch"
],

"remote strap":[
"remote strap",
"key strap"
],

"remote case":[
"remote case",
"key case"
]

"carpet floor mat":[
"carpet floor mat",
"car carpet mat"
],

"rubber floor mat":[
"rubber floor mat",
"car rubber mat"
],

"tpu floor mat":[
"tpu floor mat",
"tpu car mat"
],

"3d floor mat":[
"3d floor mat",
"3d car mat"
],

"5d floor mat":[
"5d floor mat",
"5d car mat"
],

"7d floor mat":[
"7d floor mat",
"7d car mat"
],

"diamond floor mat":[
"diamond floor mat",
"diamond car mat"
],

"luxury floor mat":[
"luxury floor mat",
"premium car mat"
],

"universal floor mat":[
"universal floor mat",
"universal car mat"
],

"custom floor mat":[
"custom floor mat",
"vehicle custom mat"
],

"anti slip floor mat":[
"anti slip floor mat",
"non slip car mat"
],

"waterproof floor mat":[
"waterproof floor mat",
"waterproof car mat"
],

"heavy duty floor mat":[
"heavy duty floor mat",
"heavy car mat"
],

"front floor mat":[
"front floor mat",
"front car mat"
],

"rear floor mat":[
"rear floor mat",
"rear car mat"
],

"driver floor mat":[
"driver floor mat",
"driver side mat"
],

"passenger floor mat":[
"passenger floor mat",
"passenger side mat"
],

"floor mat clip":[
"floor mat clip",
"car mat clip"
],

"floor mat button":[
"floor mat button",
"mat fixing button"
],

"floor mat holder":[
"floor mat holder",
"mat holder"
]

"trunk mat":[
"trunk mat",
"boot mat"
],

"trunk tray":[
"trunk tray",
"boot tray"
],

"tpu trunk mat":[
"tpu trunk mat",
"tpu boot mat"
],

"rubber trunk mat":[
"rubber trunk mat",
"rubber boot mat"
],

"plastic trunk tray":[
"plastic trunk tray",
"boot plastic tray"
],

"cargo liner":[
"cargo liner",
"boot liner"
],

"cargo tray":[
"cargo tray",
"vehicle cargo tray"
],

"waterproof trunk mat":[
"waterproof trunk mat",
"boot waterproof mat"
],

"anti slip trunk mat":[
"anti slip trunk mat",
"non slip trunk mat"
],

"trunk organizer box":[
"trunk organizer box",
"boot storage box"
],

"trunk storage bag":[
"trunk storage bag",
"boot organizer bag"
],

"trunk hook clip":[
"trunk hook clip",
"boot hook clip"
],

"trunk cargo net":[
"trunk cargo net",
"boot net"
],

"trunk board":[
"trunk board",
"boot floor board"
],

"trunk floor panel":[
"trunk floor panel",
"boot floor panel"
],

"trunk side trim":[
"trunk side trim",
"boot trim panel"
],

"trunk carpet":[
"trunk carpet",
"boot carpet"
],

"trunk mat fastener":[
"trunk mat fastener",
"boot mat fastener"
],

"trunk mat button":[
"trunk mat button",
"boot mat button"
],

"trunk mat clip":[
"trunk mat clip",
"boot mat clip"
]

"door handle outer":[
"outer door handle",
"exterior door handle"
],

"door handle inner":[
"inner door handle",
"interior door handle"
],

"chrome door handle":[
"chrome door handle",
"door chrome handle"
],

"door handle cover":[
"door handle cover",
"handle chrome cover"
],

"door handle bowl":[
"door handle bowl",
"handle cup protector"
],

"door handle trim":[
"door handle trim",
"handle garnish"
],

"door handle cap":[
"door handle cap",
"handle end cap"
],

"door handle bracket":[
"door handle bracket",
"handle mounting bracket"
],

"door handle rod":[
"door handle rod",
"handle linkage rod"
],

"door handle spring":[
"door handle spring",
"handle return spring"
],

"door handle repair kit":[
"door handle repair kit",
"handle fix kit"
],

"rear door handle":[
"rear door handle",
"back door handle"
],

"front door handle":[
"front door handle",
"driver door handle"
],

"door handle screw":[
"door handle screw",
"handle mounting screw"
],

"door handle bolt":[
"door handle bolt",
"handle bolt"
],

"door handle gasket":[
"door handle gasket",
"handle rubber seal"
],

"door handle switch":[
"door handle switch",
"smart handle switch"
],

"door handle sensor":[
"door handle sensor",
"smart entry sensor"
],

"door handle protector":[
"door handle protector",
"handle paint protector"
],

"door handle insert":[
"door handle insert",
"handle insert trim"
]

"door lock cylinder":[
"door lock cylinder",
"door key cylinder"
],

"door lock knob":[
"door lock knob",
"lock pin knob"
],

"door lock rod":[
"door lock rod",
"lock linkage rod"
],

"door lock clip":[
"door lock clip",
"lock rod clip"
],

"door lock actuator motor":[
"lock actuator motor",
"door lock motor"
],

"door lock repair kit":[
"door lock repair kit",
"lock repair kit"
],

"rear door lock":[
"rear door lock",
"back door lock"
],

"front door lock":[
"front door lock",
"driver door lock"
],

"door latch lock":[
"door latch lock",
"latch mechanism"
],

"child lock":[
"child lock",
"rear child lock"
],

"central lock pump":[
"central lock pump",
"central locking pump"
],

"door striker plate":[
"door striker plate",
"lock striker plate"
],

"door lock bracket":[
"door lock bracket",
"lock mounting bracket"
],

"door lock cable":[
"door lock cable",
"lock wire"
],

"door lock spring":[
"door lock spring",
"lock return spring"
],

"door lock lever":[
"door lock lever",
"lock release lever"
],

"door lock sensor":[
"door lock sensor",
"lock position sensor"
],

"door lock switch":[
"door lock switch",
"central lock switch"
],

"door lock trim":[
"door lock trim",
"lock trim cover"
],

"door lock cap":[
"door lock cap",
"lock cover cap"
]

"spark plug iridium":[
"iridium spark plug",
"iridium plug"
],

"spark plug platinum":[
"platinum spark plug",
"platinum plug"
],

"spark plug copper":[
"copper spark plug",
"copper plug"
],

"spark plug boot":[
"spark plug boot",
"plug boot"
],

"spark plug socket":[
"spark plug socket",
"plug socket"
],

"spark plug gap tool":[
"spark plug gap tool",
"plug gap tool"
],

"spark plug tester":[
"spark plug tester",
"plug tester"
],

"spark plug washer":[
"spark plug washer",
"plug washer"
],

"spark plug seal":[
"spark plug seal",
"plug gasket"
],

"spark plug holder":[
"spark plug holder",
"plug holder"
],

"spark plug cap":[
"spark plug cap",
"plug cap"
],

"spark plug connector":[
"spark plug connector",
"plug connector"
],

"spark plug terminal":[
"spark plug terminal",
"plug terminal"
],

"spark plug tube":[
"spark plug tube",
"plug tube"
],

"spark plug tube seal":[
"spark plug tube seal",
"plug tube seal"
],

"spark plug tube gasket":[
"spark plug tube gasket",
"plug tube gasket"
],

"spark plug cable set":[
"spark plug cable set",
"plug wire set"
],

"spark plug shield":[
"spark plug shield",
"plug heat shield"
],

"spark plug adapter":[
"spark plug adapter",
"plug adapter"
],

"spark plug repair kit":[
"spark plug repair kit",
"plug repair kit"
]

"radiator coolant bottle":[
"radiator coolant bottle",
"coolant overflow bottle"
],

"coolant expansion tank":[
"coolant expansion tank",
"coolant tank"
],

"radiator reservoir":[
"radiator reservoir",
"coolant reservoir tank"
],

"coolant reservoir cap":[
"coolant reservoir cap",
"tank cap"
],

"coolant level sensor":[
"coolant level sensor",
"reservoir sensor"
],

"coolant tank bracket":[
"coolant tank bracket",
"reservoir bracket"
],

"coolant tank hose":[
"coolant tank hose",
"reservoir hose"
],

"coolant tank clip":[
"coolant tank clip",
"reservoir clip"
],

"coolant tank bolt":[
"coolant tank bolt",
"reservoir bolt"
],

"coolant tank mount":[
"coolant tank mount",
"tank mount"
],

"coolant filler neck":[
"coolant filler neck",
"radiator filler neck"
],

"coolant funnel":[
"coolant funnel",
"radiator funnel"
],

"coolant flush kit":[
"coolant flush kit",
"radiator flush kit"
],

"coolant tester":[
"coolant tester",
"antifreeze tester"
],

"coolant hose connector":[
"coolant hose connector",
"radiator hose connector"
],

"coolant bleed valve":[
"coolant bleed valve",
"radiator bleed valve"
],

"coolant temperature switch":[
"coolant temperature switch",
"temp switch"
],

"coolant thermostat housing":[
"thermostat housing",
"coolant housing"
],

"coolant adapter":[
"coolant adapter",
"radiator adapter"
],

"coolant drain valve":[
"coolant drain valve",
"radiator drain valve"
]

"windshield glass":[
"windshield glass",
"front windshield glass"
],

"laminated windshield":[
"laminated windshield",
"laminated front glass"
],

"windshield molding":[
"windshield molding",
"front glass molding"
],

"windshield trim":[
"windshield trim",
"glass trim"
],

"windshield seal rubber":[
"windshield seal rubber",
"glass rubber seal"
],

"windshield clip":[
"windshield clip",
"glass clip"
],

"windshield bracket":[
"windshield bracket",
"glass bracket"
],

"windshield mount":[
"windshield mount",
"glass mount"
],

"windshield adhesive":[
"windshield adhesive",
"glass adhesive"
],

"windshield primer":[
"windshield primer",
"glass primer"
],

"windshield setting tape":[
"windshield setting tape",
"glass tape"
],

"windshield spacer":[
"windshield spacer",
"glass spacer"
],

"windshield washer":[
"windshield washer",
"washer jet washer"
],

"windshield washer cap":[
"windshield washer cap",
"washer bottle cap"
],

"windshield washer hose":[
"washer hose",
"windshield hose"
],

"windshield washer filter":[
"washer filter",
"washer pump filter"
],

"windshield washer motor":[
"washer motor",
"washer pump motor"
],

"windshield washer relay":[
"washer relay",
"washer pump relay"
],

"windshield washer switch":[
"washer switch",
"washer control switch"
],

"windshield washer connector":[
"washer connector",
"washer wiring connector"
]

"engine oil synthetic":[
"synthetic engine oil",
"full synthetic oil"
],

"engine oil semi synthetic":[
"semi synthetic oil",
"semi synthetic engine oil"
],

"engine oil mineral":[
"mineral engine oil",
"mineral oil"
],

"engine oil additive":[
"engine oil additive",
"oil additive"
],

"engine oil treatment":[
"engine oil treatment",
"oil treatment"
],

"engine oil stabilizer":[
"engine oil stabilizer",
"oil stabilizer"
],

"engine oil flush":[
"engine oil flush",
"engine flush"
],

"engine oil funnel":[
"engine oil funnel",
"oil funnel"
],

"engine oil filter wrench":[
"oil filter wrench",
"filter wrench"
],

"engine oil dipstick tube":[
"oil dipstick tube",
"dipstick pipe"
],

"engine oil sensor":[
"engine oil sensor",
"oil pressure sensor"
],

"engine oil pressure switch":[
"oil pressure switch",
"engine oil switch"
],

"engine oil cooler hose":[
"oil cooler hose",
"oil cooling hose"
],

"engine oil cooler adapter":[
"oil cooler adapter",
"oil adapter"
],

"engine oil cooler line":[
"oil cooler line",
"oil cooling line"
],

"engine oil cap gasket":[
"oil cap gasket",
"engine oil cap seal"
],

"engine oil filler neck":[
"oil filler neck",
"engine oil filler"
],

"engine oil drain hose":[
"oil drain hose",
"engine drain hose"
],

"engine oil catch can":[
"oil catch can",
"engine catch can"
],

"engine oil separator":[
"oil separator",
"engine oil separator"
]

"transmission oil synthetic":[
"synthetic transmission oil",
"synthetic gear oil"
],

"automatic transmission oil":[
"automatic transmission oil",
"atf oil"
],

"manual transmission oil":[
"manual transmission oil",
"mtf oil"
],

"gearbox oil additive":[
"gearbox oil additive",
"transmission additive"
],

"gearbox oil cooler":[
"gearbox oil cooler",
"transmission cooler"
],

"gearbox oil hose":[
"gearbox oil hose",
"transmission hose"
],

"gearbox oil pump":[
"gearbox oil pump",
"transmission pump"
],

"gearbox oil pan":[
"gearbox oil pan",
"transmission pan"
],

"gearbox oil gasket":[
"gearbox oil gasket",
"transmission pan gasket"
],

"gearbox oil drain plug":[
"gearbox oil drain plug",
"transmission drain plug"
],

"gearbox oil filter":[
"gearbox oil filter",
"transmission oil filter"
],

"gearbox oil level sensor":[
"gearbox oil level sensor",
"transmission sensor"
],

"gearbox oil dipstick":[
"gearbox oil dipstick",
"transmission dipstick"
],

"gearbox oil filler plug":[
"gearbox oil filler plug",
"transmission filler plug"
],

"gearbox oil seal":[
"gearbox oil seal",
"transmission oil seal"
],

"gearbox oil cooler line":[
"gearbox oil cooler line",
"transmission cooler line"
],

"gearbox oil radiator":[
"gearbox oil radiator",
"transmission radiator"
],

"gearbox oil adapter":[
"gearbox oil adapter",
"transmission adapter"
],

"gearbox oil funnel":[
"gearbox oil funnel",
"transmission funnel"
],

"gearbox oil temperature sensor":[
"gearbox oil temperature sensor",
"transmission temp sensor"
]

"car button sticker":[
"car button sticker",
"dashboard button sticker"
],

"dashboard switch sticker":[
"dashboard switch sticker",
"switch label sticker"
],

"ac button sticker":[
"ac button sticker",
"ac switch sticker"
],

"window button sticker":[
"window button sticker",
"window switch sticker"
],

"mirror switch sticker":[
"mirror switch sticker",
"mirror button sticker"
],

"hazard button sticker":[
"hazard button sticker",
"hazard switch sticker"
],

"start stop button sticker":[
"start stop button sticker",
"engine start sticker"
],

"gear button sticker":[
"gear button sticker",
"gear selector sticker"
],

"steering button sticker":[
"steering button sticker",
"steering control sticker"
],

"cruise button sticker":[
"cruise button sticker",
"cruise control sticker"
],

"radio button sticker":[
"radio button sticker",
"audio button sticker"
],

"navigation button sticker":[
"navigation button sticker",
"nav button sticker"
],

"seat heater sticker":[
"seat heater sticker",
"seat heat button sticker"
],

"defogger button sticker":[
"defogger button sticker",
"rear defog sticker"
],

"parking sensor sticker":[
"parking sensor sticker",
"sensor button sticker"
],

"traction control sticker":[
"traction control sticker",
"tcs button sticker"
],

"eco mode sticker":[
"eco mode sticker",
"eco button sticker"
],

"sport mode sticker":[
"sport mode sticker",
"sport button sticker"
],

"drive mode sticker":[
"drive mode sticker",
"drive button sticker"
],

"fog light button sticker":[
"fog light button sticker",
"fog switch sticker"
]

}

function detectPart(text){

text = text.toLowerCase()

for(const part in PARTS){

for(const keyword of PARTS[part]){

if(text.includes(keyword)){
return part
}

}

}

return null

}

module.exports = {detectPart}
