<?php

if (get_magic_quotes_gpc())  
{
   $json = stripslashes($_POST['json']);
 }
 else 
 {
 	$json = $_POST['json'];
 }
   //$data = json_decode($json,true);
     $file = fopen('data.json','w');
     fwrite($file, $json);
     fclose($file);

?>


