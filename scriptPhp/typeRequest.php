<?php
	require '../params.php';

	ini_set('memory_limit','1G');
	$expression = $_GET['expression'];
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	$nbrequete = $_GET['nbrequete'];
	$table = $_GET['table'];
	$message = "[";
	$trouve=0;
	
    mysql_connect($host, $user, $password) or die('Erreur de connexion avec la base de données');
    mysql_select_db($base) or die('Base de données inexistante');

	$query = "select request, count(id) as nb from $table where ltime >='$date1' and ltime <='$date2' group by request having nb >= $nbrequete order by nb desc";
	$r = mysql_query($query);

	while($a = mysql_fetch_object($r))
  	{
  		if(preg_match($expression, $a->request) || strlen($expression) < 2 )
  		{
  			$trouve=1;
  			$requete=$a->request;
  			$requete=preg_replace('#\"#', ' ', $requete);
  			$requete= str_replace("\\", " ", $requete); 
  			$valeur=$a->nb;
  			$message = "$message {\"requete\":\"$requete\",\"value\":$valeur},";
  		}
  	}
  	$message=preg_replace('#,$#', ']', $message);
  	
  	if($trouve==0)
  	{
  		$message += ']';
  	}
  	
  	 echo $message;
  	
?>
