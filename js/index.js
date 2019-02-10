let header = `State,Male,Female,Ratio`;
let data = `AL,2320188,2459548,0.943339183,Alabama
AK,369628,340603,1.085216513,Alaska
AZ,3175823,3216194,0.987447586,Arizona
AR,1431637,1484281,0.964532322,Arkansas
CA,18517830,18736126,0.988348925,California
CO,2520662,2508534,1.004834696,Colorado
CT,1739614,1834483,0.948285702,Connecticut
DE,434939,462995,0.939403233,Delaware
FL,9189355,9611955,0.956033918,Florida
GA,4729171,4958482,0.95375379,Georgia
HI,681243,679058,1.003217693,Hawaii
ID,785324,782258,1.003919423,Idaho
IL,6292276,6538356,0.962363628,Illinois
IN,3189737,3294065,0.968328494,Indiana
IA,1508319,1538036,0.980678606,Iowa
KS,1415408,1437710,0.984487831,Kansas
KY,2134952,2204415,0.968489146,Kentucky
LA,2219292,2314080,0.959038581,Louisiana
ME,650056,678305,0.958353543,Maine
MD,2791762,2981790,0.936270495,Maryland
MA,3166628,3381001,0.936594813,Massachusetts
MI,4848114,5035526,0.962782041,Michigan
MN,2632132,2671793,0.985155661,Minnesota
MS,1441240,1526057,0.944420818,Mississippi
MO,2933477,3055450,0.960080185,Missouri
MT,496667,492748,1.007953355,Montana
NE,906296,920045,0.985056166,Nebraska
NV,1363616,1336935,1.019956842,Nevada
NH,649394,667076,0.973493275,New Hampshire
NJ,4279600,4512294,0.948431108,New Jersey
NM,1017421,1041758,0.976638528,New Mexico
NY,9377147,10000955,0.937625157,New York
NC,4645492,4889991,0.950000112,North Carolina
ND,339864,332727,1.021450018,North Dakota
OH,5632156,5904348,0.953899736,Ohio
OK,1856977,1894374,0.980258914,Oklahoma
OR,1896002,1935072,0.979809537,Oregon
PA,6190363,6512016,0.950606233,Pennsylvania
RI,508400,544167,0.934272016,Rhode Island
SC,2250101,2375263,0.947306046,South Carolina
SD,407381,406799,1.001430682,South Dakota
TN,3093504,3252601,0.951086223,Tennessee
TX,12472280,12673281,0.984139782,Texas
UT,1388317,1375568,1.009268171,Utah
VT,308206,317535,0.970620562,Vermont
VA,3925983,4075041,0.963421718,Virginia
WA,3349707,3374833,0.992554891,Washington
WV,913586,939408,0.972512476,West Virginia
WI,2822400,2864586,0.985273265,Wisconsin
WY,287437,276189,1.040725735,Wyoming`;

let dataArray = data.split("\n");
let dataObj = {}

let minRatio = Number.MAX_VALUE;
let maxRatio = 0;


let minPop = Number.MAX_VALUE;
let maxPop = 0;

for (let str of dataArray){
	let state = str.split(",");

	let ratio = parseFloat(state[3]);
	let population = parseInt(state[1]) + parseInt(state[2])
	dataObj[state[0]] = {
		male:parseInt(state[1]),
		female:parseInt(state[2]),
		difference:state[2]-state[1],
		ratio:ratio,
		name:state[4],
		population: population
	}

	if (ratio < minRatio ){
		minRatio = ratio;
	}else if (ratio > maxRatio){
		maxRatio = ratio;
	}
	if (population < minPop){
		minPop = population;
	}else if (population > maxPop){
		maxPop = population;
	}
}



function ratioToHex(r){
	

	if (r < 1){
		let d = (1 - minRatio)/256;

		let b = Math.round((r - minRatio)/d);
		let hex = b.toString(16);
		
		if (hex.length == 3){
			hex = 'ff'
		}
		if (hex.length == 1){
			hex = '0' + hex;
		}

		return '#ff' + hex + hex;

	}else{

		let d = (maxRatio-1)/256;
		let b = 256 - Math.round((r - 1)/d);
		let hex = b.toString(16);
		if (hex.length == 3){
			hex = 'ff'
		}
		if (hex.length == 1){
			hex = '0' + hex;
		}

		return '#' + hex + hex + 'ff';



	}
	
}

function popToHex(pop){
	let d = (maxPop-minPop)/256;

	let b = 256 -Math.round((pop - minPop)/d);

	let hex = b.toString(16);

	if (hex.length == 3){
		hex = 'ff';
	}
	if (hex.length == 1){
		hex = '0' + hex;
	}

	return "#" + hex + "ff" + hex;

}



let stateStylesObj = {};

for (let state of Object.keys(dataObj)){
	stateStylesObj[state] = {
		fill: ratioToHex(dataObj[state].ratio)
	}
}

let stateStylesObjPop = {};

for (let state of Object.keys(dataObj)){
	stateStylesObjPop[state] = {
		fill: popToHex(dataObj[state].population)
	}
}



$(document).ready(function() {

	let mapClone = $('#map').clone();

	$('#map').usmap({
    	stateStyles: {fill: 'white', stroke:'black', 'stroke-width':1},
    	stateHoverStyles: {stroke: 'grey','stroke-width':2},
    	showLabels: false,
    });

	$('#placeholder').text("Select a heatmap to view!")

	//gender
    $("#gender").click(function(){
    	$('#map').replaceWith(mapClone);
    	mapClone = $('#map').clone();


    	$('#placeholder').text('Hover over a state to learn more about it!');


	    $('#map').usmap({
	    	stateStyles: {fill: 'white', stroke:'black', 'stroke-width':1},
    		stateHoverStyles: {stroke: 'grey','stroke-width':2},
    		showLabels: false,
	    	stateStyles: {fill: 'white', stroke:'black', 'stroke-width':1},
	    	stateSpecificStyles: stateStylesObj,
	    	mouseover: function(event, data) {
	      		$('#hoverName').text(dataObj[data.name].name);
	      		$('#hoverMale').text("Male population: " + dataObj[data.name].male);
	      		$('#hoverFemale').text("Female population: " + dataObj[data.name].female);
	      		$('#hoverRatio').text("M/F ratio: " + dataObj[data.name].ratio);
	      		$('#placeholder').text("");
	    	},
	    	mouseout: function(event, data) {
	    		$('#hoverName').text("");
	      		$('#placeholder').text('Hover over a state to learn more about it!');
	      		$('#hoverMale').text("");
	      		$('#hoverFemale').text("");
	      		$('#hoverRatio').text("");
	    	}
	    });


	});

    //population
	$("#pop").click(function(){
		$('#map').replaceWith(mapClone);
    	mapClone = $('#map').clone();

    	$('#placeholder').text('Hover over a state to learn more about it!');
	    $('#map').usmap({
	    	showLabels: false,
	    	stateSpecificStyles: stateStylesObjPop,
	    	mouseover: function(event, data) {
	      		$('#hoverName').text(dataObj[data.name].name);
	      		$('#hoverRatio').text("Population: " + dataObj[data.name].population);
	      		$('#hoverMale').text("");
	      		$('#hoverFemale').text("");
	      		$('#placeholder').text("");
	    	},
	    	mouseout: function(event, data) {
	    		$('#hoverName').text("");
	      		$('#placeholder').text('Hover over a state to learn more about it!');
	      		$('#hoverRatio').text("");
	    	}
	    });

	});




	$("#navbarResponsive a").click(function(){
		if (this.hash !== "") {
			event.preventDefault();
			var hash = this.hash;
			$('html, body').animate({
				scrollTop: $(hash).offset().top
			}, 1200, function(){
				window.location.hash = hash;
			});
		}
	});




});

