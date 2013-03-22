var data;
var charge = 0;
var d1, d2, oldD1, oldD2;
var acces = new Array();
var tranches_horaires = new Array;
var premierPlan = 0;

function popUp(id, statut){
    
    if(premierPlan == 0)//on ouvre un popup à la fois
    {
    	    premierPlan = 1;
    	    var htmlElement = document.getElementsByTagName('html')[0]; //empêche le scroll, permet d'être sur que l'utilisateur cliquera pas sur un bouton de l'interface pendant qu'il consulte le popup
	    htmlElement.style.overflow = 'hidden';
	    var popup = document.createElement('div');
	    popup.className = 'popup';
	    popup.id = 'popup';
	    var cancel = document.createElement('div');
	    cancel.innerHTML = 'fermer';
	    cancel.setAttribute("style", "color:white;cursor:pointer;");
	    cancel.onclick = function (e) { htmlElement.style.overflow = 'visible';premierPlan = 0; popup.parentNode.removeChild(popup); };
	    var message = document.createElement('div');
	    message.id = 'info';
	    message.setAttribute("style", "color:white;text-align:center;font-size:20px;");                                   
	    popup.appendChild(cancel);
	    popup.appendChild(message);
	    document.body.appendChild(popup);
	
	    popup.setAttribute("style", "position:fixed;background-color: black; opacity:0.8; top:"+((screen.height/2)-320)+"px;left:"+((screen.width/2)-500)+"px;");
	    
	    var i =0;
	    while( i < 3)
	    {
	       	date1 = date1.replace("%3A",':');
	       	date1 = date1.replace("%20",' ');
	       	date2 = date2.replace("%3A",':');
	       	date2 = date2.replace("%20",' ');
	       	i++;   	
	    }
	    if(statut == "agent")
	    {
			elemexame = dataj[id-1].agent;
	    }
	    else if(statut == "statut")
	    {
			elemexame = dataj[id-1].statut;
	    }
	    else if(statut == "host")
	    {
			elemexame = dataj[id-1].host;
	    }
	    else if(statut == "requete")
	    {
			elemexame = dataj[id-1].requete;
	    }
	    else if(statut == "erreur")
	    {
			elemexame = dataj[id-1].description;
	    }
	    temporel(elemexame, table, date1, date2, statut);
    }
}

function temporel(elemexame, table, date1, date2, indicateur){

	
	// on récupere l'élément à examiner et la table dans l'url ainsi qu'un indicateur nous permettant de savoir quelle page a envoyé  

	var elem = elemexame;

	var tab = table;

	var indic = indicateur;

	d1 = date1;
	d2 = date2;

	var info = document.getElementById('info');
	info.innerHTML="Repartition dans le temps de " +elem;  
	elem =encodeURIComponent(elem);
	if(indic == "agent")
	{
		var scriptPhp = "agentTemps.php?elemexame="+elem+"&table="+tab;
	}
	else if(indic == "statut")
	{
		var scriptPhp = "statutTemps.php?elemexame="+elem+"&table="+tab;
	}
	else if(indic == "host")
	{
		var scriptPhp = "hostTemps.php?elemexame="+elem+"&table="+tab;
	}
	else if(indic == "requete")
	{
		var scriptPhp = "requeteTemps.php?elemexame="+elem+"&table="+tab;
	}
	else if(indic == "erreur")
	{
		var scriptPhp = "erreurTemps.php?elemexame="+elem+"&table="+tab;
	}
		
	initTranches(); //Initialisation du tableau de tranches horaires, nécessaire pour le svg en graphique 
		
        var xhr = new XMLHttpRequest();//création de la requête
        
	var popup = document.getElementById('popup');
	d1 =encodeURIComponent(d1);
	d2 = encodeURIComponent(d2);

	document.getElementById('chargement').innerHTML = "Chargement en cours, veuillez patienter ... </br> <img src=\"http://localhost:8888/gif/loading.gif\" />";	
	xhr.open('GET', 'http://localhost:8888/scriptPhp/'+scriptPhp+'&date1='+d1+'&date2='+d2);//parametrage de la requête
	xhr.send(null);//envoi de la requete
	xhr.onreadystatechange = function() {
		                            	if (xhr.readyState == 4 && xhr.status == 200) { //si requete terminée et ok
		                                        	
		                                data= JSON.parse(xhr.responseText);//transformation de la chaine en JSON
		                                      	
		                                parse_tab();
		                                document.getElementById('chargement').innerHTML = "";
		                                graphTemp(); //Affichage du graphique
						}
	}

}
// Affichage du graphique                       
function graphTemp() {
                       
              
                  
    var margin = {top: 50, right: 50, bottom: 30, left: 200},
   		width = 1200 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom;

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
    	//.tickValues([1, 2, 3, 5, 8, 13, 21]);              

    var svg = d3.select("#popup").append("svg") //création du svg
    	.attr("width", 1000) //largeur du svg
    	.attr("height", height + margin.top + margin.bottom) //hauteur du svg
    	.attr("id", "barre")
  	.append("g")
  	.style("fill", "white")
   	.attr("transform", "translate(" + 40+ "," + margin.top + ")");    
   		
   	x.domain(tranches_horaires.map(function(d) { return d; })); //Determine toutes les valeurs qui seront présentes en abscisse sur notre graphique
   		
  	y.domain([0, d3.max(acces)]); //Determine toutes les valeurs qui seront présentes en ordonnées sur notre graphique

  	svg.append("g")
    	.attr("class", "x axis")
      	.attr("transform", "translate(0," + height + ")")
      	.style("fill", "white")
     	.call(xAxis); // On ajoute l'axe des abscisses au svg

  	svg.append("g")
      	.attr("class", "y axis")
      	.call(yAxis) // On ajoute l'axe des ordonnées au svg
    .append("text") // On ajoute une légende à l'axe des ordonnées
    	.attr("transform", "rotate(-90)")
      	.attr("y", 6)
      	.attr("dy", ".71em")
      	.style("text-anchor", "end")
      	.style("fill", "white")
      	.text("Quantité");
     	
    	
    	svg.selectAll("rect") //on met les rect, 2 par svg
    	     .data(acces)
    	     .enter().append("rect")
    	     .attr("class", "bar")
     	     .attr("width", x.rangeBand())
     	     .attr("x", function(d){return x(d);})
      	     .attr("fill", "rgb(51, 153, 193)")
     	     .transition()
    	     .delay(100)
   	     .duration(1000)
   	     .attr("height", function(d) { return height - y(d); })
      	     .attr("y", function(d) { return y(d); });
      	     
      	
      	//legende
      	svg.append("rect")
           .attr("x",0)
           .attr("y",-50)
           .attr("width", 20)
           .attr("height", 20)
           .attr("fill", "rgb(51, 153, 193)");
       
       svg.append("text")
           .attr("x",25)
           .attr("y",-35) 
           .text("Du "+parse_date(date1, true)+" au "+parse_date(date2, true))
           .style("fill", "white");
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

	
	for(var i = 0; i < 24; i++)
	{
		acces[i] = 0;
	}
		
	
	
	for(var i in data)//on update les nouvelles
	{
		comp = parse_date(data[i].ltime)

		var hour = comp.getHours()
		acces[hour] += 1; 
	}
}

