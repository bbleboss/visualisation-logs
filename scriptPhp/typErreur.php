<?php
	require '../params.php';

	ini_set('memory_limit','1G');
	
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	$nberror = $_GET['nberror'];
	$table = $_GET['table'];
	$typesev = $_GET['typesev'];
	$message = "[";
    mysql_connect($host, $user, $password) or die('Erreur de connexion avec la base de données');
    mysql_select_db($base) or die('Base de données inexistante');
	if($table == 'apache_error_log')
	{
		$query = "select description as descrip, count(id) as nb from $table where ltime >='$date1' and ltime <='$date2' and severity = \"$typesev\" group by description having nb >= $nberror order by nb desc";
	}
	else
	{
		$query = "select module, description as descrip, count(id) as nb from $table where datetime >='$date1' and datetime <='$date2' and severity = \"$typesev\" group by description having nb >= $nberror order by nb desc";
	}
	$r = mysql_query($query);

	while($a = mysql_fetch_object($r))
  	{
  		$module=$a->module;
  		$module=preg_replace('#\"#', ' ', $module);
  		$module= str_replace("\\", " ", $module); 
  		$description=$a->descrip;
  		$description=preg_replace('#\"#', ' ', $description);
  		$description= str_replace("\\", " ", $description); 
  		$valeur=$a->nb;
  		$message = "$message {\"module\":\"$module\",\"description\":\"$description\",\"value\":$valeur},";
  	}
  	$message=preg_replace('#,$#', ']', $message);
  	 echo $message;
  	 
  	
?>
