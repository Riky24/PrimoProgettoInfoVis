// Lista dei colori in tonalità pastello: red, green, yellow, blue, black, white, gray, orange, brown, purple
var colour = ["#E74C3C", "#27AE60", "#F1C40F", "#2980B9", "#2C3E50", "#ECF0F1", "#95A5A6", "#E67E22", "#795548", "#9B59B6"];
var margin = {top: 20, right: 20, bottom: 30, left: 40}; // margini
var updateTime = 2000; // tempo di transizione per le animazioni

// Dimensioni totali dell'immagine
var totalHeight = 600;
var totalWidth = 800;

// Dimensioni min e max per la rappresentazione delle farfalle
var maxDim = 2;
var minDim = 0.5;

// Definizione delle scale  per posizione e dimensioni
var scalePositionX = d3.scaleLinear();
var scalePositionY = d3.scaleLinear();
var scaleDimension = d3.scaleLinear();

// Definizione della superficie utilizzabile
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
.attr("width", totalWidth) 
.attr("height", totalHeight)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Definizione dell'array che conterrà 10 array 
// di 5 elementi relativi alle 5 variabili date
var val = [];

// Funzione che legge tutti i valori dati in val,
// individua il massimo e minimo e definisce i valori
// di input e output delle scale
function calcolaScalePosition(){
    var max = 0;
    var min = null;
    for(let i = 0; i<val.length; i++){
        for(let c = 2; c<val[i].length; c++){  //si ignorano le posizioni zero e uno che contengono il valore relativo all'ID e il codice colore
            if(val[i][c]>max) max = val[i][c];
            if(min == null) min = val[i][c];
            if(val[i][c]<min) min = val[i][c];
        }
    }
    // scala per l'asse x
    scalePositionX.domain([min, max]);
    scalePositionX.range([60, width-60]); //il range di output è ridotto di 60 per evitare che le farfalle fuoriescano dai bordi
    // scala per l'asse y
    scalePositionY.domain([min, max]);
    scalePositionY.range([60, height-60]);
    // scala per le dimensioni
    scaleDimension.domain([min, max]);
    scaleDimension.range([minDim, maxDim]);
}

// Funzione che dati i valori del file json popola
// l'array val(array di 10 elementi array, contenenti le 5 variabili date)
// e invoca la funzione per il calcolo delle scale
function popolaValori(data){
    let len = data.length;
    console.log(len);
    for(let i = 0; i<len; i++){
        let arr = [data[i].butt_id]; // ID della farfalla
        arr.push(i); // codice colore definito dalla posizione di inserimento
        arr.push(data[i].variables.first);
        arr.push(data[i].variables.second);
        arr.push(data[i].variables.third);
        arr.push(data[i].variables.fourth);
        arr.push(data[i].variables.fifth);
        val.push(arr);
    };
    calcolaScalePosition();
}

// Funzione che ruota di una posizione i valori dell'array passato tramite id
function ruotaValori(id){
    let a = val[id][2];
    for(let i = 2; i<6; i++){  // si ignorano gli elementi in posizione zero ed uno
        val[id][i] = val[id][i+1];
    }
    val[id][6] = a;
}

// Funzione attivata dal click sulla farfalla che invoca la rotazione
// dei valori per l'ID passato e l'aggiornamento della rappresentazione
function action(id){
    ruotaValori(id);
    updateDraw();
}

// Funzione che ritorna la stringa del colore (univoca per 10 farfalle)
// e nel caso di più di 10 farfalle ripete l'assegnazione del colore
function getColour(colNumber){
    while(colNumber > colour.length-1){
        colNumber -= 10;
    }
    return colour[colNumber];
}

// funzione che si uccupa della rappresentazione delle farfalle nelle loro 3 parti
function updateDraw(){

    //gestione delle ali
    var ali = svg.selectAll(".ali").data(val);

    ali.exit().remove();

    ali.enter().append("path")
        .attr("id", function(d){
            return d[0];
        })
        .attr("class", "ali")
        .attr("d", "M 0 0 C 25 -50 37.5 0 7.5 0 C 25 12.5 7.5 30 0 0 C -7.5 30 -25 12.5 -7.5 0 C -37.5 0 -25 -50 0 0")
        .attr("transform", function(d) { return "translate("+scalePositionX(d[2])+","+scalePositionY(d[3])+") scale("+scaleDimension(d[4])+")" })
        .attr("fill", function(d) {return getColour(d[1])})
        .attr("stroke-width", "1")
        .attr("stroke", "black")
        .attr("onclick", function(d) { return "action("+d[0]+")"});

    ali.transition().duration(updateTime)
    .attr("transform", function(d) { return "translate("+scalePositionX(d[2])+","+scalePositionY(d[3])+") scale("+scaleDimension(d[4])+")" })

    //gestione degli addomi
    var addomi = svg.selectAll(".addome").data(val);

    addomi.exit().remove();

    addomi.enter().append("path")
        .attr("id", function(d){
            return d[0];
        })
        .attr("class", "addome")
        .attr("d", "M -2 0 C -2 -13 2 -13 2 0 C 2 13 -2 13 -2 0")
        .attr("transform", function(d) { return "translate("+scalePositionX(d[2])+","+scalePositionY(d[3])+") scale("+scaleDimension(d[6])+")" })
        .attr("fill", function(d) {return getColour(d[1])})
        .attr("stroke-width", "1")
        .attr("stroke", "black")
        .attr("onclick", function(d) { return "action("+d[0]+")"});

    addomi.transition().duration(updateTime)
    .attr("transform", function(d) { return "translate("+scalePositionX(d[2])+","+scalePositionY(d[3])+") scale("+scaleDimension(d[6])+")" })

    //gestione delle teste
    var teste = svg.selectAll(".testa").data(val);

    teste.exit().remove();

    teste.enter().append("path")
        .attr("id", function(d){
            return d[0];
        })
        .attr("class", "testa")
        .attr("d", "M -2.7 -18.2 L 0 -12.2 C -7.5 -6.2 7.5 -6.2 0 -12.2 L 2.7 -18.2 L 0 -12.2 Z")
        .attr("transform", function(d) { return "translate("+scalePositionX(d[2])+","+scalePositionY(d[3])+") scale("+scaleDimension(d[5])+")" })
        .attr("fill", function(d) {return getColour(d[1])})
        .attr("stroke-width", "1")
        .attr("stroke", "black")
        .attr("onclick", function(d) { return "action("+d[0]+")"});

    teste.transition().duration(updateTime)
    .attr("transform", function(d) { return "translate("+scalePositionX(d[2])+","+scalePositionY(d[3])+") scale("+scaleDimension(d[5])+")" })
}

// Inizializzazione
d3.json("data/dataset.json").then(function(data) {

    popolaValori(data);

    updateDraw();

}).catch(function(error) {

    console.log(error); // Some error handling here
    
});