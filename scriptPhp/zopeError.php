<?php
	require '../params.php';
	
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	echo '[';
	mysql_connect($host, $user, $password) or die('Erreur de connexion avec la base de données');
	mysql_select_db($base) or die('Base de données inexistante');
	$query = "select count(*) 'ERROR' from zope_instance_log where severity = 'ERROR' and datetime >='$date1' and datetime <='$date2'";
	$r = mysql_query($query);
	
	$a = mysql_fetch_object($r);
	$res = $a->ERROR;
	echo "{\"title\":\"error\",\"value\":$res},";
	
	$query = "select count(*) 'WARNING' from zope_instance_log where severity = 'WARNING' and datetime >='$date1' and datetime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->WARNING;
	echo "{\"title\":\"warning\",\"value\":$res},";
	
	$query = "select count(*) 'INFO' from zope_instance_log where severity = 'INFO' and datetime >='$date1' and datetime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->INFO;
	echo "{\"title\":\"notice\",\"value\":$res}]";

?>
