<?php

return array(
    array(
        'pattern' => 'subtitler/generate-vtt-files',
        'method'  => 'POST',
        'action'  => function() {
        	$uri       = get('uri');
        	$fieldname = get('src');

        	try {
        		$page = kirby()->page($uri);
        		Subtitler::generateVttFiles($page, $fieldname);

        		$response = array(
		            'status' => 'success',
		        );
		        return $response;
        	}
        	catch (Exception $e) {
        		$response = array(
		            'status' => 'error',
		            'message'  => $e->getMessage()
		        );
		        return $response;
        	}
        }
    )
);
