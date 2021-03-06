<!DOCTYPE html>

<html>
	<head>
		<title>Nombre d'erreurs en fonction d'une période</title>
		<meta http-equiv="content-type" content="text/html" charset=utf-8" />
		<script type="text/javascript" src="/d3/d3.js"></script>
	</head>
	
	<body>
		<style type="text/css">
			.chart rect {
			   stroke: white;
			   fill: steelblue;
			 }
		</style>
		<h1>Récupération du nombre d'erreurs selon une période via un script php</h1>
		
		Rentrez la date sous la forme YYY-MM-DD</br>
		Date1: <input id= date1 name=date1 type=text /></br>
		Date2: <input id= date2 name=date2 type= text /></br>
		<input id= valider type=button value=Valider onclick="update()" />
		<div id=resultat></div>
	
		<script>
			var data;
			var charge = 0;
			
			function update()//fonction appelée lors du click sur valider
			{
				var xhr = new XMLHttpRequest();//création de la requête
				var date1 = document.getElementById('date1').value;
				var date2 = document.getElementById('date2').value;
				var resultat = document.getElementById('resultat');
				date1 =encodeURIComponent(date1);
				date2 = encodeURIComponent(date2);
			
				xhr.open('GET', 'http://projettuteure.fr/scriptPhp/basePhp.php?date1='+date1+'&date2='+date2);//parametrage de la requête
				xhr.send(null);//envoi de la requete
				
				xhr.onreadystatechange = function() {
    					if (xhr.readyState == 4 && xhr.status == 200) { //si requete terminée et ok
    						data= JSON.parse(xhr.responseText);//transformation de la chaine en JSON
    						graph();
    					}
				};
			}
			
			function graph() {
				 
				 if(charge == 1)
				 {
				 	d3.select('svg').remove();
				 }
				 

				 var data2 = [];
				 var data3 = [];
				 for(var i in data)
				 {
				 	data2.push(data[i].value);
				 	data3.push(data[i].title);
				 }
				
				 charge = 1;
				 var chart = d3.select("div").append("svg") //création du svg
						    	     .attr("class", "chart")//ajout à la classe chart
						     	     .attr("width", 420)//réglage de la longueur du svg
						     	     .attr("height", 20 * data2.length);//réglage de la largeur, 20px par bande * data.length pour connaitre le nombre de data donc de bande
				var x = d3.scale.linear()
			     	  	  .domain([0, d3.max(data2)])
    				  	  .range([0, 420]);
    				  
    				chart.selectAll("rect").data(data2) //ajout d'autant de rect qu'il y a de données
   					       	       .enter().append("rect")
    					       	       .attr("y", function(d,o) { return o * 20; })
     					       	       .attr("width", x)
     					       	       .attr("height", 20);
     			 	var y = d3.scale.ordinal()
				         	.domain(data2)
				         	.rangeBands([0, 20* data2.length]);
				
     				chart.selectAll("text")
     			     	     .data(data2)
   			     	     .enter().append("text")
     			    	     .attr("x",x)
     			     	     .attr("y", function(d) {return y(d) + y.rangeBand() / 2; })
     			     	     .attr("dx", -3) // padding-right
     			     	     .attr("dy", ".35em") // vertical-align: middle
     			     	     //	.attr("text-anchor", "end") // text-align: right
     			     	     .text(function(d, i) { return data3[i]+':'+' '+d; });
     			
    			}
			
			
		</script>
	</body>
</html>
