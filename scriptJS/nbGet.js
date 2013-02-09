/*
/ Variables nécessaires au fonctionnement général du script
*/
var data;
var charge = 0;
var date1, date2;
var acces = new Array;
var tranches_horaires = new Array;

var id;
var animation = false;

//----variable pour l'échelle----------

var curseurX1=0, curseurX2=parseInt(d3.select('nav').style("width"));
var jsDate1;
var jsDate2;
var millisecD1;
var millisecD2;

function update()//fonction appelée lors du click sur valider
{
		var source = event.target.id;//quel objet a appelé
		var type = event.type;//pour pouvoir vérifier qu'on a bien clické et pas juste passé la souris sur le bouton
		initTranches(); //Initialisation du tableau de tranches horaires, nécessaire pour le svg en graphique
		
        var xhr = new XMLHttpRequest();//création de la requête
        if((source == "valider" || source == "updateForm") && type == "click")//dans le cas où on change les dates du formulaire
        {
        	date1 = document.getElementById('date1').value;
        	date2 = document.getElementById('date2').value;
        }
        else //cas où on bouge le curseur
        {
        	date1 = document.getElementById('curDate1').value;
        	date2 = document.getElementById('curDate2').value;
        }
        
        
        var resultat = document.getElementById('resultat');
        date1 =encodeURIComponent(date1);
        date2 = encodeURIComponent(date2);
        
        xhr.open('GET', 'http://localhost:8888/scriptPhp/nbGet.php?date1='+date1+'&date2='+date2);//parametrage de la requête
        xhr.send(null);//envoi de la requete
        xhr.onreadystatechange = function() {
                                        		if (xhr.readyState == 4 && xhr.status == 200) { //si requete terminée et ok
                                                	data= JSON.parse(xhr.responseText);//transformation de la chaine en JSON
                                                	
                                                	parse_tab();

                                                	percentage();
                                                	
                                                	
                                                	
                                                	graph(source, type);
                                                	if((source == "valider"|| source == "updateForm") && type == "click" )// on appel affiche que quand on a détruit le curseur
                                                	{
                                                		affiche();
                                                	}
                                        		}
                                        	};
}



// Affichage du graphique                       
function graph(source, type) {
                         
	if(charge == 1 && ((source == "valider"|| source == "updateForm")&& type == "click"))//si on change le formulaire on refait toutes les svg
	{
        d3.selectAll("svg").remove();
    }
	else //sinon que les cercles
    {
    	d3.select('#barre').remove();
	}
    
              
                  
    var margin = {top: 20, right: 20, bottom: 30, left: 100},
   		width = 1200 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom;

	var formatPercent = d3.format(".0%");

	var x = d3.scale.ordinal()
    	.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
    	.range([height, 0]);

	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");

	var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left")
    	.tickFormat(formatPercent);               

    var svg = d3.select("#resultat").append("svg") //création du svg
    	.attr("width", 1090) //largeur du svg
    	.attr("height", height + margin.top + margin.bottom) //hauteur du svg
    	.attr("id", "barre")
  	.append("g")
   		.attr("transform", "translate(" + 30 + "," + margin.top + ")");    
   			
   	x.domain(tranches_horaires.map(function(d) { return d; })); //Determine toutes les valeurs qui seront présentes en abscisse sur notre graphique
  	y.domain([0, d3.max(acces)]); //Determine toutes les valeurs qui seront présentes en ordonnées sur notre graphique

  	svg.append("g")
    	.attr("class", "x axis")
      	.attr("transform", "translate(0," + height + ")")
     	.call(xAxis); // On ajoute l'axe des abscisses au svg

  	svg.append("g")
      	.attr("class", "y axis")
      	.call(yAxis) // On ajoute l'axe des ordonnées au svg
    .append("text") // On ajoute une légende à l'axe des ordonnées
    	.attr("transform", "rotate(-90)")
      	.attr("y", 6)
      	.attr("dy", ".71em")
      	.style("text-anchor", "end")
      	.text("Frequency");
     	
  	svg.selectAll(".bar")
    	.data(acces)
    .enter().append("rect")
      	.attr("class", "bar")
     	.attr("x", function(tranches_horaires, d) { return x(d); })
     	.attr("width", x.rangeBand())
      	.attr("y", function(d) { return y(d); })
      	.attr("height", function(d) { return height - y(d); })
      	      	.attr("fill", function(d) {
    		return "rgb(0, 0, " + (d * 1000) + ")";
		});
      	
    charge = 1;
}

function affiche(){ //affichage du curseur

        
        jsDate1 = parse_date(date1);
        jsDate2 = parse_date(date2);
        millisecD1 = Date.parse(jsDate1);
        millisecD2 = Date.parse(jsDate2);
        
        document.getElementById('curseur').innerHTML = "<button id=\"updateForm\">Mettre à jour le formulaire</button>Période du <input id= curDate1 name=cursDate1 type=text readonly/> au <input id= curDate2 name=cursDate2 type=text readonly/>";
        document.getElementById('updateForm').onclick = function(){
        								d1 = document.getElementById('date1');
                        						d2 = document.getElementById('date2');
                        						d1.value = document.getElementById('curDate1').value;
                        						d2.value = document.getElementById('curDate2').value;
                        						update();
                        					  }
        
        var curseur= d3.select("#curseur").append("svg")
                                          .attr("class", "chart")
                                          .attr("height", 60)
                                          .attr("width", curseurX2);
      
        curseur.append("line")
               .attr("x1", curseurX1)
               .attr("x2", curseurX2)
               .attr("y1", 30)
               .attr("y2", 30)
               .style("stroke", "black")
               .style("stroke-width", 4);
        curseur.append("rect")
               .attr("width", 10)
               .attr("height", 20)
               .attr("x", curseurX1)   
               .attr("y",8)
               .attr("id","x1Date")
               .style("fill","grey" )
               .on("mousedown", function (){
               					id=this; 
               					animation = true;
               					updateCurseur();
               				   });
        curseur.append("rect")
               .attr("width", 10)
               .attr("height", 20)
               .attr("x", (curseurX2-10))
               .attr("y",8)
               .style("fill","grey" )
               .attr("id","x2Date")
               .on("mousedown", function (){
               					id=this;
               				    	animation = true;
               				    	updateCurseur();
               				    });

        curseur.append("rect")
               .attr("width",ecartDate())
               .attr("height",18)
               .attr("x", posX1Date()+10)
               .attr("y", 10)
               .attr("id","zoneDate")
               .style("opacity", 0.7);
               
       d3.select("body").on("mousemove", updateCurseur);
       d3.select("body").on("mouseup", function(){
                        				update();
                        				animation = false;
                        				d1 = document.getElementById('date1');
                        				d2 = document.getElementById('date2');
                        				updateUrl(d1, d2);
                        				
                        			 });

}

function initTranches()
{
	tranches_horaires[0] = '00-01';
	tranches_horaires[1] = '01-02';
	tranches_horaires[2] = '02-03';
	tranches_horaires[3] = '03-04';
	tranches_horaires[4] = '04-05';
	tranches_horaires[5] = '05-06';
	tranches_horaires[6] = '06-07';
	tranches_horaires[7] = '07-08';
	tranches_horaires[8] = '08-09';
	tranches_horaires[9] = '09-10';
	tranches_horaires[10] = '10-11';
	tranches_horaires[11] = '11-12';
	tranches_horaires[12] = '12-13';
	tranches_horaires[13] = '13-14';
	tranches_horaires[14] = '14-15';
	tranches_horaires[15] = '15-16';
	tranches_horaires[16] = '16-17';
	tranches_horaires[17] = '17-18';
	tranches_horaires[18] = '18-19';
	tranches_horaires[19] = '19-20';
	tranches_horaires[20] = '20-21';
	tranches_horaires[21] = '21-22';
	tranches_horaires[22] = '22-23';
	tranches_horaires[23] = '23-00';
}
	
//Cette Fonction permet de répartir les accès répertoriés dans un tableau de tranches horaires
function parse_tab()
{

	var comp;

	for(var i=0 ; i < 24 ; i++)
	{
		acces[i] = 0;
	}
	
	for(var i in data)
	{
		comp = parse_date(data[i].ltime)

		var hour = comp.getHours()
		acces[hour] += 1; 
	}
}


//Permet d'adapter le tableau d'horaires en pourcentage sans décimal
function percentage()
{
	var total = data.length;
	
	for(var i=0; i<acces.length ; i++)
	{	
		acces[i] = Math.round(((acces[i]*100)/total)*10)/1000;
		/*
		/exemple : si la totalité des accès ont lieu entre 6h et 7h, acces[6] vaudra 1 (100%)
		*/
	}
}


//permet de passer d'un format de date MySql à un format de date Javascript    
function parse_date(str) 
{  
        var date = new Date();  
        var tiret = 0;
        while(tiret == 0)
        {
        	var anc = str;
        	str = str.replace("%3A",':');
        	str = str.replace("%20",':');
        	if(anc == str)
        	{
        		tiret = 1;
        	}
        }

        var parts = str.split(/[- :]/);  

        date.setFullYear(parts[0] || 0);  
        date.setMonth(parts[1] || 0);  
        date.setDate(parts[2] || 0);  
        date.setHours(parts[3] || 0);  
        date.setMinutes(parts[4] || 0);  
        date.setSeconds(parts[5] || 0);  
        date.setMilliseconds(0);  
        
        return date; 
} 


function ecartDate(){ //calcul de la longueur de la zone séléctionnée
        var ecart = parseInt(d3.select("#x2Date").attr("x")) - (parseInt(d3.select("#x1Date").attr("x"))+10);
        if(ecart < 0)//si l'écart est négatif cela veut dire que le rectangle xDate2 est à gauche de xDate1 on échange les id pour les remettre dans le bon ordre
        {
                d3.select("#x2Date").attr("id","tmp");
                d3.select("#x1Date").attr("id","x2Date");
                d3.select("#tmp").attr("id","x1Date");
        }
        ecart = parseInt(d3.select("#x2Date").attr("x")) - (parseInt(d3.select("#x1Date").attr("x"))+10);
        if(ecart < 0)
        {
        	return 0;
        }
        
        return ecart;
                
}
                
function posX1Date(){
   return parseInt(d3.select("#x1Date").attr("x"));
}
                
function animate(){ //animation du curseur
        
       if(animation)
        {       
               var posX = window.event.clientX-parseInt(d3.select("#curseur").style("margin-left"))-10;
               if(posX > curseurX1 && posX < curseurX2-10)
               {
                        d3.select(id).attr("x", posX);
               }
               else if(posX < curseurX1)
               {
                        d3.select(id).attr("x", curseurX1);
               } 
               else
               {
                        d3.select(id).attr("x", curseurX2-10);
               }
               color(id);
        }
} 

function color(id) // coloration de la zone séléctionnée du curseur 
{
        xClick = parseInt(d3.select(id).attr("x"));
        x1Date = parseInt(d3.select("#x1Date").attr("x"));
        x2Date = parseInt(d3.select("#x2Date").attr("x"));
        if(xClick == x1Date || xClick == x2Date)
        {
                d3.select("#zoneDate").attr("x", posX1Date()+10)
                                      .attr("width", ecartDate());
        }
}
        
function diffdate(d1, d2) { //différence entre deux dates en nombre de jours
        var WNbJours = d2.getTime() - d1.getTime();
        return Math.ceil(WNbJours/(1000*60*60*24));
}

function echelleTemps(nb)//echelle du curseur
{
	var echelle = d3.scale.linear()
                        .domain([curseurX1, curseurX2])
                        .range([millisecD1, millisecD2]);
        
        return echelle(nb);
}

function updateCurseur()//mise à jour des dates
{
	animate();
	var x2 = parseInt(d3.select("#x2Date").attr("x")) +10;
	x2 = echelleTemps(x2);
        var x1 = parseInt(d3.select("#x1Date").attr("x"));
        x1 =echelleTemps(x1);
        var dateX1 = new Date(x1);
        var dateX2 = new Date(x2);
        
        dateX1 = dateX1.getFullYear()+'-'+dateX1.getMonth()+'-'+dateX1.getDate()+' '+dateX1.getHours()+':'+dateX1.getMinutes()+':'+dateX1.getSeconds();
        dateX2 = dateX2.getFullYear()+'-'+dateX2.getMonth()+'-'+dateX2.getDate()+' '+dateX2.getHours()+':'+dateX2.getMinutes()+':'+dateX2.getSeconds();
        
       
        document.getElementById("curDate1").value = dateX1;
        document.getElementById("curDate2").value = dateX2;

}




















