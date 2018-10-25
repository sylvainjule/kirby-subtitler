<?php

class Subtitler {

	// seconds to hours:minutes:seconds,milliseconds
	public static function toVttTime($seconds) {
	    $hours = 0;
	    $milliseconds = str_replace('0.', '', number_format($seconds - floor($seconds), 3));

	  	if ($seconds > 3600) {
	    	$hours = floor($seconds / 3600);
	  	}
	  	$seconds = $seconds % 3600;

		return str_pad($hours, 2, '0', STR_PAD_LEFT)
	       	 . gmdate(':i:s', $seconds)
	       	 . ($milliseconds ? '.' . $milliseconds : '');
	}

	// .vtt files builder
	public static function generateVttFiles($page, $fieldname) {
		$root = $page->root();

		// if the site is multilang
		if(kirby()->multilang()) {
			// for each language
	    	foreach(kirby()->languages() as $language) {
	    		$lang = $language->code();
	    		$subtitles = $page->content($lang)->get($fieldname);
	    		$timelines = array_unique(array_column($subtitles->yaml(), 'timeline'));

	    		// generate a .vtt file for eahc timeline in the language
	    		foreach($timelines as $timeline) {
	    			self::generateVttFile($subtitles, $root, $fieldname, $timeline, $lang);
	    		}
	    	}
		}
		else {
			$subtitles = $page->content()->get($fieldname);
	    	$timelines = array_unique(array_column($subtitles->yaml(), 'timeline'));

	    	// generate a .vtt file for each timeline
	    	foreach($timelines as $timeline) {
	    		self::generateVttFile($subtitles, $root, $fieldname, $timeline);
	    	}
		}
	}

	// create / update a .vtt file
	public static function generateVttFile($subtitles, $root, $fieldname, $timeline, $lang = false) {
		$timelineSubs = $subtitles->getTimeline($timeline);

    	$filepath = $root . '/' . $fieldname . '-' . $timeline;
    	$filepath .= $lang ? '-' . $lang : '';
    	$filepath .= '.vtt';

    	$content  = 'WEBVTT' . PHP_EOL . PHP_EOL;
    	$i = 0;

    	// loop through each subtitle
    	foreach($timelineSubs as $subtitle) {
    		$i++;

    		$start = $subtitle->start()->toVttTime();
    		$end = $subtitle->end()->toVttTime();
    		$time = $start . ' --> ' . $end;
    		$content .= $i . PHP_EOL . $time . PHP_EOL;
    		$content .= $subtitle->content()->subtitle();

    		if($i < $timelineSubs->count()) {
    			$content .= PHP_EOL . PHP_EOL;
    		}
    	}

    	// write the file
    	f::write($filepath, $content);
	}

}