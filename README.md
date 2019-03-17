# Kirby 3 – Subtitler

This plugin allows you to sync any content with audio or video files.

![subtitler-screenshot](https://user-images.githubusercontent.com/14079751/47035774-1ea34800-d17b-11e8-8463-cc4d959d8b29.jpg)

<br/>

## Overview

> This plugin is completely free and published under the MIT license. However, if you are using it in a commercial project and want to help me keep up with maintenance, please consider [making a donation of your choice](https://www.paypal.me/sylvainjule) or purchasing your license(s) through [my affiliate link](https://a.paddle.com/v2/click/1129/36369?link=1170).

- [1. Installation](#1-installation)
- [2. Blueprint usage](#2-blueprint-usage)
- [3. Options](#3-options)
  * [3.1. Timelines](#31-timelines)
  * [3.2. Display options](#32-display-options)
  * [3.3. Storage options](#33-storage-options)
- [4. Template usage](#4-template-usage)
  * [4.1. How are the informations stored?](#41-how-are-the-informations-stored)
  * [4.2. Create a subtitles collections](#42-create-a-subtitles-collection)
  * [4.3. Generate and use a track file](#43-generate-and-use-a-track-file)
- [5. License](#5-license)
- [6. Credits](#6-credits)


#### TLDR – Just get me started 👀

- [Blueprint example](#2-blueprint-usage)
- [Template example](#single-language-setup)

<br/>

## 1. Installation

> If you are looking to use this field with Kirby 2, please switch to the `kirby-2` branch.

Download and copy this repository to ```/site/plugins/subtitler```

Alternatively, you can install it with composer: ```composer require sylvainjule/subtitler```

<br/>

## 2. Blueprint usage

The subtitler is a section which doesn't store any information itself. 
Instead, it provides an interface to manipulate content from other fields. Here's a basic setup of the plugin within your blueprint:

#### 2.1. Example

```yaml
columns:
  - width: 2/3
    sections:
      subtitler:
        type: subtitler
        timelines:
          mytimeline:
            id: mytimeline
            label: My timeline
            color: purple
        storage:
          src: src
          subs: subs

  - width: 1/3
    sections:
      myfields:
        type: fields
        fields:
          src:
            type: files
            max: 1
          subs:
            type: structure
            sortable: false
            fields:
              note:
                label: Note
                type: text
```

Notice the `sortable: false` for the structure field, else the section will easily be lost with the incrementation.

You should also ensure that the structure field will only contain subtitles. To do so, you can hide the `Add +` button of the field. This way, there will be no alternative to populate it other than the subtitler section.

This should be set in a custom `panel.css`:

```css
.k-field-subs .k-field-header button {
    display: none;
}
```

#### 2.2. Usage within a file page

You can use this plugin within a file page by setting it like stated above, but skipping the `src` option within the `storage` settings. The plugin will automatically detect the image of the given page.

<br/>

## 3. Options

### 3.1. Timelines

This new version handles multiple timelines for a given video / audio file, instead of having to duplicate the field.
Timelines have to be specified within the `timelines` option, an given 3 attributes :

- An `id` (will be used to divide the structure entries)
- A `label` (will be displayed within the editor)
- A `color` (will be displayed within the editor, and have to be either `blue`, `green`, `red`, `orange`or `purple`)

Here's an example with multiple timelines: 

```yaml
timelines:
  chapters:
    id: chapters
    label: Chapters
    color: purple
  links:
    id: links
    label: Links
    color: orange
  images:
    id: images
    label: Images
    color: blue
```

Labels also support multi-language syntax: 

```yaml
timelines:
  chapters:
    id: chapters
    label: 
      en: Chapters
      fr: Chapitres
    color: purple
```

### 3.2. Display options

##### • Theme

> type: `string`, default: `light`

You have two themes available, a dark and a light one. (doesn't work for now, but you'll have them pretty soon)

![subtitler-themes](https://user-images.githubusercontent.com/14079751/47035580-adfc2b80-d17a-11e8-906b-07c22669de69.jpg)

##### • Debug

> type: `boolean`, default: `false`

When set to `true`, timecodes and coordinates based on cursor position will be shown in real-time in the toolbar. Not needed unless you're trying to extend some functionality.

![subtitler-debug](https://user-images.githubusercontent.com/14079751/47035578-ad639500-d17a-11e8-8d4a-c61a72fbf584.jpg)


### 3.3. Storage options

##### • Audio / video file

The section needs to be synced with a field returning a file object to work with. 
Using a ```files``` field is required. Not only does it look nicer than a select field, but most importantly it returns both an absolute url and an id of the file:

```yaml
# subtitler section
storage:
  src: src

# fields section
src:
  type: files
  max: 1
```

> Note: You don’t need to explicitly set a ```max``` value, though it may look clearer. When confronted to a files field containing multiple files, the plugin will always use the first one.

##### • Subtitles structure

The plugin needs an associated structure field to store the subtitles informations. It has 5 reserved fields that shouldn't be used for any other purpose: `timeline`, `start`, `startprop`,`end` and `endprop`. Those will be automatically set and don't need to be explicitely specified unless you want to show them within the panel:

![subtitler-fields](https://user-images.githubusercontent.com/14079751/47036031-d6d0f080-d17b-11e8-8efe-b8a0f2957930.jpg)

```yaml
# subtitler section
storage:
  subs: subs

# fields section
subs:
  type: structure
  fields:
    timeline:
      label: 'Timeline'
      type: text
    start:
      label: 'Start'
      type: text
    startprop:
      label: 'Start (%)'
      type: text
    end:
      label: 'End'
      type: text
    endprop:
      label: 'End (%)'
      type: text
```

Otherwise, you can directly start adding fields you'd like to sync content with:

![subtitler-notes](https://user-images.githubusercontent.com/14079751/47036032-d6d0f080-d17b-11e8-839f-c47089b49d76.jpg)


```yaml
# subtitler section
storage:
  subs: subs

# fields section
subs:
  type: structure
  fields:
    mynote:
      label: 'Note'
      type: text
```

<br/>

## 4. Template usage

There are different ways to use the subtitles, depending on your use case. You could, for example, send them as `json` to a Javascript app. Or, you could make use of some simple helpers shipped with the plugin to use them directly in your templates:

### 4.1. How are the informations stored?

Each entry will have a `start`, `startprop`, `end` and `endprop` value, formatted like this:

```yaml
start / end : 364.58745  # (number of seconds)
startprop / endprop : 0.35  # (the progress relative to the file's duration, between 0 and 1)
# + all your custom field
```

### 4.2. Create a subtitles collections

Subtitles are stored in a structure field. 
If you have a single timeline, you can create a collection with the ```toStructure()``` method to access them:

```php
foreach($page->mysubtitles()->toStructure() as $subtitle) {
    // do something
}
```

When dealing with multiple timelines, you either need to filter them manually or call the `getTimeline` method, which is a `toStructure` wrapper providing filtering by timeline. Use it this way:

```php
foreach($page->mysubtitles()->getTimeline('timelinekey') as $subtitle) {
    // do something
}
```

### 4.3. Generate and use a track file

#### • Creating the tracks

The plugin provides a simple way to generate [WebVTT files](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API), which can later be added in your html `<track>` tags. 

First, make sure that the field used to get the subtitles' content is called `subtitle`, else the plugin won't know where to look for the text:

```
subs:
  label: Subtitles
  type: structure
  fields:
    subtitle:
      label: Content
      type: text
```

Then, include the `tracksbuilder` field on your page, which is basically a button generating the `.vtt` files on request (stored in the page's folder).

```yaml
mytracks:
  label: Generate tracks
  type: tracksbuilder
  src: subs # (key of the structure field containing the subtitles)
```

The output will look like:

```yaml
# if single language
${fieldname}-${timeline}.vtt # (content/my/page/subs-notes.vtt)

# if multi-language
${fieldname}-${timeline}-${languageCode}.vtt # (content/my/page/subs-notes-en.vtt)
```

You are now able to get them easily by calling `->vtt('timeline')` on the subtitles structure field (example below).


#### • Single language setup

Once your `.vtt` files have been created, you can [include them](https://developer.mozilla.org/en-US/docs/Web/Apps/Fundamentals/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video) in your `video` tag.
Here is a basic example, using a timeline called `notes`:

```php
<?php // we make sure that the video file exists
      if($video = $page->src()->toFile()): ?>
<video id="video" controls preload="metadata">
   <source src="<?php echo $video->url() ?>" type="<?php echo $video->mime() ?>">
   
   <?php // we make sure that the .vtt file exists
         if($track = $page->subs()->vtt('notes')): ?>
   <track label="English" kind="subtitles" srclang="en" src="<?php echo $track->url() ?>" default>
   <?php endif; ?>
</video>
<?php endif; ?>

```

#### • Multi-language setup

Multi-language setup is pretty much the same, except we need to put the `track` tag within a loop and set the desired languages explicitely:

```php

<?php // we make sure that the video file exists
      if($video = $page->src()->toFile()): ?>
<video id="video" controls preload="metadata">
    <source src="<?php echo $video->url() ?>" type="<?php echo $video->mime() ?>">
    
    <?php // we loop through every language
          foreach($kirby->languages() as $language): ?>
        <?php // we make sure that the .vtt file exists
              if($track = $page->subs()->vtt('notes', $language->code())): ?>
        <track label="<?php echo $language->name() ?>" kind="subtitles" srclang="<?php echo $language->code() ?>" src="<?php echo $track->url() ?>" default>
        <?php endif; ?>
    <?php endforeach; ?>
</video>
<?php endif; ?>

```

<br/>

## 5. License

MIT

<br/>

## 6. Credits

- The fields synchronization has been taken from [@rasteiner](https://github.com/rasteiner/kn-map-section)'s map section. 🙏