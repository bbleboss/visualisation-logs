<!DOCTYPE html>
<html lang="fr">

<head>
	<title>Visualisation des Requêtes</title>
	<link rel="stylesheet" media="screen" type="text/css" href="style.css" />
	<link rel="stylesheet" media="print" type="text/css" href="imprimable.css"/>
	<link rel="shortcut icon" href="favicon.ico" />
	<meta charset= "UTF-8" />
	<meta name="author" content="Amblard Clément, Boulay Baptiste, Play Jonathan"/>
	<meta name="description" content="Visualisation des requetes"/>
	<script type="text/javascript" src="/d3/d3.js"></script>
</head>

<body>

	<?php include("menu.php");?>
	
	<!--[if lt IE 9]>
	<div class="page">
	<![endif]-->
	<section class="page">
		<h1>Récupération des Requêtes</h1>
			<form>
				<p>Rentrez la date sous la forme YYYY-MM-DD HH:MM:SS</p>
				<label for="date1">Date1</label>: <input id= date1 name=date1 type=text placeholder="2012-09-16 06:58:47" />
				</br>
				<label for="date2">Date2</label>: <input id= date2 name=date2 type=text placeholder="2012-09-16 08:58:47"/>
				</br>
				<label for="nbrequete">Nombre de requête minimum</label>: <input id= nbrequete name=nbrequete type=text value="1" />
				</br>
				<label for="expression">Expression régulière pour le nom des requêtes </label>: <input id=expression name=expression type=text value="##"/>
				</br>
		 		<input id= valider type=button value=Valider onclick="update()" />
		 	</form>
		<div id=curseur></div>
		<div id=chargement></div>
		<div id=information></div>
		<div id=resultat></div>
		<div id=legende></div>
		<script src="scriptJS/popup.js"></script>
		<script src="scriptJS/typeRequest.js"></script>
		<script src="scriptJS/curseur.js"></script>
		<script src="scriptJS/modifUrl.js"></script>
		
	
	</section>
	<!--[if lt IE 9]>
	</div>
	<![endif]-->
	
	<?php include("footer.php");?>
	
</body>
</html>
