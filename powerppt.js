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
                            if(slide.parent().hasClass(slideClass) == false){ $(conUp).fadeOut(); }
                            else if($(conUp).is(':hidden')) { $(conUp).fadeIn(); }
                            
                            if(slide.next().hasClass(slideClass) == false){ $(conRight).fadeOut(); }
                            else if($(conRight).is(':hidden')) { $(conRight).fadeIn(); }
                            
                            if(slide.prev().hasClass(slideClass) == false){ $(conLeft).fadeOut(); }
                            else if($(conLeft).is(':hidden')) { $(conLeft).fadeIn(); }
                            
                            if(slide.children('.'+slideClass).length <= 0){ $(conDown).fadeOut(); }
                            else if($(conDown).is(':hidden')) { $(conDown).fadeIn(); }
                        };
                } else {
                    var manageControls = function(){ return false; };
                }
                if(o.bgimgs == true){
                    $.each(slides, function() {
                         var slide = $(this).children('.content'),
                             img = $(slide).children('img');
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
                
                 keypress.combo('right', function() {
                     index = $(cur).siblings(slide).addBack().index(cur);
                     if(index < $(cur).siblings(slide).length){
                         target = index+1; 
                         cur = $(cur).siblings(slide).addBack().eq(target);    		
                         $(cur).addClass('slideLeft recent').one(transitionEnd, function(){ 
                             $(this).addClass('visible').removeClass('slideLeft recent').prevAll().removeClass('visible slideLeft slideRight recent');
                         }); 
                         $('.recent').not(cur).removeClass('recent');
                     }
                     manageControls($(cur));
                 });
                 keypress.combo('left', function() {
                     index = $(cur).siblings(slide).addBack().index(cur);
                     if(index > 0){
                         target = index-1;
                         cur = $(cur).siblings(slide).addBack().eq(target);
                         
                         $(cur).addClass('slideRight recent').one(transitionEnd, function() {
                            $(this).addClass('visible').removeClass('slideRight recent').nextAll().removeClass('visible slideRight recent');
                         });
                         $('.recent').not(cur).removeClass('recent'); //Only most recent advance should be called "Recent"
                     }
                     manageControls($(cur));
                 });
                 keypress.combo('down', function() {
                     if($(cur).children(slide).length > 0){
                         cur = $(cur).children(slide).eq(0);
                         $(cur).addClass('slideUp').one(transitionEnd, function() {
                             $(this).addClass('visible').removeClass('slideUp').parent('.visible').removeClass('visible');
                         });
                     }
                     manageControls($(cur));
                 });
                 keypress.combo('up', function() {
                     if($(cur).parent().hasClass(slideClass)){ // only ascend if the target is a slide, not the container
                         index = cur;
                         cur = cur.parent();
                         index.siblings('.content').parent().addBack().addClass('visible');
                         index.addClass('slideOut').one(transitionEnd, function() {
                             $(this).removeClass('visible slideOut').siblings().removeClass('slideOut recent visible');
                         });
                         manageControls(cur);
                     }
                    
                 });
                 
                 manageControls($(cur));
                 
            });
        }
    });
})(jQuery);