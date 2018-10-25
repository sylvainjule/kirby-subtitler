<?php

return array(
    'subtitler' => array(
    	'props' => array(
    		'debug' => function($debug = false) {
    			return $debug;
    		},
    		'theme' => function($theme = 'light') {
    			return $theme;
    		},
    		'timelines' => function($timelines = []) {
    			$orderedTimelines = array();
    			foreach($timelines as $timeline) {
    				$data = array(
    					'id' => $timeline['id'],
    					'label' => $timeline['label'],
    					'color' => $timeline['color'],
    				);
    				array_push($orderedTimelines, $data);
    			}
    			return $orderedTimelines;
    		},
    		'storage' => function($storage = []) {
                return $storage;
            },
    	),
    	'computed' => array(
            'file' => function() {
                if (in_array($this->model()->type(), ['audio', 'video'])) {
                    return array(
                    	'url' => $this->model()->url(),
                    	'type' => $this->model()->type(),
                    );
                }
                else {
                    return false;
                }
            }
        ),
    ),
);