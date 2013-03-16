<?php
	require '../params.php';
	
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	echo '[';
	mysql_connect($host, $user, $password) or die('Erreur de connexion avec la base de données');
	mysql_select_db($base) or die('Base de données inexistante');
	$query = "select count(*) 'error' from apache_error_log where severity = 'error' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	
	$a = mysql_fetch_object($r);
	$res = $a->error;
	echo "{\"title\":\"error\",\"value\":$res},";
	
	$query = "select count(*) 'warning' from apache_error_log where severity = 'warn' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->warning;
	echo "{\"title\":\"warning\",\"value\":$res},";
	
	$query = "select count(*) 'notice' from apache_error_log where severity = 'notice' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->notice;
	echo "{\"title\":\"notice\",\"value\":$res}]";
?>
