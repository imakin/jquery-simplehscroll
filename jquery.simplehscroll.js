/*global jQuery */
/*!
 * jQuery Simple H Scroll
 * (c) 2018 Muhammad Izzulmakin <makin.public@gmail.com>
 * MIT Licensed.
 *
 */

(function($) {
$.fn.simplehscroll = function(config) {
    //default config
    var defConfig = {
        viewSelector: 'div', //the viewElement which has fixed width and overflow hidden
        itemContainerSelector: 'ul', // the container of list element, width will be calculated based on number of listItem element
        itemSelector:'li', // the items in the selector
        animationTime: 500,
        fillItems: false, //add to items so total number of items modulo shown item is 0
    };

    config = $.extend(defConfig, config);

    return this.each(function() {
        var wrapper = $(this),
            viewElement = $(this).children(config.viewSelector),
            itemContainterElement,
            itemElements,
            animInProgress = false;

        itemContainterElement = viewElement.children(config.itemContainerSelector + ':first-child');
        lastLi = itemContainterElement.children(config.itemSelector + ':last-child');
        lastLi.attr("data-simplehscroll-pos", "last");

        

        var itemCount = itemContainterElement.find(config.itemSelector).length; // number of li
        var itemWidth = itemContainterElement.find(config.itemSelector).eq(0).width(); // width of each li
        // make item container element to put all item in horizontal
        itemContainterElement.width(itemWidth*itemCount);
        viewElement.css("overflow","hidden");

        wrapper.bind("forward", function(event, repeat) {
            if (animInProgress) return;
            animInProgress = true;
            
            var itemCount = itemContainterElement.find(config.itemSelector).length; // number of li
            var itemWidth = itemContainterElement.find(config.itemSelector).eq(0).width(); // width of each li
            var itemVisible = Math.floor(viewElement.width()/itemWidth); // number of li visible
            
            var newScroll = viewElement.scrollLeft() + itemWidth*itemVisible;
            var maxScroll = itemWidth*itemCount - viewElement.width();

            if (viewElement.scrollLeft()==maxScroll) {
                newScroll = 0;
            }
            viewElement.animate({
                scrollLeft: newScroll
                },config.animationTime, function() {
                    animInProgress = false;
                    if (repeat) {
                        repeat = repeat - 1;
                        if (repeat>0) {
                            wrapper.trigger("forward", repeat);
                        }
                    }
                }
            );
        });

        wrapper.bind("backward", function(event, repeat) {
            if (animInProgress) return;
            animInProgress = true;

            var itemCount = itemContainterElement.find(config.itemSelector).length; // number of li
            var itemWidth = itemContainterElement.find(config.itemSelector).eq(0).width(); // width of each li
            var itemVisible = Math.floor(viewElement.width()/itemWidth); // number of li visible
            
            var newScroll = viewElement.scrollLeft() - itemWidth*itemVisible;
            var maxScroll = itemWidth*itemCount - viewElement.width();

            if (viewElement.scrollLeft()==0) {
                newScroll = maxScroll+1;
            }

            viewElement.animate({
                scrollLeft: newScroll
                },config.animationTime, function() {
                    animInProgress = false;
                    if (repeat) {
                        repeat = repeat - 1;
                        if (repeat>0) {
                            wrapper.trigger("forward", repeat);
                        }
                    }
                }
            );
        });
        viewElement.scrollLeft(0);
        
    });
};
}(jQuery));
