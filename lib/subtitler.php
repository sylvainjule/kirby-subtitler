<?php

class Subtitler {

	// seconds to hours:minutes:seconds,milliseconds
	public static function toSrtTime($seconds) {
	    $hours = 0;
	    $milliseconds = str_replace('0.', '', $seconds - floor($seconds));

	  	if ($seconds > 3600) {
	    	$hours = floor($seconds / 3600);
	  	}
	  	$seconds = $seconds % 3600;

		return str_pad($hours, 2, '0', STR_PAD_LEFT)
	       	 . gmdate(':i:s', $seconds)
	       	 . ($milliseconds ? '.' . $milliseconds : '');
	}

}