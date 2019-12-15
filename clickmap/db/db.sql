CREATE TABLE  `clickmap` ( 
  `id` int(10) unsigned NOT NULL auto_increment, 
  `x` smallint(4) unsigned NOT NULL, 
  `y` smallint(4) unsigned NOT NULL, 
  `location` varchar(255) NOT NULL, 
  PRIMARY KEY  (`id`), 
  KEY `location` (`location`) 
)