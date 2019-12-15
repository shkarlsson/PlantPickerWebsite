<?php

$url = "en latsasurl";//$_POST['url'];
$treename = "en";//$_POST['treename'];

$con = mysqli_connect('mydb10.surf-town.net', 'anne-li_henke', 'r3d3mpt10n', 'anne-li_trees');

if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
  //$sql = "UPDATE treeUrls SET removed=1 WHERE id=$id";
  $sql = "INSERT INTO treeUrls (url,treename) VALUES ('" . $url . "','" . $treename . "');";
mysqli_query($con,$sql);

?>