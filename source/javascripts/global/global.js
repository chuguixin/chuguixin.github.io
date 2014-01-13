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
})
