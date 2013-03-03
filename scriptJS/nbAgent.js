var date1, date2, nbvisite, dataj;
var charge = 0;
var table = "apache_access_log";


function update()//fonction appelée lors du click sur valider
{
		var source = event.target.id;//quel objet a appelé
		var type = event.type;//pour pouvoir vérifier qu'on a bien clické et pas juste passé la souris sur le bouton 
		
		 if(source == "apache" || source == "zope")
		{
			if(source == "apache")
			{
			table = "apache_access_log";
			}
			else
			{
			table = "zope_instance_z2_log";
			}
		}
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
        	nbvisite = document.getElementById('nbvisite').value;
        
  
        var resultat = document.getElementById('resultat');
        var legende = document.getElementById('legende');
        date1 =encodeURIComponent(date1);
        date2 = encodeURIComponent(date2);
        
        xhr.open('GET', 'http://localhost:8888/scriptPhp/nbAgent.php?date1='+date1+'&date2='+date2+'&nbvisite='+nbvisite+'&table='+table);//parametrage de la requête
        xhr.send(null);//envoi de la requete          
        xhr.onreadystatechange = function() {
                                       			if (xhr.readyState == 4 && xhr.status == 200) { //si requete terminée et ok
                                                	dataj= JSON.parse(xhr.responseText);//transformation de la chaine en JSON
                                                	graph();
                                                	//alert('2ème étape de test - premiere date enregistrée') ;
                                        			if((source == "valider"|| source == "updateForm") && type == "click" )// on appel affiche que quand on a détruit le curseur
                                                	{
                                                		affiche();
                                                	}
                                                }
                                        	};
}


function graph() {
     
    //var dataAgent = [];
	//var dataValue = []; 
	var width = 960;
    var height = 500;
    var heightLegende = 50;
    var radius = Math.min(width, height) / 2;
    var ylegende= 15;
	     
    if(charge == 1)
    {
        d3.select("#camembert").remove();
        d3.select("#svglegende").remove();
    }
	
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
    	.attr("id", "camembert")
    	.append("g")
    	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    	
			var g = svg.selectAll(".arc")
      		.data(pie(dataj))
    		.enter().append("g")
      		.attr("class", "arc");

  			g.append("path")
      		.attr("d", arc)
      		.style("fill", function(d) { return color(d.value); });
      		
      		g.append("text") // le texte ne fonctionne pas encore
      		 .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      		.attr("dy", ".35em")
      		.style("text-anchor", "middle")
      		.text(function(d) { return d.value; }); 
      		
// -------------creation de la legende---------//

			var svglegende = d3.select("#legende").append("svg") //création du svg
    		.attr("width", 1200) //largeur du svg
    		.attr("id", "svglegende")
  			
  			var g2 = svglegende.selectAll(".agent")
      		.data(dataj)
    		.enter().append("g")
      		.attr("class", "agent");
      		
      		g2.append("text")
				.attr("x","30") 
				.attr("y",function(){ ylegende= ylegende +15; return ylegende})
      		.text(function(d) { return d.agent; });
      		var ylegende=0;
      		g2.append("rect")
      		.attr("width", "20") //largeur du svg
    	.attr("height", "15")
    	.attr("y",function(){ ylegende= ylegende +15; return ylegende})
  			.style("fill", function(d) { return color(d.value); });
      		
      		svglegende.attr("height", function(){ heightLegende= heightLegende + ylegende ; return heightLegende}) ; // longueur du svg
      		
charge =1;
}