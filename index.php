<!DOCTYPE html>
<html lang="fr">

<head>
	<title>Accueil</title>
	<link rel="stylesheet" media="screen" type="text/css" href="style.css" />
	<link rel="stylesheet" media="print" type="text/css" href="imprimable.css"/>
	<link rel="shortcut icon" href="favicon.ico" />
	<meta charset= "UTF-8" />
	<meta name="author" content="Amblard Clément, Boulay Baptiste, Play Jonathan"/>
	<meta name="description" content="Accueil du site de visualisation intéractive de fichiers logs"/>
</head>

<body>

	<?php include("menu.php");?>
	
	<!--[if lt IE 9]>
	<div class="page">
	<![endif]-->
	<section class="page">
		<h1>Visualisateur interactif de fichiers log</h1>
			<h2>I. Présentation du Projet</h2>
				<p>Le visualisateur interactif de fichiers log est le projet tuteuré de fin d'étude de 3 étudiants en informatique de l'IUT Lyon 1. Il a 
				pour but de visionner de manière simplifiée les données des fichier logs du laboratoire LIRIS grace à des visualisations explicites. Pour réaliser l'ensemble de
				celles-ci, nous nous sommes appuyé sur une bibliothèque javascript open source spécialisée dans la visualisation nommée <a href="http://d3js.org">D3.js </a> qui a été créée en 2010 et qui est encore en 
				développement aujourd'hui(dernière release le 21 mars 2013). </p>
			<h2>II. Le Guide d'Utilisation</h2>
			
		<script src="scriptJS/modifUrl.js"></script>
	</section>
	<!--[if lt IE 9]>
	</div>
	<![endif]-->
	
	<?php include("footer.php");?>
	
</body>
</html>
