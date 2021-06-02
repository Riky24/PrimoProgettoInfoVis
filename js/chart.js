// Lista dei colori in tonalità pastello: red, green, yellow, blue, black, pink, gray, orange, brown, purple
var colour = ["#E74C3C", "#27AE60", "#F1C40F", "#2980B9", "#5D6D7E", "#F6CEE3", "#B2BABB", "#EB984E", "#795548", "#9B59B6"];
var margin = {top: 20, right: 20, bottom: 80, left: 40}; // margini
var updateTime = 2000; // tempo di transizione per le animazioni

// Dimensioni totali dell'immagine
var totalHeight = 600;
var totalWidth = 800;

// Dimensioni min e max per la rappresentazione delle farfalle
var maxDim = 2.2;
var minDim = 0.8;

// Definizione delle scale  per posizione e dimensioni
var scalePositionX = d3.scaleLinear();
var scalePositionY = d3.scaleLinear();
var scaleDimension = d3.scaleLinear();

// Definizione delle variabili degli assi
var xAxis = null
var yAxis = null

// Definizione della superficie utilizzabile
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
.attr("width", totalWidth) 
.attr("height", (totalHeight))
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Definizione dell'array che conterrà 10 array 
// di 5 elementi relativi alle 5 variabili date
var val = [];

// Array dei nomi delle 5 variabili che verranno acquisiti dal file JSON
var varName = [];

// Funzione che legge tutti i valori dati in val,
// individua il massimo e minimo e definisce i valori
// di input e output delle scale
function calcolaScalePosition(){
    var Xmax = 0;
    var Xmin = null;
    var Ymax = 0;
    var Ymin = null;
    var dimMax = 0;
    var dimMin = null;
    for(let i = 0; i<val.length; i++){
        for(let c = 2; c<val[i].length; c++){  //si ignorano le posizioni zero e uno che contengono il valore relativo all'ID e il codice colore
            if(c==2){  // variabile relativa all'asse x
                if(val[i][c]>Xmax) Xmax = val[i][c];
                if(Xmin == null) Xmin = val[i][c];
                if(val[i][c]<Xmin) Xmin = val[i][c];
            }
            else if(c==3){  // variabile relativa all'asse y
                if(val[i][c]>Ymax) Ymax = val[i][c];
                if(Ymin == null) Ymin = val[i][c];
                if(val[i][c]<Ymin) Ymin = val[i][c];
            }
            else{  // variabili relative alle dimensioni
                if(val[i][c]>dimMax) dimMax = val[i][c];
                if(dimMin == null) dimMin = val[i][c];
                if(val[i][c]<dimMin) dimMin = val[i][c];
            }
        }
    }
    // scala per l'asse x
    scalePositionX.domain([Xmin, Xmax]);
    scalePositionX.range([60, width-60]); //il range di output è ridotto di 60 per evitare che le farfalle fuoriescano dai bordi
    // scala per l'asse y
    scalePositionY.domain([Ymin, Ymax]);
    scalePositionY.range([height-60, 60]);
    // scala per le dimensioni
    scaleDimension.domain([dimMin, dimMax]);
    scaleDimension.range([minDim, maxDim]);

    // assegnazione scala asse x
    xAxis = d3.axisBottom(scalePositionX);
    // assegnazione scala asse y
    yAxis = d3.axisLeft(scalePositionY);
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
        if(i==0){  // si esegue solo alla prima occorrenza
            for(var k in data[i].variables){ // si popola l'array dei nomi delle variabili
                varName.push(k);
            }
        }
    };
    calcolaScalePosition();
}

// Funzione che disegna gli assi x e y
function drawAxes(){

    // disegna l'asse x
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // label per l'asse x
    svg.append("text")
        .attr("class", "xlabel")
        .attr("transform", "translate(" + (width) + " ," + (height-10) + ")")
        .attr("font-size","15px")
       .style("font-family", "verdana")
        .style("text-anchor", "end")
        .text(varName[0]+" var.");  // visualizza la prima variabile dell'array sull'asse x

    // disegna l'asse y
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // label per l'asse y
    svg.append("text")
        .attr("class", "ylabel")
       .attr("transform", "rotate(-90)")
       .attr("y", 20)
       .attr("font-size","15px")
       .style("font-family", "verdana")
       .style("text-anchor", "end")
       .text(varName[1]+" var.");  // visualizza la seconda variabile dell'array sull'asse y

    // intestazione del grafo
    svg.append("text")
       .attr("y", 0)
       .attr("x", (width/2))
       .attr("font-size","25px")
       .style("font-family", "verdana")
       .style("text-anchor", "middle")
       .text("Farfalle");

    // label per le dimensioni
    svg.append("text")
       .attr("class", "dimensionLabel")
       .attr("y", height+50)
       .attr("x", (width/2))
       .attr("font-size","12px")
       .style("font-family", "verdana")
       .style("text-anchor", "middle")
       .text("Dimensions: wings = "+varName[2]+" variable, head = "+varName[3]+" variable, body = "+varName[4]+" variable");
}

// Funzione che effettua la rotazione dei nomi delle variabili nell'arrai varName
// in accordo con la rotazione dei valori
function ruotaNomi(){
    let a = varName[0];
        for(let i = 0; i<4; i++){  // si ignorano gli elementi in posizione zero ed uno
            varName[i] = varName[i+1];
        }
        varName[4] = a;
}

// Funzione che ruota di una posizione i valori dell'array "val"
function ruotaValori(){
    for(let c = 0; c<val.length; c++){
        let a = val[c][2];
        for(let i = 2; i<6; i++){  // si ignorano gli elementi in posizione zero ed uno
            val[c][i] = val[c][i+1];
        }
        val[c][6] = a;
    }
    ruotaNomi();
}

function updateAxes(){
    // ".y.axis" selects elements that have both classes "y" and "axis", that is: class="y axis"
    svg.select(".y.axis").transition().duration(updateTime/2).call(yAxis);
    svg.select(".x.axis").transition().duration(updateTime/2).call(xAxis);
    // aggiornamento delle label visualizzate sugli assi
    svg.select(".xlabel").transition().duration(updateTime/2).text(varName[0]+" var.");
    svg.select(".ylabel").transition().duration(updateTime/2).text(varName[1]+" var.");
    svg.select(".dimensionLabel").transition().duration(updateTime/2).text("Dimensions: wings = "+varName[2]
    	+" variable, head = "+varName[3]+" variable, body = "+varName[4]+" variable");
}

// Funzione attivata dal click sulla farfalla, che invoca la rotazione
// dei valori e l'aggiornamento della rappresentazione
function action(){
    ruotaValori();
    calcolaScalePosition();
    updateAxes();
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
        .attr("onclick", function(d) { return "action()"});

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
        .attr("onclick", function(d) { return "action()"});

    addomi.transition().duration(updateTime)
    .attr("transform", function(d) { return "translate("+scalePositionX(d[2])+","+scalePositionY(d[3])+") scale("+scaleDimension(d[6])+")" })

    //gestione delle teste
    var teste = svg.selectAll(".testa").data(val);

    teste.exit().remove();

    // Per alcune configurazioni di grandezza testa-corpo si nota che questi due elementi tendo a sovrapporsi.
    // Per limitare tale fenomeno è stato aggiunto alla traslazione verticale un valore proporzionale alla dimensione del corpo.
    // Le teste sono state traslate verso l'alto di un valore pari al quadrato della scala del corpo
    teste.enter().append("path")
        .attr("id", function(d){
            return d[0];
        })
        .attr("class", "testa")
        .attr("d", "M -2.7 -18.2 L 0 -12.2 C -7.5 -6.2 7.5 -6.2 0 -12.2 L 2.7 -18.2 L 0 -12.2 Z")
        .attr("transform", function(d) { return "translate("+scalePositionX(d[2])+","+(scalePositionY(d[3])-Math.pow(scaleDimension(d[6]),3))+") scale("+
        	scaleDimension(d[5])+")" })  
        .attr("fill", function(d) {return getColour(d[1])})
        .attr("stroke-width", "1")
        .attr("stroke", "black")
        .attr("onclick", function(d) { return "action()"});

    teste.transition().duration(updateTime)
    .attr("transform", function(d) { return "translate("+scalePositionX(d[2])+","+(scalePositionY(d[3])-Math.pow(scaleDimension(d[6]),3))+") scale("+
    	scaleDimension(d[5])+")" })
}

// Inizializzazione
d3.json("data/dataset.json").then(function(data) {

    popolaValori(data);

    drawAxes();

    updateDraw();

}).catch(function(error) {

    console.log(error); // Some error handling here
    
});

// NOTE:
// Quando le teste risultano eccessivamente più piccole dei relativi corpi
// queste tendo a sovrapporsi ad essi. Con la scala di dimensioni utilizzata
// e l'aggiunta di una traslazione verticale pari al quadrato della scala 
// delle dimensioni, le teste sono comunque distinguibili dai corpi, ma occorrerebbe 
// implementare una funzione che gestisca in modo più preciso le traslazioni 
// delle teste per evitare tale fenomeno. Nello specifico, la funzione 
// dovrebbe tener conto delle dimensioni in pixel dei corpi, delle ali e 
// delle teste, e quindi delle reali dimensioni a fronte delle successive 
// trasformazioni. Da questi valori si dovrebbe poi ricavare la differenza 
// delle dimensioni a monte della trasformazione e ricavare poi la reale 
// traslazione da applicare ad ogni elemnto.