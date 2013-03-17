var date1, date2, nbrequete, dataj;
var charge = 0;
var table = "apache_access_log";
var animation = false;
var dateTrue;
var expression;
window.onload = update;

function update()//fonction appelée lors du click sur valider
{
		expression = document.getElementById('expression').value;
		var source = event.target.id;//quel objet a appelé
		var type = event.type;//pour pouvoir vérifier qu'on a bien clické et pas juste passé la souris sur le bouton 
		var autoLoad = event.target;
		if(source == "apache" || source == "zope" || autoLoad == "[object HTMLDocument]")
		{
			if(source == "zope")
			{
				table = "zope_instance_z2_log";
			}
			else
			{
				table = "apache_access_log";
			}
		}
        var xhr = new XMLHttpRequest();//création de la requête
        if(((source == "valider" || source == "updateForm") && type == "click")|| autoLoad == "[object HTMLDocument]")//dans le cas où on change les dates du formulaire
        {
        	
        	dateTrue = true;
		var verifDate = /^[ ]*[0-9]{4}-((0[1-9]|[1-9])|1[0-2])-([1-9]|[0-3][0-9])[ ]*($|[ ]+([0-9]|[0-1][0-9]|2[0-3])[ ]*($|:([0-9]|[0-5][0-9])[ ]*($|:([0-9]|[0-5][0-9])[ ]*$)))/;
        	date1 = document.getElementById('date1').value;
        	date2 = document.getElementById('date2').value;
        	if(!verifDate.exec(date1) || !verifDate.exec(date2))
        	{
        		if(date1.length > 0 || date2.length >0)
        		{
        			alert('Vous devez respecter la syntaxe: YYYY-MM-DD HH:MM:SS');
        		}
        		dateTrue = false;
        	}
        	nbrequete = document.getElementById('nbrequete').value;
			if (isNaN(nbrequete))
			{ 
				alert('Vous devez rentrer un nombre pour le nombre de requete');
				dateTrue =false;
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
		var resultat = document.getElementById('resultat');
		var legende = document.getElementById('legende');
		document.getElementById('information').innerHTML="<br><br>";
		date1 =encodeURIComponent(date1);
		date2 = encodeURIComponent(date2);
		expression = encodeURIComponent(expression);
		document.getElementById('chargement').innerHTML = "Chargement en cours, veuillez patienter ... </br> <img src=\"http://localhost:8888/gif/loading.gif\" />";
		xhr.open('GET', 'http://localhost:8888/scriptPhp/typeRequest.php?date1='+date1+'&date2='+date2+'&nbrequete='+nbrequete+'&table='+table+'&expression='+expression);//parametrage de la requête
		xhr.send(null);//envoi de la requete          
		xhr.onreadystatechange = function() {
		                               			if (xhr.readyState == 4 && xhr.status == 200) { //si requete terminée et ok
		                                        	dataj= JSON.parse(xhr.responseText);//transformation de la chaine en JSON
		                                        	if(dataj == 0)
		                                        	{
		                                        		alert("Aucun élément n'a été trouvé avec l'expression régulière entrée.");
		                                        		document.getElementById('chargement').innerHTML = "";
		                                        	}
		                                        	else
		                                        	{
		                                        		graph(source, type);
		                                        		//On supprime l'animation de chargement
		                                        		document.getElementById('chargement').innerHTML = "";
		                                        		//alert('2ème étape de test - premiere date enregistrée') ;
		                                        	
		                                				if(((source == "valider"|| source == "updateForm") && type == "click" ) || autoLoad == "[object HTMLDocument]")// on appel affiche que quand on a détruit le curseur
		                                        		{
		                                        			affiche();
		                                        		}
		                                        	}
		                                        }
		                                	};
	}
}

function graph( source, type) {

	var width = 960;
    var height = 500;
    var heightLegende = 50;
    var radius = Math.min(width, height) / 2;
    var ylegende= 20;
    var nb =0;
   var text;
	     
    if(charge == 1 && ((source == "valider"|| source == "updateForm")&& type == "click"))//si on change le formulaire on refait toutes les svg
     {
                d3.selectAll("svg").remove();
     }
     else
     {
		d3.select("#camembert").remove();
        	d3.select("#svglegende").remove();
     }
	
	// -------------creation du cercle ---------//
	
   var color = d3.scale.category20() // limité au nombre de couleur dans le range 
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
      		
      		nb=0;
      		while (nb< nbmax)
      		{
      			nb++; 
      			text = "infovide("+nb+")";
      			i = document.getElementById(nb);
      			i.setAttribute("onmouseout",text);
      		}

  			g.append("path")
  			.attr("d", 0) 
  			.style("fill", "white")
  			.transition()
   	     .duration(2500)
      		.attr("d", arc)
      		.style("fill", function(d) { return color(d.value); })
      		
      		
// -------------creation de la legende---------//

			var svglegende = d3.select("#legende").append("svg") //création du svg
    		.attr("width", 1200) //largeur du svg
    		.attr("id", "svglegende")
    		
    		var nomColonne = svglegende.append("g")
      		.attr("class", "nom");
      		nomColonne.append("text")
				.attr("x","35") 
				.attr("y","15")
      		.text("Nb d'execution");
      		
      		nomColonne.append("text")
				.attr("x","200") 
				.attr("y","15")
      		.text("Nom des Requêtes");
  			
  			var g2 = svglegende.selectAll(".agent")
      		.data(dataj)
    		.enter().append("g")
      		.attr("class", "agent");
      		
      		// nom des requetes
      		g2.append("text")
				.attr("x","200") 
				.attr("y",function(){ ylegende= ylegende +15; return ylegende})
      		.text(function(d) { return d.requete; });
      		var ylegende=6;
      		
      		// rectangles des legendes
      		g2.append("rect")
      		.attr("width", "20") //largeur du svg
    	.attr("height", "15")
    	.attr("y",function(){ ylegende= ylegende +15; return ylegende})
  			.style("fill", function(d) { return color(d.value); });
  			
  			var ylegende=20;
  			
  			// nombre de requete
  			
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
	id = id.toString();
	var part = document.getElementById(id);
	part.style.opacity='0.8';
	info.innerHTML="Requête: " +dataj[nb].requete + "<br> Nombre d'execution: "+ dataj[nb].value;      
}

function infovide(id)
{
	id = id.toString();
	var part = document.getElementById(id);
	part.style.opacity='1';
	var info = document.getElementById('information');
	info.innerHTML="<br><br>";
}
