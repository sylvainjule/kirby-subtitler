<?php 

require_once __DIR__ . '/lib/subtitler.php';

Kirby::plugin('sylvainjule/subtitler', array(
    'sections'     => require_once __DIR__ . '/lib/sections.php',
    'fields'       => require_once __DIR__ . '/lib/fields.php',
    'fieldMethods' => require_once __DIR__ . '/lib/fieldMethods.php',
    'translations' => array(
        'en' => require_once __DIR__ . '/lib/languages/en.php',
    ),
    'api' => array(
    	'routes' => require_once __DIR__ . '/lib/routes.php',
    ),
));