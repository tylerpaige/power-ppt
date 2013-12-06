(function($){ 
   $.fn.powerPPT = function(container, slide) {
       var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',
           index,
           cur = $(container).children(slide).eq(0),
           slideClass = slide.substr(1);
           
       $(cur).addClass('visible');
       
       keypress.combo('right', function() {
       	index = $(cur).siblings(slide).addBack().index(cur);
       	if(index < $(cur).siblings(slide).length){
       		target = index+1; 
       		cur = $(cur).siblings(slide).addBack().eq(target);    		
           	$(cur).addClass('slideLeft recent').one(transitionEnd, function(){ //when this one finished moving
           	    //The trick here is to not use $(cur) as a selector, as this variable may be updated before the transition end
           	    //Also, only affect the previous slides
           	    //You could perhaps be more specific and say, prevAll('.slideLeft')
           	    $(this).addClass('visible').removeClass('slideLeft recent').prevAll().removeClass('visible slideLeft slideRight recent'); //remove the animation class, add visible class, make sure nothing else is visible
           	}); 
           	$('.recent').not(cur).removeClass('recent');
           }
       });
       keypress.combo('left', function() {
           index = $(cur).siblings(slide).addBack().index(cur);
           if(index > 0){
               target = index-1;
               cur = $(cur).siblings(slide).addBack().eq(target);
               
               $(cur).addClass('slideRight recent').one(transitionEnd, function() {
                   //so you hit left, and the newest current slide gets assigned this event
                   //When it's done moving, make it visible, then remove it's animation classes
                   //Also when it's done moving, remove all the animation and visible classes from the slides that were already advanced
                   $(this).addClass('visible').removeClass('slideRight recent').nextAll().removeClass('visible slideRight recent');
               });
               $('.recent').not(cur).removeClass('recent'); //Only most recent advance should be called "Recent"
           }
       });
       keypress.combo('down', function() {
           if($(cur).children(slide).length > 0){
               cur = $(cur).children(slide).eq(0);
               $(cur).addClass('slideUp').one(transitionEnd, function() {
                   $(this).addClass('visible').removeClass('slideUp').parent('.visible').removeClass('visible');
               });
           }
       });
       keypress.combo('up', function() {
           if($(cur).parent().hasClass(slideClass)){ // only ascend if the target is a slide, not the container
               $(cur).siblings('.content').addClass('slideDown').one(transitionEnd, function(){
                   $(cur).parent().addClass('visible');
                   $(cur).removeClass('visible');
                   $(cur).siblings('.content').removeClass('slideDown');  
                   cur = $(cur).parent(); //Reset after animation end so you don't mess up the selectors
               });
           }
       });
   } 
})(jQuery);