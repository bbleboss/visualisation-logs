<?php
  require '../params.php';
  
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	$table = $_GET['table'];
	$message = "[";
	mysql_connect($host, $user, $password) or die('Erreur de connexion avec la base de données');
	mysql_select_db($base) or die('Base de données inexistante');
	
	$query = "select count(*) 'reqget' from $table where request_type = 'get' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqget;
	if($res != 0)
	{
	$message = "$message {\"title\":\"get\",\"value\":$res},";
	}
	
	$query = "select count(*) 'reqpost' from $table where request_type = 'post' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqpost;
	if($res != 0)
	{
	$message = "$message {\"title\":\"post\",\"value\":$res},";
	}
	
	$query = "select count(*) 'reqoptions' from $table where request_type = 'options' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqoptions;
	if($res != 0)
	{
	$message = "$message {\"title\":\"options\",\"value\":$res},";
	}
	
	$query = "select count(*) 'reqhead' from $table where request_type = 'head' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqhead;
	if($res != 0)
	{
	$message = "$message {\"title\":\"head\",\"value\":$res},";
	}
	
	$query = "select count(*) 'reqput' from $table where request_type = 'put' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqput;
	if($res != 0)
	{
	$message = "$message {\"title\":\"put\",\"value\":$res},";
	}
	
	$query = "select count(*) 'reqdelete' from $table where request_type = 'delete' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqdelete;
	if($res != 0)
	{
	$message = "$message {\"title\":\"delete\",\"value\":$res},";
	}
	
	$query = "select count(*) 'reqconnect' from $table where request_type = 'connect' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqconnect;
	if($res != 0)
	{
	$message = "$message {\"title\":\"connect\",\"value\":$res},";
	}
	
	$query = "select count(*) 'reqtrace' from $table where request_type = 'trace' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqtrace;
	if($res != 0)
	{
	$message = "$message {\"title\":\"trace\",\"value\":$res},";
	}
  
 	$query = "select count(*) 'reqpatch' from $table where request_type = 'patch' and ltime >='$date1' and ltime <='$date2'";
	$r = mysql_query($query);
	$a = mysql_fetch_object($r);
	$res = $a->reqpatch;
	if($res != 0)
	{
	$message = "$message {\"title\":\"patch\",\"value\":$res}]";
	}
	else
	{
	$message=preg_replace('#,$#', ']', $message);
	}
	echo $message;
?>
