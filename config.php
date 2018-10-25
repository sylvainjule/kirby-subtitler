<?php 

require_once __DIR__ . '/lib/subtitler.php';

Kirby::plugin('sylvainjule/subtitler', array(
    'sections'     => require_once __DIR__ . DS . 'lib' . DS . 'sections.php',
    'fields'       => require_once __DIR__ . DS . 'lib' . DS . 'fields.php',
    'fieldMethods' => require_once __DIR__ . DS . 'lib' . DS . 'fieldMethods.php',
    'api' => array(
    	'routes' => require_once __DIR__ . '/lib/routes.php',
    ),
));