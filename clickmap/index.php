<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	
	<title>Click Map Demo</title>
	<!--
	
	   Click Map Demo
       By Jay Salvat
       http://www.jaysalvat.com/
	
	-->
	<link rel="stylesheet" type="text/css" href="style.css" />
	
	<script src="http://www.google.com/jsapi" type="text/javascript"></script>
    <script type="text/javascript">
        google.load("jquery", "1.3");
    </script>
	    
    <script type="text/javascript" src="js/clickmap.js"></script>
    
    <script type="text/javascript">
        $(function() {
            $(document).saveClicks(); 
        
            $('.displayClicks').click(function() {
                $.displayClicks();
                $('#clickmap-overlay').click(function() {
                     $.removeClicks();
                     $(document).saveClicks();
                });
                $(document).stopSaveClicks();
                return false;
            });
        });
    </script>
</head>

<body>
    
    <img src="images/baywatch.jpg" alt="baywatch" />
    
    <p class="button displayClicks"><a href="#demo">Display Click Map</a></p>

</body>

</html>