<?php
	require '../params.php';

	ini_set('memory_limit','1G');
	$expression = $_GET['expression'];
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	$nbvisite = $_GET['nbvisite'];
	$table = $_GET['table'];
	$message = "[";
    mysql_connect($host, $user, $password) or die('Erreur de connexion avec la base de données');
    mysql_select_db($base) or die('Base de données inexistante');

	$query = "select agent, count(id) as nb from $table where ltime >='$date1' and ltime <='$date2' group by agent having nb >= $nbvisite order by nb desc";
	$r = mysql_query($query);

	while($a = mysql_fetch_object($r))
  	{
  		if(preg_match($expression, $a->agent) || strlen($expression) < 2 )
  		{
  			$agent=$a->agent;
  			$agent=preg_replace('#\"#', ' ', $agent);
  			$agent= str_replace("\\", " ", $agent); 
  			$valeur=$a->nb;
  			$message = "$message {\"agent\":\"$agent\",\"value\":$valeur},";
  		}
  	}
  	$message=preg_replace('#,$#', ']', $message);
  	 echo $message;
  	
?>
