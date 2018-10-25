<?php

return array(
	'getTimeline' => function($field, $timeline) {
		$subtitles = $field->toStructure()->filter(function($child) use($timeline) {
	  		return $child->timeline() == $timeline;
	    });
	    $field = $subtitles;
	    return $field;
	},
    'toPercent' => function($field) {
    	return floatval($field->value) * 100;
    },
    'toPercentString' => function($field) {
    	return floatval($field->value) * 100 . '%';
    },
    'toSrtTime' => function($field) {
    	return Subtitler::toSrtTime($field->value);
    }
);