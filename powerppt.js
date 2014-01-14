(function($){ 
   $.fn.powerPPT = function(slide) {
       if(!slide){ slide='.slide'; }
           
       var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',
           index,
           cur = $(this).children(slide).eq(0),
           slideClass = slide.substr(1);
       
           
       $(cur).addClass('visible');
       
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
                index = cur;
                cur = cur.parent();
                index.siblings('.content').parent().addBack().addClass('visible');
                index.addClass('slideOut').one(transitionEnd, function() {
                    $(this).removeClass('visible slideOut').siblings().removeClass('slideOut recent visible');
                });
            }
        });
   } 
})(jQuery);