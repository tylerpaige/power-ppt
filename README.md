# PowerPPT

This is a pretty simple way to create a multi-directional "Powerpoint" slideshow. Its purpose to allow for tangents in format that is fairly linear. While a normal slide show progresses from Slide #1 to #2 to #3 in a linear progression, this jQuery plugin allows the user to go on a tangent off a slide.

In this way, a user has two basic options at every slide: to progress linearly along the same trajectory (i.e. to advance to the "next" slide), or to go off on a tangent. If the user goes off on a tangent, they can then either follow that tangent or go off on another tangent.

This tool hopes to utilize the slideshow format for a more free-flow thought process.

## Controls
The live slideshow is controlled using the arrow keys. 

### Advancing
- **→** will advance the slideshow on a continuous linear progression. If the user is on a tangent, pressing **→** will continue down that tangent.
- **↓** will take the slideshow on a tangent off the current slide. If a user is on a tangent, pressing **↓** will go off on a new tangent.

### Backtracking
- **←** will take the slideshow to previous slide in the continuous linear progression. 
- **↑** will take the slideshow to last point of departure. If a user is on a tangent, pressing **↑** will return to the origin of the tangent.

## Usage
*Usage isn't exactly the most friendly right now...*

Using this plugin (ironically) relies on a pretty strict structure. Please use `<div>`s or equivalent block element to contain slides, not list items.


``` html
<div id="s1" class="slide">
	<div class="content">Content for slide #s1</div>
	
	<div id="t1s1" class="slide">
		<div class="content">Content for the first slide of a tangent off slide #s1</div>	
	</div>
</div>

<div id="s2" class="slide">
    <div class="content">
        <p>Content for slide #s2</p>
        <div class="caption">A basic caption for this slide</div>
    </div>
</div>

<div id="s3" class="slide">
    <div class="content">Content for slide #s3</div>
    
    <div id="t1s3" class="slide">
    	<div class="content">Content for the first slide of a tangent off slide #s3</div>	
    	
    	<div id="t1t1s3" class="slide">
    	    <div class="content">Content for a tangent off a tangent off slide #s3</div>
    	</div>
    </div>
    
    <div id="t2s3" class="slide">
        <div class="content">Content for the linear progression of the tangent off slide #s3</div>
    </div>
</div>

<div id="s4" class="slide">
    <div class="content">
        <h1>Centered text for slide #s4</h1>
        <img src="images/bg.jpg"/> <!-- This image will be made the slide's background, unless the bgimgs option is set to false -->
    </div>
</div>
```


Initialize the plugin by selecting the slideshow container and passing a selector that matches each slide. If no parameter is passed in, the default selector will be `.slide`.

``` js
$('#container').powerPPT('.slide');
```

## Options
- `option` : description
	- **defaultValue**
	- _possible value_
	
- `bgimgs` : if an `<img>` element is found in the slide's content, make that image the slide's background image
    - **true**
    - *false*
- `controls` : display a 4-arrow indicator depending on what directions a user can navigate from the current slide
    - **false**
    - **true** (not totally smooth yet)
- `loader` : loader image for slides that are still downloading images
    - **false**
    - _path/to/image.gif_
- `origin` : manually choose which slide is the "starting" slide if it should be something other than the first in the DOM
    - **false** (i.e. the first slide in the DOM)
    - _jQuery selector_ (e.g. `#start`)
- `slide` : jQuery selector for all slides in the slideshow
    - **.slide**
    - _jQuery selector_ (e.g. `.box`)
    
## Style Options
I've included a few styles you can use for your slides. [Check out the demo](http://tylerpaige.com/secrets/powerppt/example/) to see a demonstration of each style.

- Background image styles
    - Unless you've set the `bgimgs` option to false, powerPPT will make an `img` element in the `.content` the slide's background image. 
    - These classes will control the image's fitting when applied to the `.content`
    - default: image centered in the middle of the frame
    - `.fill` or `.cover`: enlarge the image until it covers the entire frame
    - `.stretch` or `.contain`: enlarge the image until one dimension of the image matches the window's dimension
- Text styles: classes that change the appearance of text when applied to the `.content` element
    - `.white`: white text
    - `.yellow`: yellow text
    - `.outline`: give 1px outline to text (white outline for black text, black outline for white/yellow text)
    - `.yellowOutline`: yellow outline
    - `.shadow`: add a subtle dropshadow to the text
- Text position formatting
    - Default: horizontally and vertically centered, black
    - `.text`: allows the text to scroll vertically. *Apply the entire slide, not just the content*
- Captions: classes for an element `.caption` **in** the `.content` element
    - Default: aligned to bottom of frame, centered, black. All text styles can be applied specifically to a caption.
    - `.gradient`: applies a black-to-transparent background gradient to the caption
    - `.whiteGradient`: same as above, but with a white gradient
    - `.block`: applies a solid white background the caption