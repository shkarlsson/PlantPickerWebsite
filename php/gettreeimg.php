<?php
 
/**
 * Grab Images from Wikipedia via thier API
 *
 * @author     http://techslides.com
 * @link       http://techslides.com/grab-wikipedia-pictures-by-api-with-php
 */
 
//curl request returns json output via json_decode php function
function curl($url){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 GTB5');
	$result = curl_exec($ch);
	curl_close($ch);
	return $result;
}
 
//parse the json output
function getResults($json){
 
	$results = array();
 
	$json_array = json_decode($json, true);
 
	foreach($json_array['query']['pages'] as $page){
		if(count($page['images']) > 0){
		    foreach($page['images'] as $image){
 
		    	$title = str_replace(" ", "_", $image["title"]);
		    	$imageinfourl = "http://en.wikipedia.org/w/api.php?action=query&titles=".$title."&prop=imageinfo&iiprop=url|size&format=json";
		    	$imageinfo = curl($imageinfourl);
		    	$iamge_array = json_decode($imageinfo, true);
		    	$image_pages = $iamge_array["query"]["pages"];
				foreach($image_pages as $a){
					$arr = array();
					array_push($arr,$a["imageinfo"][0]["url"],$a["imageinfo"][0]["height"],$a["imageinfo"][0]["width"],$a["imageinfo"][0]["size"]);
					$results[] = $arr;
				}
			}
		}
	}
 
	return $results;
 
}
 
$search = /*"Tsuga heterophylla";//*/$_GET["name"];


if (empty($search)) {
    //term param not passed in url
    exit;
} else {
    //create url to use in curl call
    $term = str_replace(" ", "_", $search);
    $url = "http://en.wikipedia.org/w/api.php?action=query&titles=".$term."&prop=images&format=json&imlimit=20";
 
    $json = curl($url);
    $results = getResults($json);
 
	//print the results using an unordered list
	$returner = Array();
	foreach($results as $a){
	     array_push($returner,$a);
	}
	echo json_encode($results);
}
 
 
?>