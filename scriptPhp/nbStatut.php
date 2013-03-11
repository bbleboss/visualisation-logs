<?php
	require '../params.php';

	ini_set('memory_limit','1G');
	
	$expressionStatut = $_GET['expressionStatut'];
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	$nbstatut = $_GET['nbstatut'];
	$trie = $_GET['trie'];
	$table = $_GET['table'];
	$message = "[";
    mysql_connect($host, $user, $password) or die('Erreur de connexion avec la base de données');
    mysql_select_db($base) or die('Base de données inexistante');
	if ($trie == "nb")
	{
		$query = "select status as statut, count(id) as nb from $table where ltime >='$date1' and ltime <='$date2' group by status having nb >= $nbstatut order by nb desc";
	}
	else
	{
		$query = "select status as statut, count(id) as nb from $table where ltime >='$date1' and ltime <='$date2' group by status having nb >= $nbstatut order by status desc";
	}
	$r = mysql_query($query);

	while($a = mysql_fetch_object($r))
  	{
  		if(preg_match($expressionStatut, $a->statut) || strlen($expressionStatut) < 2)
  		{
  			$statut=$a->statut; 
  			$valeur=$a->nb;
  			$message = "$message {\"statut\":\"$statut\",\"value\":$valeur},";
  		}
  	}
  	$message=preg_replace('#,$#', ']', $message);
  	 echo $message;
  	 
  	
?>
