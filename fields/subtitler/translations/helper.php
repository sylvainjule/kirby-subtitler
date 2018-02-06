<?php 

function subtitlerTranslation($string) {
    
    $subtitlerTranslations = require __DIR__ . DS . 'translations.php';
    $language = substr(site()->user()->language(), 0, 2 );
    if (!array_key_exists($language, $subtitlerTranslations)) {
      $language = 'en';
    }
    $subtitlerTranslation = $subtitlerTranslations[$language];
    
    if(array_key_exists($string, $subtitlerTranslation)) {
      $string = $subtitlerTranslation[$string];
    }
    return $string;
    
}