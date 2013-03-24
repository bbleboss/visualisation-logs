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
			<h2 class="bleufonce">I. Présentation du Projet</h2>
				<p class="index">Le visualisateur interactif de fichiers log est le projet tuteuré de fin d'étude de 3 étudiants en informatique de l'IUT Lyon 1. Il a 
				pour but de visionner de manière simplifiée les données des fichier logs du laboratoire LIRIS grace à des visualisations explicites. Pour réaliser l'ensemble de
				celles-ci, nous nous sommes appuyé sur une bibliothèque javascript open source spécialisée dans la visualisation nommée <a href="http://d3js.org">D3.js</a> qui a été créée en 2010 et qui est encore en 
				développement aujourd'hui (dernière release le 21 mars 2013). </p>
				
			<h2 class="vert">II. Guide d'Utilisation</h2>
				<p class="index"><em> Attention: Le visualisateur ne fonctionne que sous les navigateurs ayant pour moteur de rendu Webkit (ex: Google Chrome ou Safari).</em><p> 
				<p class="index">Chaque visualisation possède 2 champs pour choisir l'interval de dates (au format YYYY-MM-DD HH:MM:SS) sur laquelle la visualisation doit s'effectuer. Une fois la visualisation lancée, un curseur apparait (barre grise) qui permet
				de réduire l'interval afin d'avoir une visualisation plus fine. Vous pouvez aussi selectionner la table à interroger en cliquant sur les boutons radio "Apache" ou "Zope". 
				Si vous souhaitez récupérer les dates du curseur dans le formulaire, cliquez sur le bouton "Mettre à jour le formulaire" situé juste au dessus du curseur à droite.</p>
				
				<h3> Les Cercles </h3>
					<p class="index">Chaque cercle represente le nombre d'occurrence d'un évenement de manière proportionnelle par rapport aux autres cercles. Pour avoir plus de détail sur l'évenement, il suffit de cliquer 
					sur un cercle et vous serez renvoyé vers une visualisation camembert plus précise. </p>
				<h3> Les Camemberts </h3>
					<p class="index">Les diagrammes camemberts permettent un trie par expressions régulières (non obligatoire), celles-ci sont en php, c'est pour cela qu'il faut mettre sa règle entre 2 "#". On peut aussi
					choisir le nombre minimum d'occurrence d'un évenement grace au champ juste en dessous de celui des dates.</p> 
					<p class="index">Au survol d'une part du diagramme vous trouverez les informations liées à celle-ci juste en dessous du curseur. Vous retrouvez aussi celles-ci dans la légende située en dessous du diagrammes.
					Le diagramme est construit dans le sens des aiguilles d'une montre, la première légende correspond donc à la première part à droite de l'axe des ordonnées. Vous pouvez aussi cliquer sur chaque part
					ou sur chaque légende pour voir un histogramme de l'évenement sélectionné en fonction du temps (journée de 24h).</p>
				<h3> L'Histogramme </h3>
					<p class="index">L'histogramme permet de voir le pourcentage d'une requête par tranches horaires (journée de 24h). Il est donc fortement conseillé de n'utiliser que sur des jours entiers (YYYY-MM-DD). Quand vous changez
					de dates sur ce diagramme, celui garde en historique la précédente visualisation qui apparait en bleu clair.</p>
		<script src="scriptJS/modifUrl.js"></script>
	</section>
	<!--[if lt IE 9]>
	</div>
	<![endif]-->
	
	<?php include("footer.php");?>
	
</body>
</html>
