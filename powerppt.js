(function($){ 
    $.fn.extend({
        powerPPT: function(options) {
            var defaults = {
                bgimgs: true,
                controls: false,
                loader: false,
                origin: false,
                slide: '.slide'
            }
            
            var options = $.extend(defaults, options);
            
            return this.each(function() {
                var o = options,
                    transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',
                    index,
                    cur,
                    save = null,
                    slide = o.slide,
                    slides = $(this).find(slide),
                    slideClass = slide.substr(1);
                if(o.loader != false){
                    var loader = '<div class="loader"><img src="'+o.loader+'" /><br/>img loading</div>';
                } else {
                    var loader;
                }
                    
                if(o.origin == false){ cur = $(this).find(slide).eq(0); }
                else { cur = $(this).find(o.origin); }
                $(cur).addClass('visible');
                
                if(o.controls==true){
                    var controlsMarkup = '<div id="controls"><div class="up">↑</div><div class="left">←</div><div class="right">→</div><div class="down">↓</div></div>';
                    $(this).prepend(controlsMarkup);
                    var controls = $('#controls'),
                        conUp = $(controls).children('.up'),
                        conRight = $(controls).children('.right'),
                        conDown = $(controls).children('.down'),
                        conLeft = $(controls).children('.left'),
                        manageControls = function(slide) {
                            if(slide.parent().hasClass(slideClass) == false){ $(conUp).css('visibility','hidden'); }
                            else if($(conUp).css('visibility') == 'hidden') { $(conUp).css('visibility','visible'); }
                            
                            if((slide.next().hasClass(slideClass) == false) && (slide.hasClass('jump') == false)){ $(conRight).css('visibility','hidden'); }
                            else if($(conRight).css('visibility') == 'hidden') { $(conRight).css('visibility','visible'); }
                            
                            if(slide.prev().hasClass(slideClass) == false){ $(conLeft).css('visibility','hidden'); }
                            else if($(conLeft).css('visibility') == 'hidden') { $(conLeft).css('visibility','visible'); }
                            
                            if(slide.children('.'+slideClass).length <= 0){ $(conDown).css('visibility','hidden'); }
                            else if($(conDown).css('visibility') == 'hidden') { $(conDown).css('visibility','visible'); }
                        };
                } else {
                    var manageControls = function(){ return false; };
                }
                if(o.bgimgs == true){
                    $.each(slides, function() {
                         var slide = $(this).not(o.bgignore).children('.content'),
                             img = $(slide).children('img').eq(0);
                         if(img.length > 0){
                             var url = $(img).attr('src');
                             $(img).hide();
                             $(slide).prepend(loader);
                             $(img).one('load', function(){
                                 $(slide).css("background-image", "url('"+url+"')").children('.loader').remove();
                                 $(img).remove();
                             });
                         }
                    });
                }
                
                $(document).keydown(function(event) {
                    switch (event.keyCode) {
                        case 27: //escape key
                            if(cur.attr('data-target')){ //if this slide has a target for an escape
                                save = cur, //save the current slide for reference
                                target = save.attr('data-target'); //set the target
                                cur = $(target); //make the target the current slide
                                cur.addClass('jumpIn recent').one(transitionEnd, function() {
                                	$(save).removeClass('visible');
                                    $(this).addClass('visible').removeClass('jumpIn recent');
                                });
                            } else if(save != null){ //if slide doesn't have an escape, but does have a save state (I.E. it was the target of an escape)
                                target = save;
                                save = null;
                                target.addClass('visible');
                                cur.addClass('jumpOut').one(transitionEnd, function() {
                                    $(this).removeClass('visible jumpOut recent');
                                });
                                cur = target;
                            }
                            break;
                        case 33: //pageUp, experimental
                        	if(cur.parent().hasClass(slideClass)){
                        		var parents = cur.parents('.'+slideClass), //all parent slides
                        			index = cur, //save the current slide
                        			target = parents[parents.length-1]; //determine root parent as last slide in array
	                        	$(target).addClass('visible'); //
	                        	index.addClass('slideOut recent').one(transitionEnd, function() {
                        		    $(this).removeClass('visible slideOut recent');
                        		    $(target).removeClass('slideOut recent');
                        		});
                        		cur = $(target);
	                        }
                        	break;
                        case 37: //left arrow
                            index = $(cur).siblings(slide).addBack().index(cur);
                            if(index > 0){
                                target = index-1;
                                cur = $(cur).siblings(slide).addBack().eq(target);
                                
                                $(cur).addClass('slideRight recent').one(transitionEnd, function() {
                                   $(this).addClass('visible').removeClass('slideRight recent').nextAll().removeClass('visible slideRight recent');
                                });
                                $('.recent').not(cur).removeClass('recent'); //Only most recent advance should be called "Recent"
                            }
                            break;
                        case 38: //up arrow
                            if($(cur).parent().hasClass(slideClass)){ // only ascend if the target is a slide, not the container
                                index = cur;
                                cur = cur.parent();
                                index.siblings('.content').parent().addBack().addClass('visible');
                                index.addClass('slideOut').one(transitionEnd, function() {
                                    $(this).removeClass('visible slideOut').siblings().removeClass('slideOut recent visible');
                                });
                            }
                            break;
                        case 39: //right arrow
                            index = $(cur).siblings(slide).addBack().index(cur);
                            if(index < $(cur).siblings(slide).length){
                                target = index+1; 
                                cur = $(cur).siblings(slide).addBack().eq(target);    		
                                $(cur).addClass('slideLeft recent').one(transitionEnd, function(){ 
                                    $(this).addClass('visible').removeClass('slideLeft recent').prevAll().removeClass('visible slideLeft slideRight recent');
                                }); 
                                $('.recent').not(cur).removeClass('recent');
                            } else if($(cur).hasClass('jump')) {
                                target = cur.attr('data-target');
                                cur = $(target);
                                $(cur).addClass('slideLeft recent').one(transitionEnd, function(){ 
                                    $('.visible').not(cur).removeClass('visible slideLeft slideRight recent');
                                    $(this).addClass('visible').removeClass('slideLeft recent');
                                }); 
                                $('.recent').not(cur).removeClass('recent');
                            }
                            break;
                        case 40: //down arrow
                            if($(cur).children(slide).length > 0){
                                cur = $(cur).children(slide).eq(0);
                                $(cur).addClass('slideUp').one(transitionEnd, function() {
                                    $(this).addClass('visible').removeClass('slideUp').parent('.visible').removeClass('visible');
                                });
                            }
                            break;
                    }
                    manageControls(cur);
                });
                 
                 manageControls($(cur));
                 
            });
        }
    });
})(jQuery);