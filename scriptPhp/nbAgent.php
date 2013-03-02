<?php
	require '../params.php';

	ini_set('memory_limit','1G');
	
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	$nbvisite = $_GET['nbvisite'];
	echo "[";
    mysql_connect($host, $user, $password) or die('Erreur de connexion avec la base de données');
    mysql_select_db($base) or die('Base de données inexistante');

	$query = "select agent, count(id) as nb from apache_access_log where ltime >='$date1' and ltime <='$date2' group by agent having nb > $nbvisite order by nb desc";
	$r = mysql_query($query);

	while($a = mysql_fetch_object($r))
  	{
  		$agent=$a->agent;
  		$valeur=$a->nb;
  		echo "{\"agent\":\"$agent\",\"value\":$valeur},";
  	}
  	 echo "{\"agent\":\"  \",\"value\":0}]";
  	
?>
