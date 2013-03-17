<?php
  require '../params.php';
  
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	$table = $_GET['table'];
	echo '[';
	mysql_connect($host, $user, $password) or die('Erreur de connexion avec la base de données');
	mysql_select_db($base) or die('Base de données inexistante');
	
	$query = "select count(*) 'reqget' from $table where request_type = 'get' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqget;
	echo "{\"title\":\"get\",\"value\":$res},";
	
	$query = "select count(*) 'reqpost' from $table where request_type = 'post' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqpost;
	echo "{\"title\":\"post\",\"value\":$res},";
	
	$query = "select count(*) 'reqoptions' from $table where request_type = 'options' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqoptions;
  echo "{\"title\":\"options\",\"value\":$res}]";
?>
