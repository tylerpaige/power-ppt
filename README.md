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

```<div id="s1" class="slide">
	<div class="content">Content for slide #s1</div>
	
	<div id="t1s1" class="slide">
		<div class="content">Content for the first slide of a tangent off slide #s1</div>	
	</div>
</div>

<div id="s2" class="slide">
    <div class="content">Content for slide #s2</div>
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
</div>```

Initialize the plugin by selecting the slideshow container and passing a selector that matches each slide. If no parameter is passed in, the default selector will be `.slide`.

```$('#container').powerPPT('.slide');```