// ==================================
// ========== KNOWN ISSUES ==========
// - Formatting issues for centering and captions
// - Scrolling impossible (confused for nextTan swipe)
//     - Maybe touch commands use two fingers?

(function($){ 
    $.fn.extend({
        powerPPT: function(options) {
            var defaults = {
                bgignore: '.text',
                controls: false,
                loader: 'assets/img/loader-white.gif',
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
                    slideClass = slide.substr(1),
                    loader = '<div class="loader"><img src="'+o.loader+'" /><br/>img loading</div>';
                    
                if(o.loader != false){ //download the loader image first
                    function loaded() { console.log('loaded the loader'); }
                    loadImg = new Image();
                    loadImg.src = o.loader;
                    loadImg.onLoad = loaded();
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
                        conLeft = $(controls).children('.left');
                    function manageControls(slide) {
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
                    function manageControls() {
                        return false;
                    };
                }
                
                $.each(slides, function() {
                     var slide = $(this).not(o.bgignore).children('.content'),
                         img = $(slide).children('img').eq(0);
                     console.log(o.bgignore);
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
                
                function nextSlide() {
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
                };
                function prevSlide() {
                    console.log('prevSlide');
                    index = $(cur).siblings(slide).addBack().index(cur);
                    if(index > 0){
                        target = index-1;
                        cur = $(cur).siblings(slide).addBack().eq(target);
                        
                        $(cur).addClass('slideRight recent').one(transitionEnd, function() {
                           $(this).addClass('visible').removeClass('slideRight recent').nextAll().removeClass('visible slideRight recent');
                        });
                        $('.recent').not(cur).removeClass('recent'); //Only most recent advance should be called "Recent"
                    }
                };
                function nextTan() {
                    if($(cur).children(slide).length > 0){
                        cur = $(cur).children(slide).eq(0);
                        $(cur).addClass('slideUp').one(transitionEnd, function() {
                            $(this).addClass('visible').removeClass('slideUp').parent('.visible').removeClass('visible');
                        });
                    }
                };
                function prevTan() {
                    if($(cur).parent().hasClass(slideClass)){ // only ascend if the target is a slide, not the container
                        index = cur;
                        cur = cur.parent();
                        index.siblings('.content').parent().addBack().addClass('visible');
                        index.addClass('slideOut').one(transitionEnd, function() {
                            $(this).removeClass('visible slideOut').siblings().removeClass('slideOut recent visible');
                        });
                    }
                };
                if("ontouchstart" in window == true){ //if it's a touchscreen
                    $('#container').swipe({
                        swipe:function(event, direction, distance, duration, fingerCount){
                            console.log('swipe detected:', direction, fingerCount);
                            if(fingerCount > 1){ //don't confuse with one finger scrolling
                                switch (direction) {
                                    case 'left':
                                        nextSlide();
                                        break;
                                    case 'right':
                                        prevSlide();
                                        break;
                                    case 'up':
                                        nextTan();
                                        break;
                                    case 'down':
                                        prevTan();
                                        break;
                                }
                                manageControls(cur);
                            } else {
                                return false;
                            }
                        }
                    });
                } else {
                    $(document).keydown(function(event) {
                        switch (event.keyCode) {
                            case 27: //escape key
                                if(cur.hasClass('esc')){ //if this slide has a target for an escape
                                    save = cur, //save the current slide for reference
                                    target = save.attr('data-target'); //set the target
                                    cur = $(target); //make the target the current slide
                                    cur.addClass('visible');
                                    save.addClass('slideOut').one(transitionEnd, function() {
                                        $(this).removeClass('visible slideOut recent');
                                    });
                                } else if(save != null){ //if slide doesn't have an escape, but does have a save state (I.E. it was the target of an escape)
                                    target = save;
                                    save = null;
                                    target.addClass('visible');
                                    cur.addClass('slideOut').one(transitionEnd, function() {
                                        $(this).removeClass('visible slideOut recent');
                                    });
                                    cur = target;
                                }
                                break;
                            case 37: //left arrow
                                prevSlide();
                                break;
                            case 38: //up arrow
                                prevTan();
                                break;
                            case 39: //right arrow
                                nextSlide();
                                break;
                            case 40: //down arrow
                                nextTan();
                                break;
                        }
                        manageControls(cur);
                    });
                }
                 
                manageControls($(cur));
                 
            });
        }
    });
})(jQuery);