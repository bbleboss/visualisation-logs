var date1, date2, taillesum,trie, dataj;
var charge = 0;
var table = "apache_access_log";
var animation = false;
var dateTrue;

window.onload = update;
 
function update()//fonction appelée lors du click sur valider
{
		var source = event.target.id;//quel objet a appelé
		var type = event.type;//pour pouvoir vérifier qu'on a bien clické et pas juste passé la souris sur le bouton 
		var autoLoad = event.target;
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
        if(((source == "valider" || source == "updateForm") && type == "click")|| autoLoad == "[object HTMLDocument]")//dans le cas où on change les dates du formulaire
        {
        	dateTrue = true;
        	var verifDate = /^[0-9]{4}-(0[1-9]|1[0-2])-[0-3][0-9][ ]*($|[ ]+([0-1][0-9]|2[0-3])[ ]*($|:[0-5][0-9]($|:[0-5][0-9]$)))/; 
        	date1 = document.getElementById('date1').value;
        	date2 = document.getElementById('date2').value;
        	if(!verifDate.exec(date1) || !verifDate.exec(date2))
        	{
        		alert('Vous devez respecter la syntaxe: YYY-MM-DD HH:MM:SS');
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
		taillesum = document.getElementById('taillesum').value;
		trie = document.getElementById('trie').value;
		
		var resultat = document.getElementById('resultat');
		var legende = document.getElementById('legende');
		document.getElementById('information').innerHTML="<br><br>";
		date1 =encodeURIComponent(date1);
		date2 = encodeURIComponent(date2);
		
		document.getElementById('chargement').innerHTML = "Chargement en cours, veuillez patienter ... </br> <img src=\"http://localhost:8888/gif/loading.gif\" />";
		xhr.open('GET', 'http://localhost:8888/scriptPhp/tailleDonnee.php?date1='+date1+'&date2='+date2+'&taillesum='+taillesum+'&trie='+trie+'&table='+table);//parametrage de la requête
		xhr.send(null);//envoi de la requete          
		xhr.onreadystatechange = function() {
		                               			if (xhr.readyState == 4 && xhr.status == 200) { //si requete terminée et ok
		                                        	dataj= JSON.parse(xhr.responseText);//transformation de la chaine en JSON
		                                        	graph();
		                                        	//On supprime l'animation de chargement
		                                        	document.getElementById('chargement').innerHTML = "";
		                                        	
		                                		if(((source == "valider"|| source == "updateForm") && type == "click" )|| autoLoad == "[object HTMLDocument]")// on appel affiche que quand on a détruit le curseur
		                                        	{
		                                        		affiche();
		                                        	}
		                                        }
		                                	};
	}
}

function graph() {
     
    var width = 960;
    var height = 500;
    var heightLegende = 50;
    var radius = Math.min(width, height) / 2;
    var ylegende= 20;
    var nb =0;
   var text;
	     
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
      		.attr("class", "arc")
      		.attr("id", function(){ nb++; text = "info("+nb+")";return nb;})
      		.attr("onmouseout", "infovide()");// fonctionne pas encore 
      		
      		var i;
      		var nbmax =nb;
      		nb=0;
      		while (nb< nbmax)
      		{
      			nb++; 
      			text = "info("+nb+")";
      			i = document.getElementById(nb);
      			i.setAttribute("onmouseover",text);
      		}

  			g.append("path")
  			.attr("d", 0) 
  			.style("fill", "white")
  			.transition()
   	     .duration(2500)
      		.attr("d", arc)
      		.style("fill", function(d) { return color(d.value); })
      		
      		
      		
 
      		/*g.append("text") // le texte ne fonctionne pas encore
      		 .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      		.attr("dy", ".35em")
      		.style("text-anchor", "middle")
      		.text(function(d) { return d.value; }); */
      		
// -------------creation de la legende---------//

			var svglegende = d3.select("#legende").append("svg") //création du svg
    		.attr("width", 1200) //largeur du svg
    		.attr("id", "svglegende")
    		
    		var nomColonne = svglegende.append("g")
      		.attr("class", "nom");
      		nomColonne.append("text")
				.attr("x","35") 
				.attr("y","15")
      		.text("Taille Totale");
      		
      		nomColonne.append("text")
				.attr("x","170") 
				.attr("y","15")
      		.text("Nb requetes");
      		
      		nomColonne.append("text")
				.attr("x","300") 
				.attr("y","15")
      		.text("Nom des serveurs");
  			
  			var g2 = svglegende.selectAll(".host")
      		.data(dataj)
    		.enter().append("g")
      		.attr("class", "host");
      		
      		// nb requete
      		g2.append("text")
				.attr("x","170") 
				.attr("y",function(){ ylegende= ylegende +15; return ylegende})
      		.text(function(d) { return d.nbrequete; });
      		var ylegende=20;
      		
      		// nom des serveurs
      		g2.append("text")
				.attr("x","300") 
				.attr("y",function(){ ylegende= ylegende +15; return ylegende})
      		.text(function(d) { return d.host; });
      		var ylegende=6;
      		
      		// rectangles des legendes
      		g2.append("rect")
      		.attr("width", "20") //largeur du svg
    	.attr("height", "15")
    	.attr("y",function(){ ylegende= ylegende +15; return ylegende})
  			.style("fill", function(d) { return color(d.value); });
  			
  			var ylegende=20;
  			
  			// nombre de serveurs
  			
  			g2.append("text")
				.attr("x","35") 
				.attr("y",function(){ ylegende= ylegende +15; return ylegende})
      		.text(function(d) { return d.value; });
      		
      		svglegende.attr("height", function(){ heightLegende= heightLegende + ylegende ; return heightLegende}) ; // longueur du svg
      		
charge =1;
}

function info(id)
{
	var nb =id-1;
	var info = document.getElementById('information');
	info.innerHTML="Serveur: " +dataj[nb].host +  "<br> Nombre de requêtes: "+ dataj[nb].nbrequete+"<br> Taille totale des données: "+ dataj[nb].value;      
}

function infovide()
{

	var info = document.getElementById('information');
	info.innerHTML="<br><br>";
}
