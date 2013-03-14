<?php
	require '../params.php';

	ini_set('memory_limit','1G');
	
	$expressionModule = $_GET['expressionModule'];
	$expressionDescription = $_GET['expressionDescription'];
	$date1 = $_GET['date1'];
	$date2 = $_GET['date2'];
	$nberror = $_GET['nberror'];
	$table = $_GET['table'];
	$typesev = $_GET['typesev'];
	$message = "[";
	$trouve=0;
	
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




  		if($expressionModule == "null") //Si expressionModule est égal à "null", alors on est dans Apache, il n'y a donc que l'expression régulière description à gérer
  		{
  			while($a = mysql_fetch_object($r))
  			{
  				if(preg_match($expressionDescription, $a->descrip) || strlen($expressionDescription) < 2)
  				{
					$module=$a->module;
  					$module=preg_replace('#\"#', ' ', $module);
  					$module= str_replace("\\", " ", $module); 
  				
  					$description=$a->descrip;
  					$description=preg_replace('#\"#', ' ', $description);
  					$description= str_replace("\\", " ", $description); 
  			
  					$valeur=$a->nb;
  					$message = "$message {\"module\":\"$module\",\"description\":\"$description\",\"value\":$valeur},";
  					$trouve=1;

  				}
  			}
  		}
  		else //Sinon on doit gérer le cas où il y a deux expression régulières
  		{
  			//Si les deux champs sont vides, ont laisse passer
  			if(strlen($expressionModule) < 2 && strlen($expressionDescription) < 2)
  			{
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
  					$trouve=1;
  				}
  			}
  			else if(strlen($expressionModule) > 2 && strlen($expressionDescription) > 2) //Si les deux champs sont remplis
  			{
  				while($a = mysql_fetch_object($r))
  				{
  					if(preg_match($expressionDescription, $a->descrip) && preg_match($expressionModule, $a->module))
  					{	
  						$module=$a->module;
  						$module=preg_replace('#\"#', ' ', $module);
  						$module= str_replace("\\", " ", $module); 
  			
  						$description=$a->descrip;
  						$description=preg_replace('#\"#', ' ', $description);
  						$description= str_replace("\\", " ", $description); 
  			
  						$valeur=$a->nb;
  						$message = "$message {\"module\":\"$module\",\"description\":\"$description\",\"value\":$valeur},";
  						$trouve=1;

  					}
  				}
  			}
  			else // Sinon, un des deux champs est remplis
  			{
  				if(strlen($expressionModule) < 2 && strlen($expressionDescription) > 2) //Si le champs expressionModule est vide et l'autre plein
  				{
  					while($a = mysql_fetch_object($r))
  					{
  						if(preg_match($expressionDescription, $a->descrip))
  						{	

  							$module=$a->module;
  							$module=preg_replace('#\"#', ' ', $module);
  							$module= str_replace("\\", " ", $module); 
  			
  							$description=$a->descrip;
  							$description=preg_replace('#\"#', ' ', $description);
  							$description= str_replace("\\", " ", $description); 
  			
  							$valeur=$a->nb;
  							$message = "$message {\"module\":\"$module\",\"description\":\"$description\",\"value\":$valeur},";
  							$trouve=1;
  	
  						}
  					}
  				}
  				else //Sinon, le champs expressionModule est rempli
  				{
  					while($a = mysql_fetch_object($r))
  					{
  				  		if(preg_match($expressionModule, $a->module))
  						{
  							$module=$a->module;
  							$module=preg_replace('#\"#', ' ', $module);
  							$module= str_replace("\\", " ", $module); 
  			
  							$description=$a->descrip;
  							$description=preg_replace('#\"#', ' ', $description);
  							$description= str_replace("\\", " ", $description); 
  			
  							$valeur=$a->nb;
  							$message = "$message {\"module\":\"$module\",\"description\":\"$description\",\"value\":$valeur},";
  							$trouve=1;
  						}
  					}
  				}	
  			}
  		}
  	
  	
  	$message=preg_replace('#,$#', ']', $message);
  	
  	if($trouve==0)
  	{
  		$message += ']';
  	}
  	
  	 echo $message;
  	
?>
