# Kirby 3 – Subtitler

This plugin allows you to sync any content with audio or video files.

![subtitler-screenshot](https://user-images.githubusercontent.com/14079751/47035774-1ea34800-d17b-11e8-8463-cc4d959d8b29.jpg)

<br/>

## Overview

- [1. Installation](#1-installation)
- [2. Blueprint usage](#2-blueprint-usage)
- [3. Options](#3-options)
  * [3.1. Timelines](#31-timelines)
  * [3.2. Display options](#32-display-options)
  * [3.3. Storage options](#33-storage-options)
- [4. Template usage](#4-template-usage)
- [5. Crédits](#5-to-do)
- [6. License](#6-license)
- [7. Crédits](#7-credits)


#### TLDR – Just get me started 👀

- [Blueprint example](#2-blueprint-usage)
- [Template example](#4-template-usage)

<br/>

## 1. Installation

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

Coming soon.

<br/>

## 5. To-do

- [ ] Make subs resizable
- [ ] Work on template usage
  - [ ] add a `getTimeline('timeline')` method, which would be a `toStructure()` wrapper filtering the subs  
  - [ ] add a `toPercent()` method
  - [ ] add a `sToSrt()` method
  - [ ] add a field generating .vtt for all the timelines, in the page folder, `${fieldname}-${timeline}.vtt`
  - [ ] add a field generating .srt for all the timelines, in the page folder, `${fieldname}-${timeline}.srt`
  - [ ] add a `->srt('timeline')` method to get the srt file object
  - [ ] add a `->vtt('timeline')` method to get the srt file object
- [X] Write a proper README
- [X] Add a `dark` theme
- [X] Hopefully [ease the type detection](https://github.com/k-next/kirby/issues/1082)
- [X] `addEventListeners` get fired too early
- [X] Suggest to disable sorting of the structure
- [X] CSS snippet to hide the structure `add` button
- [X] Fix [L.373](https://github.com/sylvainjule/kirby-subtitler/blob/cfcb70901ab66acbcf9e813fcddd54cf841e4cf9/src/components/subtitler.vue#L373)
- [X] Update the duration on file change

<br/>

## 6. License

MIT

<br/>

## 7. Credits

- The fields synchronization has been taken from [@rasteiner](https://github.com/rasteiner/kn-map-section)'s map section. 🙏