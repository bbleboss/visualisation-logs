/*date exemple d1:2012-9-16 7:1:17 d2: 2012-9-16 7:1:47

*/
var data;
var charge = 0;
var date1, date2;
var scriptPhp = "basePhp.php";         
var id;
var animation = false;
var moitie = parseInt(d3.select('nav').style("width"))/2;
var dateTrue;

window.onload = update;
function update()//fonction appelée lors du click sur valider
{
	var source = event.target.id;//quel objet a appelé
	var type = event.type;//pour pouvoir vérifier qu'on a bien clické et pas juste passé la souris sur le bouton 
	var autoLoad = event.target;//pour valider le formulaire au chargement de la page
	if(source == "apache" || source == "zope" || autoLoad == "[object HTMLDocument]")
	{
		if(source == "apache")
		{
			scriptPhp = "basePhp.php";
		}
		else if(source == "zope")
		{
			scriptPhp = "zopeError.php";
		}
	} 
	
        var xhr = new XMLHttpRequest();//création de la requête
        if(((source == "valider" || source == "updateForm") && type == "click")|| autoLoad == "[object HTMLDocument]")
        {
        	dateTrue = true;
        	var verifDate = /^[ ]*[0-9]{4}-((0[1-9]|[1-9])|1[0-2])-([1-9]|[0-3][0-9])[ ]*($|[ ]+([0-9]|[0-1][0-9]|2[0-3])[ ]*($|:([0-9]|[0-5][0-9])[ ]*($|:([0-9]|[0-5][0-9])[ ]*$)))/; 
        	date1 = document.getElementById('date1').value;
        	date2 = document.getElementById('date2').value;
        	
        	if(!verifDate.exec(date1) || !verifDate.exec(date2))
        	{
        		if(date1.length > 0 || date2.length >0)
        		{
        			alert('Vous devez respecter la syntaxe: YYY-MM-DD HH:MM:SS');
        		}
        		dateTrue = false;
        	}
        }
        else //cas où on bouge le curseur
        {
        	date1 = document.getElementById('curDate1').value;
        	date2 = document.getElementById('curDate2').value;
        }
        
  
  	if(dateTrue == true)
  	{
  		if(date1 > date2)
  		{
  			var tmp = date1;
  			date1 = date2;
  			date2 = tmp;
  			document.getElementById('date1').value = date1;
  			document.getElementById('date2').value =date2;
  		}
  			
	  	//Affichage de l'animation de chargement
		document.getElementById('chargement').innerHTML = "Chargement en cours, veuillez patienter ... </br> <img src=\"http://localhost:8888/gif/loading.gif\" />";
		
		var resultat = document.getElementById('resultat');
		date1 =encodeURIComponent(date1);
		date2 = encodeURIComponent(date2);
	       	
		xhr.open('GET', 'http://localhost:8888/scriptPhp/'+scriptPhp+'?date1='+date1+'&date2='+date2);//parametrage de la requête
		xhr.send(null);//envoi de la requete
		        
		xhr.onreadystatechange = function() {
		                                if (xhr.readyState == 4 && xhr.status == 200) { //si requete terminée et ok
		                                        data= JSON.parse(xhr.responseText);//transformation de la chaine en JSON
		                                        graph(source, type);
		                                        
		                                        //On supprime l'animation de chargement
		                                        document.getElementById('chargement').innerHTML= "";
		                                        
		                                        if(((source == "valider"|| source == "updateForm") && type == "click") || autoLoad == "[object HTMLDocument]")// on appel affiche que quand on a détruit le curseur
		                                        {
		                                        	affiche();
		                                        }
		                                }
		                                };
	}
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
        var moitieCercle = ((data2.length*105)+50)/2;
        chart.selectAll("circle").data(dataPercent) //ajout d'autant de cercle qu'il y a de données
                                 .enter().append("circle")
                                         .attr("cx", function(d,i) {return moitie+50+(i* 105)-moitieCercle; })
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
                     .attr("x", function(d,i) {return moitie+50+(i* 105)-moitieCercle;});
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
                        

