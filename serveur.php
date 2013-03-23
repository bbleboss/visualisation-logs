<!DOCTYPE html>
<html lang="fr">

<head>
	<title>Visualisation Serveur</title>
	<link rel="stylesheet" media="screen" type="text/css" href="style.css" />
	<link rel="stylesheet" media="print" type="text/css" href="imprimable.css"/>
	<link rel="shortcut icon" href="favicon.ico" />
	<meta charset= "UTF-8" />
	<meta name="author" content="Amblard Clément, Boulay Baptiste, Play Jonathan"/>
	<meta name="description" content="Visualisation de la taille des données reçu par serveur"/>
	<script type="text/javascript" src="/d3/d3.js"></script>
</head>

<body>

	<?php include("menu.php");?>
	
	<!--[if lt IE 9]>
	<div class="page">
	<![endif]-->
	<section class="page">
		<h1>Tailles des données par serveur</h1>
			<form>
				<p>Rentrez la date sous la forme YYYY-MM-DD</p>
				<label for="date1">Date1</label>: <input id= date1 name=date1 type=text />
				</br>
				<label for="date2">Date2</label>: <input id= date2 name=date2 type=text />
				</br>
				<label for="nberror">Minimum du total de la taille des données </label>: <input id= taillesum name=taillesum type=text value="1" />
				</br>
				<label for="expressionServeur">Expression régulière pour l'intitulé des serveurs </label>: <input id=expressionServeur name=expressionServeur type=text value="##" />
				</br>
				<label for ="trie"> Trier par</label> :<select name="trie" id="trie">
  																	<option value="taille">Taille</option>
  																	<option value="requete">Nb requêtes</option>
																</select><br/>
		 		<input id= valider type=button value=Valider onclick="update()" />
		 	</form>
		<div id=curseur></div>
		<div id=chargement></div>
		<div id=information></div>
		<div id=resultat></div>
		<div id=legende></div>
		<script src="scriptJS/popup.js"></script>
		<script src="scriptJS/tailleDonnee.js"></script>
		<script src="scriptJS/curseur.js"></script>
		<script src="scriptJS/modifUrl.js"></script>
		
	
	</section>
	<!--[if lt IE 9]>
	</div>
	<![endif]-->
	
	<?php include("footer.php");?>
	
</body>
</html>
