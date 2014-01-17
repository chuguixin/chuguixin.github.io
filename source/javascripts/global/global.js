$(function() {
    $('.subtitleItem').each(function(index, dom) {
        var $dom = $(dom);
        var deg = Math.random() * 360;
        $dom.css({
            "-moz-transform": 'rotate(' + deg + 'deg)',
            "-webkit-transform": 'rotate(' + deg + 'deg)',
            "-o-transform": 'rotate(' + deg + 'deg)',
            "-ms-transform": 'rotate(' + deg + 'deg)',
            "transform": 'rotate(' + deg + 'deg)'
        });
    });
    $('.subtitleItem').on({
        "mouseenter": function() {
            var deg = 0;
            var $this = $(this);
            $this.animate({
                    fontSize: 0
                },
                "normal", function() {
                    $this.css({
                        "-moz-transform": 'rotate(' + deg + 'deg)',
                        "-webkit-transform": 'rotate(' + deg + 'deg)',
                        "-o-transform": 'rotate(' + deg + 'deg)',
                        "-ms-transform": 'rotate(' + deg + 'deg)',
                        "transform": 'rotate(' + deg + 'deg)'
                    });
                    $this.animate({
                            fontSize: '1em'
                        },
                        "normal", function() {

                        });
                });
        }
    });
});


$(window).load(function() {
    $('#fullScreenBgSlider').nivoSlider({
        effect: 'random', // Specify sets like: 'fold,fade,sliceDown'
        slices: 15, // For slice animations
        boxCols: 8, // For box animations
        boxRows: 1, // For box animations
        animSpeed: 500, // Slide transition speed
        pauseTime: 3000, // How long each slide will show
        startSlide: 0, // Set starting Slide (0 index)
        directionNav: true, // Next & Prev navigation
        controlNav: false, // 1,2,3... navigation
        controlNavThumbs: false, // Use thumbnails for Control Nav
        pauseOnHover: true, // Stop animation while hovering
        manualAdvance: false, // Force manual transitions
        prevText: 'Prev', // Prev directionNav text
        nextText: 'Next', // Next directionNav text
        randomStart: false, // Start on a random slide
        beforeChange: function() {}, // Triggers before a slide transition
        afterChange: function() {}, // Triggers after a slide transition
        slideshowEnd: function() {}, // Triggers after all slides have been shown
        lastSlide: function() {}, // Triggers when last slide is shown
        afterLoad: function() {} // Triggers when slider has loaded
    });
});
