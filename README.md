# Kirby Subtitler

<br>
This plugin is a tweaked structure field allowing you to sync any content you'd like with audio or video files. Suggestions welcome.

<br><br>

![subtitler-screenshot](https://user-images.githubusercontent.com/14079751/35878510-c7539eb0-0b78-11e8-9a5f-360202b1f912.jpg)

<br>


## Installation

Please note that **this field requires Kirby 2.5.8+**. There is no backward compatibility since it makes use of custom modal events introduced with this release.

Put the content of this repo in the `site/plugins` directory.  
The plugin folder must be named `subtitler` :

```
|-- site/plugins/
    |-- subtitler/
        |-- fields/
        |-- subtitler.php
```

## Blueprint usage


When using this field, you'll need to set the audio or video file to use. This is done by specifying an image field as ```src```.

Any field outputting a single image filename can be used as a source (ie. the ```select``` field, ```image```, ```quickselect```, etc.) :

```yaml
  videofile:
    label: The video that the subtitler field will use
    type: select
    options: videos
  subtitlerfield:
    label: My synchronized content
    type: subtitler
    src: videofile
    fields: 
      start:
        type: hidden
      startprop:
        type: hidden
      end:
        type: hidden
      endprop:
        type: hidden
      customfield:
        label: Content
        type: text (or any kind of field)
```

### 3. Notes :

- This field uses a HTML5 player. It detects by itself whether it's an audio or a video file. Please use widely supported formats (ie. ```.mp3``` / ```.mp4```)

- The ```start```, ```startprop```, ```end``` and ```endprop``` fields **must be specified** within the subtitler fields. They currently cannot be renamed. They can be ```hidden``` or you can display them in ```readonly```mode :

```yaml
fields: 
  start:
    label: Start time (seconds)
    type: text
    readonly: true
  startprop:
    label: Start time (progress)
    type: text
    readonly: true
  end:
    label: End time (seconds)
    type: text
    readonly: true
  endprop:
    label: End time (progress)
    type: text
    readonly: true
```

- **The structure entries can't be manually sorted**. The usual sorting option in the blueprint won't cut it either, entries are display depending on their starting time.

- Due to the number of displayed buttons, I didn't intend for this field to be used on a mobile panel. Small screens might run into issues.

- This fields isn't meant ot deal with a tremendous amount of subtitles, rather a quick solution for synchronizing a few contents on the fly and allowing to directly link field / page objects. For extensive subtitle work, nothing beats a good old ```.srt```editor.

## Front-end usage

The field can be dealt with as a regular structure field. Each entry will have a ```start```, ```startprop```, ```end``` and ```endprop``` value, formatted like this :

```yaml
start / end : 364.58745 #(number of seconds)
startprop / endprop : 0.35 #(the progress relative to the file's duration, between 0 and 1)
```

Please note that in order to retrieve the same order than in the panel, you will need to make sure that the entries are sorted by their start time :

```php
$page->subtitlerfield()->toStructure()->sortBy('start', 'asc');
```

How to deal with those depends on your use case, but here is a generic way of passing the values as an array in a ```data-attribute``` :

```php
<?php if($video = $page->videofile()->toFile()): 
      $values = [];
      foreach($page->subtitlerfield()->toStructure() as $entry) {
          array_push($values, array('start' => $entry->start(), 'end' => $entry->end()));
      } ?>
    <video data-values="<?php echo htmlspecialchars(json_encode($values)); ?>">
        <source src="<?php echo $video->url() ?>" type="<?php echo $video->mime() ?>">
    </video>
<?php endif; ?>
```

And getting them on the other side :

```javascript
var values = JSON.parse(videoElement.getAttribute('data-values'));
```

## Options

### Structure field options

The default structure field options **should** be available ( although many are not useful for the purpose of this field.
I haven't tested all of them so issues may occur, please test carefully before using in production. Any help with debugging is welcome !  


### Translate the buttons text

If your language is missing, you can easily translate the *empty state*, *reset* and *add* texts by adding it to ```fields/subtitler/translations/translations.php```.

## To do

- [ ] Fix behaviour on newly added subtitles without reloading the page (the overlap isn't detected)
- [ ] Allow custom colors
- [ ] Try to restore the currentTime on AJAX reloads (```localStorage```?)

## Credits

The field translation's method is a copy-paste of the [kirby-images](https://github.com/medienbaecker/kirby-images)' one by [medienbaecker](https://github.com/medienbaecker).
## License

MIT
