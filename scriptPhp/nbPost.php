<?php
	require '../params.php';

	ini_set('memory_limit','1G');
	
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	
    mysql_connect($host, $user, $password) or die('Erreur de connexion avec la base de données');
    mysql_select_db($base) or die('Base de données inexistante');

	$query = "select ltime from apache_access_log where request_type = 'POST' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	
	while($dates = mysql_fetch_array($r))
  	{
    	$row_set[] = $dates;
  	}
  	
	echo json_encode($row_set);
?>
