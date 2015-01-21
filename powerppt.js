(function($){;
  $.fn.extend({
    powerPPT: function(options) {
      var defaults = {
        bgImgs       : false,
        bgIgnore     : '.ignore',
        controlPad   : false,
        hotSpotCtrls : true,
        loader       : false,
        origin       : false,
        slide        : '.slide'
      }

      var options = $.extend(defaults, options);

      return this.each(function() {
        var ppt = this, //the container
        o = options, //merged options
        transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend animationEnd webkitAnimationEnd MSAnimationEnd oAnimationEnd',
        index,
        cur, //currently displayed slide
        save = null, //saved slide for jumps
        slideSlctr = o.slide, //slide selector
        slideClass = slideSlctr.substr(1), //slide class name
        slides = $(ppt).find(slideSlctr), //array of all slides
        loader; //will be markup for a image loading bar

        //If enabled, create markup for loading bar
        if(o.loader != false){
          var loader = ''+
          '<div class="loader">'+
          '<img src="'+o.loader+'" />'+
          '<br/>img loading'+
          '</div>';
        }

        //If enable, set the starting position to the specified slide
        if(o.origin == false){
          cur = $(ppt).find(slideSlctr).eq(0);
        } else {
          cur = $(ppt).find(o.origin);
        }
        $(cur).addClass('visible');

        //If enabled, overlay the controlPad
        var manageControlPad;
        if(o.controlPad == true){
          var controlPadMarkup = ''+
          '<div id="controlPad">'+
            '<div class="up">↑</div>'+
            '<div class="left">←</div>'+
            '<div class="right">→</div>'+
            '<div class="down">↓</div>'+
          '</div>';
          $(ppt).prepend(controlPadMarkup);

          var controlPad = $('#controlPad'),
              upArrow = $(controlPad).children('.up'),
              downArrow = $(controlPad).children('.down'),
              rightArrow = $(controlPad).children('.right'),
              leftArrow = $(controlPad).children('.left');

          $(upArrow).click(function() {
            cur = slideUp(cur);
            manageControlPad(cur);
          });
          $(downArrow).click(function() {
            cur = slide(cur, 'down');
            manageControlPad(cur);
          });
          $(rightArrow).click(function() {
            cur = slide(cur, 'right');
            manageControlPad(cur);
          });
          $(leftArrow).click(function() {
            cur = slide(cur, 'left');
            manageControlPad(cur);
          });

          manageControlPad = function(slide) {
            //toggle up arrow
            if(slide.parent().hasClass(slideClass) == false){ $(upArrow).css('visibility','hidden'); }
            else if($(upArrow).css('visibility') == 'hidden') { $(upArrow).css('visibility','visible'); }
            //toggle bottom arrow
            if(slide.children('.'+slideClass).length <= 0){ $(downArrow).css('visibility','hidden'); }
            else if($(downArrow).css('visibility') == 'hidden') { $(downArrow).css('visibility','visible'); }
            //toggle right arrow
            if((slide.next().hasClass(slideClass) == false) && (slide.hasClass('jump') == false)){ $(rightArrow).css('visibility','hidden'); }
            else if($(rightArrow).css('visibility') == 'hidden') { $(rightArrow).css('visibility','visible'); }
            //toggle left arrow
            if(slide.prev().hasClass(slideClass) == false){ $(leftArrow).css('visibility','hidden'); }
            else if($(leftArrow).css('visibility') == 'hidden') { $(leftArrow).css('visibility','visible'); }
          }
        } else {
          manageControlPad = function(){ }
        }

        //if enabled, create clickable hotspots for users to advance the slideshow
        if(o.hotSpotCtrls) {
          var locs = ['up', 'down', 'right', 'left'];
          for(var i = 0; i < locs.length; i++) {
            var direction = locs[i];
            var elm = document.createElement('div');
            elm.className = 'hotspot '+direction;
            $(ppt).prepend(elm);
          }
          $('.hotspot.up').click(function() {
            cur = slideUp(cur);
            manageControlPad(cur);
          });
          $('.hotspot.down').click(function() {
            cur = slide(cur, 'down');
            manageControlPad(cur);
          });
          $('.hotspot.right').click(function() {
            cur = slide(cur, 'right');
            manageControlPad(cur);
          });
          $('.hotspot.left').click(function() {
            cur = slide(cur, 'left');
            manageControlPad(cur);
          });
        }

        //if enabled, give slides with images a background-image
        if(o.bgImgs == true){
          $.each(slides, function() {
            var i = $(this).not(o.bgIgnore).children('.content'),
            img = $(i).children('img').eq(0);
            if(img.length > 0){
              var url = $(img).attr('src');
              $(img).hide();
              $(i).prepend(loader);
              $(img).one('load', function(){
                $(i).css("background-image", "url('"+url+"')").children('.loader').remove();
                $(img).remove();
              });
            }
          });
        }

        function clearClasses(slide, animation) {
          $(slide)
            .addClass('visible')
            .removeClass(animation + ' recent')
            .nextAll();
          $('.visible').not(slide)
            .removeClass('visible');
        }

        function declareRecent(slide) {
          $('.recent').removeClass('recent');
          $(slide).addClass('recent');
        }

        function slide(slide, direction) {
          var targets,
              target,
              animation;
          switch(direction) {
            case 'right':
              targets = $(slide).nextAll(slideSlctr);
              animation = 'slideRight';
              break;
            case 'left':
              targets = $(slide).prevAll(slideSlctr);
              animation = 'slideLeft';
              break;
            case 'down':
              targets = $(slide).children(slideSlctr);
              animation = 'slideDown';
              break;
          }
          if(targets.length > 0) {
            target = targets.eq(0);
            $(target)
              .addClass(animation)
              .one(transitionEnd, function(){
                clearClasses(target, animation)
              });
            declareRecent(target);
            return target;
          } else {
            return slide;
          }
        }

        //This one's gotta work a little differently...
        function slideUp(slide) {
          var parent = $(slide).parent(),
              target;
          if($(parent).hasClass(slideClass)) {
            target = $(slide).siblings('.content');
            $(target)
              .addClass('slideUp')
              .one(transitionEnd, function() {
                $(slide).removeClass('visible');
                $(parent).addClass('visible');
                $(target).removeClass('slideUp recent');
              });
            declareRecent(target);
            return parent;
          } else {
            return slide;
          }
        }

        $(document).keydown(function(event) {
          switch(event.keyCode) {
            case 39: //right arrow
              cur = slide(cur, 'right');
              break;
            case 37: //left arrow
              cur = slide(cur, 'left');
              break;
            case 40: //down arrow
              cur = slide(cur, 'down')
              break;
            case 38: //up arrow
              cur = slideUp(cur);
              break;
          }
          manageControlPad(cur);
        });

        manageControlPad(cur);
      });
    }
  });
})(jQuery);
