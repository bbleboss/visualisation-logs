<?php
	require '../params.php';

	ini_set('memory_limit','1G');
	
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	$taillesum = $_GET['taillesum'];
	$table = $_GET['table'];
	$message = "[";
    mysql_connect($host, $user, $password) or die('Erreur de connexion avec la base de données');
    mysql_select_db($base) or die('Base de données inexistante');

	$query = "select host, count(id) as nb, sum(size) as taille from $table where ltime >='$date1' and ltime <='$date2' group by host having taille >= $taillesum order by taille desc";
	$r = mysql_query($query);

	while($a = mysql_fetch_object($r))
  	{
  		$host=$a->host;
  		$host=preg_replace('#\"#', ' ', $host);
  		$host= str_replace("\\", " ", $host);
  		$nbrequete=$a->nb; 
  		$valeur=$a->taille;
  		$message = "$message {\"host\":\"$host\",\"value\":$valeur,\"nbrequete\":$nbrequete},";
  	}
  	$message=preg_replace('#,$#', ']', $message);
  	 echo $message;
  	
?>
