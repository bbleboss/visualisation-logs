//-----------update des liens du menu pour transmettre les dates de page en page
var date1 = document.getElementById('date1');
var date2 = document.getElementById('date2');
var url = document.location.href;


if(url.search('index.php'))
{
	transfertDateIndex();
}
else
{
	date1.onchange = updateUrl;
			    
	date2.onchange = updateUrl;
}
function updateUrl(){
				
				var date1 = document.getElementById('date1');
				var date2 = document.getElementById('date2');
				liens = document.getElementById('menu').getElementsByTagName('a');//selection des liens
				for(var i= 0; i < liens.length; i++)
				{
					
					var pos = liens[i].href.search('#');
					if(pos != -1)
					{
						
						liens[i].href = liens[i].href.substring(0,pos);
					}
					liens[i].href = liens[i].href+'#date1='+date1.value+'&date2='+date2.value;//mise à jour du lien 
					
				}
				//------mise à jour de l'url-------
				var pos = document.location.href.search('#');
				if(pos != -1)
				{
					document.location.href = document.location.href.substring(0, pos)+'#date1='+date1.value+'&date2='+date2.value;
				}
				else
				{
					document.location.href = document.location.href+'#date1='+date1.value+'&date2='+date2.value;
				}
			    }
//---------------Update des champs date1 et date2 

var pos = url.search('#');

if(pos != -1)
{
	updateDate('date1');
	updateDate('date2');
}	
	
function updateDate(date)
{
	pos = url.search(date);
	var date1 = '';
	var i = pos+6;
	while(url[i] != '&' && i < url.length)
	{
		date1 = date1 + url[i];
		i++;
	}
	document.getElementById(date).value = date1;
}



function transfertDateIndex() { //fonction adapté pour la page d'index (qui n'a pas de formulaire de date) qui récupère les date dans l'url et modifie les liens
	
	pos = url.search('date1');
	var date1 = '';
	var i = pos+6;
	while(url[i] != '&' && i < url.length)
	{
		date1 = date1 + url[i];
		i++;
	}
	pos = url.search('date2');
	var date2 = '';
	var i = pos+6;
	while(url[i] != '&' && i < url.length)
	{
		date2 = date2 + url[i];
		i++;
	}
	liens = document.getElementById('menu').getElementsByTagName('a');//selection des liens
	for(var i= 0; i < liens.length; i++)
	{
		var pos = liens[i].href.search('#');
		if(pos != -1)
		{
			liens[i].href = liens[i].href.substring(0,pos);
		}
		liens[i].href = liens[i].href+'#date1='+date1+'&date2='+date2;//mise à jour du lien 
					
	}
}
//appel à update pour mettre à jour les liens au cas où l'utilisateur ne déclenche pas onchange pendant tout le temps où il est sur la page 
if(!url.search('index.php'))
{
	updateUrl(date1, date2);
}
