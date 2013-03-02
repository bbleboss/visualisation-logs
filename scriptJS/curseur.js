//----variable pour l'échelle----------

var curseurX1=0, curseurX2=parseInt(d3.select('nav').style("width"));

var jsDate1;
var jsDate2;
var millisecD1;
var millisecD2;


function affiche(){ //affichage du curseur
 

        jsDate1 = parse_date(date1);
        jsDate2 = parse_date(date2);
        millisecD1 = Date.parse(jsDate1);
        millisecD2 = Date.parse(jsDate2);
        var tmp = new Date(millisecD1);
        
        var currentLocation = document.location.href; //Permet d'obtenir l'URL actuel de la page
 		currentLocation = currentLocation.substring( currentLocation.lastIndexOf("/")+1 ,currentLocation.lastIndexOf( "#" ));
 		//Cette variable contient maintenant une chaîne du type 'error.php', 'acces.php', ...
        
        
        //Ajout du curseur et des boutons radio en fonction de la page dans laquelle on se trouve
        if(currentLocation == "error.php")
        {
        	document.getElementById('curseur').innerHTML = "<input type=\"radio\" id=\"apache\" name=\"serveur\" onclick=\"update()\" checked>Apache <input type=\"radio\" id=\"zope\" name=\"serveur\" onclick=\"update()\">Zope<br><button id=\"updateForm\">Mettre à jour le formulaire</button>Période du <input id= curDate1 name=cursDate1 type=text readonly/> au <input id= curDate2 name=cursDate2 type=text readonly/>";
        }
        else if(currentLocation == "acces.php")
        {
        	document.getElementById('curseur').innerHTML = "<input type=\"radio\" id=\"get\" name=\"serveur\" onclick=\"update()\" checked>Get (Accès externe)  <input type=\"radio\" id=\"post\" name=\"serveur\" onclick=\"update()\">Post <input type=\"radio\" id=\"head\" name=\"serveur\" onclick=\"update()\">Head  <input type=\"radio\" id=\"options\" name=\"serveur\" onclick=\"update()\">Options<br><button id=\"updateForm\">Mettre à jour le formulaire</button>Période du <input id= curDate1 name=cursDate1 type=text readonly/> au <input id= curDate2 name=cursDate2 type=text readonly/>";
        }
        else if(currentLocation == "requete.php" || currentLocation == "agent.php")
        {
        	document.getElementById('curseur').innerHTML = "<button id=\"updateForm\">Mettre à jour le formulaire</button>Période du <input id= curDate1 name=cursDate1 type=text readonly/> au <input id= curDate2 name=cursDate2 type=text readonly/>";
       	}
        
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
       							if(animation == true)
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
                
        
        
function parse_date(str, strBool) {  //transformation date mySql en date js
        var date = new Date();  
        var tiret = 0;
        while(tiret == 0)
        {
        	var anc = str;
        	str = str.replace("%3A",':');
        	str = str.replace("%20",' ');
        	if(anc == str)
        	{
        		tiret = 1;
        	}
        }
        if(strBool == true)//pour recupérer la date sous forme de string et non d'objet
        return str;

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
        dateX1.setMonth(dateX1.getMonth()-1);
        dateX2.setMonth(dateX2.getMonth()-1);
        
        dateX1 = dateX1.getFullYear()+'-'+parseInt(dateX1.getMonth()+1)+'-'+dateX1.getDate()+' '+dateX1.getHours()+':'+dateX1.getMinutes()+':'+dateX1.getSeconds();
        dateX2 = dateX2.getFullYear()+'-'+parseInt(dateX2.getMonth()+1)+'-'+dateX2.getDate()+' '+dateX2.getHours()+':'+dateX2.getMinutes()+':'+dateX2.getSeconds();
        
       
        document.getElementById("curDate1").value = dateX1;
        document.getElementById("curDate2").value = dateX2;

}
