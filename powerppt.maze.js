(function($){ 
   $.fn.powerPPT = function(slide) {
       if(!slide){ slide='.slide'; }
           
       var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',
           index,
           cur = $(this).children(slide).eq(0),
           slideClass = slide.substr(1);
           
       $(cur).addClass('visible');
       
       
        keypress.combo('right', function() {
            var target = $(cur).next();
            
            if((target.hasClass('right')) && (cur.hasClass('left'))){ console.log('Structural error'); return false;}
            else if(target.hasClass('right')) { cur = target; }
            else if(cur.hasClass('left')) { cur = cur.prev(); }
            else { return false; }
            
            $(cur).addClass('slideLeft recent').one(transitionEnd, function(){ 
                $(this).addClass('visible').removeClass('slideLeft recent').prevAll().removeClass('visible slideLeft slideRight recent');
            }); 
            $('.recent').not(cur).removeClass('recent');
        });
        keypress.combo('left', function() {
            var target = $(cur).next();
            
            if((target.hasClass('left')) && ($(cur).hasClass('right'))){ console.log('Structural error'); return false; }
            else if(target.hasClass('left')) { cur = target; }
            else if(cur.hasClass('right')) { cur = $(cur).prev(); }
            else { return false; }
            
            $(cur).addClass('slideRight recent').one(transitionEnd, function() {
                $(this).addClass('visible').removeClass('slideRight recent').nextAll().removeClass('visible slideRight recent');
            });
            $('.recent').not(cur).removeClass('recent');
        });
        keypress.combo('down', function() {
            var target = $(cur).next();
            
            if((target.hasClass('down')) && (cur.hasClass('up'))){ console.log('Structural error'); return false; }
            else if(target.hasClass('down')) { cur = target; }
            else if(cur.hasClass('up')) { cur = cur.prev(); }
            else { return false; }
            
            $(cur).addClass('slideUp').one(transitionEnd, function() {
                $(this).addClass('visible').removeClass('slideUp').siblings('.visible').removeClass('visible');
            });
        });
        keypress.combo('up', function() {
            var target = $(cur).next();
            
            if(target.hasClass('up') && cur.hasClass('down')){ console.log('Structural error'); return false; }
            else if(target.hasClass('up')) { cur = target; }
            else if(cur.hasClass('down')) { cur = $(cur).prev(); }
            else { return false }
            
            $(cur).addClass('slideDown').one(transitionEnd, function() {
                $(this).addClass('visible').removeClass('slideDown').siblings().removeClass('visible');
            });
        });
   } 
})(jQuery);