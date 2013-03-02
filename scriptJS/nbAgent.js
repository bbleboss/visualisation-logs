var date1, date2, nbvisite, dataj;
var charge = 0;

  var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

function update()//fonction appelée lors du click sur valider
{
        var xhr = new XMLHttpRequest();//création de la requête
        
        	date1 = document.getElementById('date1').value;
        	date2 = document.getElementById('date2').value;
        	nbvisite = document.getElementById('nbvisite').value;
        
  
        var resultat = document.getElementById('resultat');
        var legende = document.getElementById('legende');
        date1 =encodeURIComponent(date1);
        date2 = encodeURIComponent(date2);
        
        xhr.open('GET', 'http://localhost:8888/scriptPhp/nbAgent.php?date1='+date1+'&date2='+date2+'&nbvisite='+nbvisite);//parametrage de la requête
        xhr.send(null);//envoi de la requete          
        xhr.onreadystatechange = function() {
                                       			if (xhr.readyState == 4 && xhr.status == 200) { //si requete terminée et ok
                                                	dataj= JSON.parse(xhr.responseText);//transformation de la chaine en JSON
                                                	graph();
                                                	alert('2ème étape de test - premiere date enregistrée') ;
                                        		}
                                        	};
}


function graph() {
     
    //var dataAgent = [];
	//var dataValue = []; 
	var width = 960;
    var height = 500;
    var radius = Math.min(width, height) / 2;
	     
    if(charge == 1)
    {
        d3.selectAll("svg").remove();
    }
    //alert('2ère étape de test - premiere date enregistrée') ;

	/*for(var i in dataj)
	{
		dataAgent.push(dataj[i].agent);
		//dataValue.push(dataj[i].value);
	}
	
	for(var i in dataAgent)
	{
		alert('agent '+i+' : ' +dataAgent[i]);
		alert('valeur '+i+' : ' +dataValue[i]);
	}*/ 
	
	// -------------creation du cercle ---------//
	
   var color = d3.scale.category20c() // limité au nombre de couleur dans le range 
    //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    //.rangeRoundBands(["#000000", "#FFFFFF"], "#303030");

	var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(0);

	var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });	
    
	 var svg = d3.select("#resultat").append("svg") //création du svg
    	.attr("width", width) //largeur du svg
    	.attr("height", height) //hauteur du svg
    	.append("g")
    	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    	
			var g = svg.selectAll(".arc")
      		.data(pie(dataj))
    		.enter().append("g")
      		.attr("class", "arc");

  			g.append("path")
      		.attr("d", arc)
      		.style("fill", function(d) { return color(d.value); });
      		
// -------------creation de la legende---------//

			var svglegende = d3.select("#legende").append("svg") //création du svg
    		.attr("width", width) //largeur du svg
    		.attr("height", height) //hauteur du svg
  			
  			g.append("text") // le texte ne fonctionne pas encore
      		.attr("dy", ".35em")
      		.style("text-anchor", "middle")
      		.text(function(d) { return d.agent; }); 
      		
      		
charge =1;
}