<?php 
    $DB = mysql_connect("localhost", "clickmap_user", "hello767hello"); 
    mysql_select_db("clickmap_demo_db", $DB);     
    
    if (isset($_POST['l'])) { 
        $query = sprintf("  INSERT INTO clickmap  
                            SET x = '%s', y = '%s', location = '%s'",  
                            $_POST['x'], $_POST['y'], $_POST['l']);        
        $result = mysql_query($query);
    };
        
    if (isset($_GET['l'])) { 
        $query = sprintf("  SELECT x, y FROM clickmap  
                            WHERE location = '%s' 
                            ORDER BY id DESC
                            limit 200",  
                            $_GET['l']); 
        $results = mysql_query($query); 
             
        $html = '<div id="clickmap-container">'; 
        while ($row = mysql_fetch_array($results)) { 
        $html .= sprintf('<div style="left:%spx;top:%spx"></div>', $row['x'] - 10, $row['y'] - 10); 
    } 
        $html .= '</div>'; 
         
        echo $html; 
    };  
    
    mysql_close($DB); 
?>