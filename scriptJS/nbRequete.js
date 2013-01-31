/*date exemple d1:2012-9-16 7:1:17 d2: 2012-9-16 7:1:47
Problèmes restants: 
-lag comme on fait beaucoup de requetes elle mettent du temps avant d'être traitées on a donc un décallage entre la periode indiquée par le curseur et les résultats obtenu sur le graphique. 
-Toujours à cause du grand nombre de requetes, si on click sur valider ou mettre à jour, alors qu'il y a encore des requetes rien ne se met à jour jusqu'à ce que tous les resultats soient traités.
-revoir la façon de calculer le diamètre des cercles car celui-ci ne change presque jamais
*/

var data;
var charge = 0;
var date1, date2;
                
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
        
        xhr.open('GET', 'http://localhost:8888/scriptPhp/nbRequete.php?date1='+date1+'&date2='+date2);//parametrage de la requête
        xhr.send(null);//envoi de la requete
                
        xhr.onreadystatechange = function() {
                                        if (xhr.readyState == 4 && xhr.status == 200) { //si requete terminée et ok
                                                data= JSON.parse(xhr.responseText);//transformation de la chaine en JSON
                                                graph(source, type);
                                                if((source == "valider"|| source == "updateForm") && type == "click" )// on appel affiche que quand on a détruit le curseur
                                                {
                                                	affiche();
                                                }
                                        }
                                        };
}
                        
function graph(source, type) {
                   
         if(charge == 1 && ((source == "valider"|| source == "updateForm")&& type == "click"))//si on change le formulaire on refait toutes les svg
         {
                d3.selectAll("svg").remove();
         }
         else //sinon que les cercles
         {
         	d3.select('#cercle').remove();
         }
                                 

         var data2 = [];
         var data3 = [];

         for(var i in data)
         {
                data2.push(data[i].value);
                data3.push(data[i].title);
         }
                 
         var ratio = d3.min(data2)/d3.max(data2);
                        
         var chart =  d3.select("#resultat").append("svg") //création du svg
                                            .attr("class", "chart")//ajout à la classe chart
                                            .attr("height", 200)//réglage de la largeur, 20px par bande * data.length pour connaitre le nombre de data donc de bande
                                            .attr("id", "cercle");
	var defs = chart.append("defs")
			.attr("class", "defs");
	var degrade = defs.append("radialGradient")
	  		  .attr("id", "grad1")
			  .attr("cx", "50%")
			  .attr("cy", "50%")
			  .attr("r", "50%"); 
							
	var stop1 = degrade.append("stop")
			   .attr("offset", "0%")
			   .attr("style", "stop-color:rgb(153, 205, 255);stop-opacity:1");
							
	var stop2 = degrade.append("stop")
			   .attr("offset", "100%")
			   .attr("style", "stop-color:rgb(91, 161, 218);stop-opacity:1");  

        var x = d3.scale.linear()
                        .domain([0, 100])
                        .range([2, 50]);          
        var somme = 0;
        for(var i = 0; i < data2.length; i++)
        {
        	somme = data2[i]+somme;
        }
       	if(somme == 0)
       		somme = 1;
        var dataPercent = new Array();
        for(var i = 0; i < data2.length; i++)
        {
		dataPercent[i] = (data2[i]/somme)*100;
	
        }
        chart.selectAll("circle").data(dataPercent) //ajout d'autant de cercle qu'il y a de données
                                 .enter().append("circle")
                                         .attr("cx", function(d,i) {return 50+(i* 105); })
                                         .attr("cy", 50)
                                         .attr("fill", "url(#grad1)");
                     			 if(charge != 1)
                     			 {
                     				chart.selectAll("circle").transition()
    		     			       			       .delay(10)
   		     			      			       .duration(1000)
   		     			      			       .attr("r", x);
                     			 }
               	     			 else
               	     			 {
               	     				chart.selectAll("circle").attr("r",x);
               	    			 }
                                                       
        if(ratio > 0,4)
        {
                var y = d3.scale.ordinal()
                                .domain(data2)
                                .rangeBands([1, 50]);
        }
        else
        {
                var y = d3.scale.ordinal()
                          .domain(data2)
                          .rangeBands([10,50]);
        }
        var widthCircle = (50+((data2.length-1)*105));    
        chart.selectAll("text")
             .data(data2)
             .enter().append("text")
                     .attr("x", function(d,i) { return (50+(i * 105)); });
                     if(charge != 1)
                     {
                     	chart.selectAll("text").transition()
    		     			       .delay(100)
   		     			       .duration(1100)
                     			       .attr("y", function(d, i) {return x(dataPercent[i])+70;})
                     			       .attr("text-anchor", "middle")
                     			       .text(function(d, i) { return data3[i]+':'+' '+d; });
               	     }
               	     else
               	     {
               	     	chart.selectAll("text").attr("y", function(d, i) {return x(dataPercent[i])+70;})
                     			       .attr("text-anchor", "middle")
                     			       .text(function(d, i) { return data3[i]+':'+' '+d; });
               	     }
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
                
        
        
function parse_date(str) {  //transformation date mySql en date js
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
