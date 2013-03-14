<!DOCTYPE html>

<html>
	<head>
		<title>Nombre d'erreurs en fonction d'une période</title>
		<meta http-equiv="content-type" content="text/html" charset=utf-8" />
		<script type="text/javascript" src="/d3/d3.js"></script>
		<script  type="text/javascript">document.addEventListener("mousemove","GetMousePos",true);</script>

	</head>
	
	<body>
		<style type="text/css">
			.chart circle {
			   stroke: white;
			   fill: steelblue;
			}
		</style>
		<h1>Récupération du nombre d'erreurs selon une période via un script php</h1>
		
		Rentrez la date sous la forme YYY-MM-DD</br>
		Date1: <input id= date1 name=date1 type=text /></br>
		Date2: <input id= date2 name=date2 type= text /></br>
		
		
		<input id= valider type=button value=Valider onclick="update(),affiche()" />
		<div id=curseur></div>
		<div id=resultat></div>
		<script type="text/javascript" src="../scriptJS/nbErreur.js"></script>
	</body>
</html>
