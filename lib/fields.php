<?php

return array(
    'tracksbuilder' => array(
    	'props' => array(
        	'src' => function($src = false) {
        		return $src;
        	}
        ),
        'computed' => array(
        	'vttLength' => function() {
        		return $this->model()->files()->filterBy('extension', '==', 'vtt')->count();
        	},
        	'uri' => function() {
        		return $this->model()->uri();
        	}
        )
    ),
);