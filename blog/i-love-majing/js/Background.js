(function() {
    function Background(cfg) {
        for (var key in cfg) {
            this[key] = cfg[key];
        }
        this.init();
    }

    Background.prototype = {

        space: 15,

        data: null,

        exploded: false,

        init: function() {
            this.nodes = [];
            var daysCountArray = calDays().toString().split('');
            this.createNodes(MAJING, 50, 50);
            this.createNodes(ILOVEYOU, 50 + 70, 50 + 160);
            this.createNodes(FOR, 50 + 70, 50 + 460);
            this.createNodes(NUMS[daysCountArray[0]], 50 + 370, 50 + 460);
            this.createNodes(NUMS[daysCountArray[1]], 50 + 450, 50 + 460);
            this.createNodes(NUMS[daysCountArray[2]], 50 + 530, 50 + 460);
            this.createNodes(DAYS, 50 + 670, 50 + 460);

            this.fullNodes = [];

            this.img = document.createElement("canvas");
            this.img.width = canvas.width;
            this.img.height = canvas.height;
            var ctx = this.img.getContext("2d");
            ctx.fillStyle = "#1DC7AA";
            for (var i = this.nodes.length - 1; i >= 0; i--) {
                var node = this.nodes[i];
                ctx.fillRect(node.x, node.y, 9, 9);
            }
        },

        createNodes: function(text, ox, oy) {
            var Me = this;
            text.forEach(function(row, r) {
                row.forEach(function(col, c) {
                    if (col === 9) {
                        Me.nodes.push({
                            x: Me.space * c + ox,
                            y: Me.space * r + oy,
                            f: 0
                        })
                    }
                })
            })
        },

        update: function(dt) {
            for (var i = this.nodes.length - 1; i >= 0; i--) {
                var node = this.nodes[i];
                if (node.f) {
                    this.fullNodes.push(node);
                    this.nodes.splice(i, 1);
                }
            }
        },

        render: function(context) {

            context.globalAlpha = 0.13;
            context.fillStyle = "#DADFE2"
            context.fillRect(0, 0, Config.width, Config.height);

            if (this.exploded) {
                context.globalAlpha = 1;
                context.drawImage(this.img, 0, 0);
            }

        }

    }

    window.Background = Background;


    var ILOVEYOU = [
        [ , 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9, 9, 9, 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  , 9, 9,  , 9, 9, 9, 9, 9, 9, 9,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , 9, 9, 9, 9, 9, 9,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , ],
        [ , 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9, 9, 9, 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  , 9, 9,  , 9, 9, 9, 9, 9, 9, 9,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , 9, 9, 9, 9, 9, 9,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , ],
        [ ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , ],
        [ ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , ],
        [ ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  , 9, 9,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , ],
        [ ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 9, 9, 9,  , 9, 9, 9,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , ],
        [ ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  , 9, 9,  , 9, 9, 9, 9, 9, 9, 9,  ,  ,  ,  ,  ,  , 9, 9, 9, 9, 9,  ,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , ],
        [ ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  ,  , 9, 9,  , 9, 9, 9, 9, 9, 9, 9,  ,  ,  ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , ],
        [ ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  ,  , 9, 9,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , ],
        [ ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  ,  , 9, 9,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , ],
        [ ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  ,  ,  , 9, 9,  ,  , 9, 9,  ,  ,  , 9, 9,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  , ],
        [ ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  ,  ,  , 9, 9,  ,  , 9, 9,  ,  ,  , 9, 9,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  ,  , 9, 9,  ,  ,  , 9, 9,  ,  , ],
        [ , 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,  ,  ,  ,  , 9, 9, 9, 9, 9, 9,  , 9, 9,  ,  , 9, 9,  ,  ,  ,  , 9, 9, 9, 9,  ,  ,  ,  , 9, 9, 9, 9, 9, 9, 9,  ,  ,  ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  , 9, 9,  ,  , 9, 9,  ,  ,  , 9, 9,  , 9, 9,  ,  ,  , ],
        [ , 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,  ,  ,  ,  , 9, 9, 9, 9, 9, 9,  , 9, 9, 9, 9, 9, 9,  ,  ,  ,  ,  , 9, 9,  ,  ,  ,  ,  , 9, 9, 9, 9, 9, 9, 9,  ,  ,  ,  ,  ,  ,  , 9, 9, 9,  ,  ,  ,  , 9, 9, 9, 9, 9, 9,  ,  ,  ,  ,  , 9,  ,  ,  ,  ,  , ],
    ];

    var MAJING = [
        [ , 9, 9,  ,  ,  , 9, 9,  ,  ,  ,  , 9,  ,  ,  ,  ,  ,  ,  ,  , 9,  , 9, 9, 9,  , 9,  ,  ,  , 9,  ,  ,  , 9, 9, 9,  ,  ,  ,   ],
        [ , 9, 9,  ,  ,  , 9, 9,  ,  ,  , 9,  , 9,  ,  ,  ,  ,  ,  ,  , 9,  ,  , 9,  ,  , 9, 9,  ,  , 9,  ,  , 9,  ,  ,  , 9,  ,  ,   ],
        [ , 9,  , 9,  , 9,  , 9,  ,  ,  , 9,  , 9,  ,  ,  ,  ,  ,  ,  , 9,  ,  , 9,  ,  , 9, 9,  ,  , 9,  , 9,  ,  ,  ,  , 9,  ,  , 9 ],
        [ , 9,  , 9,  , 9,  , 9,  ,  ,  , 9,  , 9,  ,  ,  ,  ,  ,  ,  , 9,  ,  , 9,  ,  , 9,  , 9,  , 9,  , 9,  ,  ,  ,  ,  ,  ,  , 9 ],
        [ , 9,  , 9,  , 9,  , 9,  ,  , 9,  ,  ,  , 9,  ,  ,  ,  ,  ,  , 9,  ,  , 9,  ,  , 9,  , 9,  , 9,  , 9,  ,  ,  ,  ,  ,  ,  ,   ],
        [ , 9,  , 9,  , 9,  , 9,  ,  , 9, 9, 9, 9, 9,  ,  ,  ,  ,  ,  , 9,  ,  , 9,  ,  , 9,  , 9,  , 9,  , 9,  ,  ,  , 9, 9, 9,  ,   ],
        [ , 9,  , 9,  , 9,  , 9,  ,  , 9,  ,  ,  , 9,  ,  ,  , 9,  ,  , 9,  ,  , 9,  ,  , 9,  ,  , 9, 9,  , 9,  ,  ,  ,  , 9, 9,  , 9 ],
        [ , 9,  ,  , 9,  ,  , 9,  , 9,  ,  ,  ,  ,  , 9,  ,  , 9,  ,  , 9,  ,  , 9,  ,  , 9,  ,  , 9, 9,  ,  , 9,  ,  , 9,  , 9,  , 9 ],
        [ , 9,  ,  , 9,  ,  , 9,  , 9,  ,  ,  ,  ,  , 9,  ,  , 9, 9, 9, 9,  , 9, 9, 9,  , 9,  ,  ,  , 9,  ,  ,  , 9, 9,  ,  , 9,  ,   ]
    ];
    var FOR = [
        [ , 9, 9, 9,  , 9, 9, 9,  , 9, 9, 9,  ,  ],
        [ , 9,  ,  ,  , 9,  , 9,  , 9,  ,  , 9,  ],
        [ , 9,  ,  ,  , 9,  , 9,  , 9,  ,  , 9,  ],
        [ , 9, 9, 9,  , 9,  , 9,  , 9,  , 9,  ,  ],
        [ , 9,  ,  ,  , 9,  , 9,  , 9, 9,  ,  ,  ],
        [ , 9,  ,  ,  , 9,  , 9,  , 9, 9,  ,  ,  ],
        [ , 9,  ,  ,  , 9,  , 9,  , 9,  , 9,  ,  ],
        [ , 9,  ,  ,  , 9,  , 9,  , 9,  ,  , 9,  ],
        [ , 9,  ,  ,  , 9, 9, 9,  , 9,  ,  ,  , 9]
    ];
    var n1 = [
        [9],
        [9],
        [9],
        [9],
        [9],
        [9],
        [9],
        [9],
        [9]
    ];
    var n2 = [
        [  ,  ,  , 9,  ,  ],
        [  ,  , 9,  , 9,  ],
        [  , 9,  ,  ,  , 9],
        [ 9,  ,  ,  , 9, ],
        [  ,  ,  , 9,  , ],
        [  ,  , 9,  ,  , ],
        [  , 9,  ,  ,  , ],
        [ 9,  ,  ,  ,  , ],
        [ 9, 9, 9, 9, 9, 9]
    ];
    var n3 = [
        [  ,  , 9, 9,  ,  ],
        [  , 9,  ,  , 9,  ],
        [ 9,  ,  ,  ,  , 9],
        [  ,  ,  , 9, 9,  ],
        [  , 9, 9,  ,  ,  ],
        [  ,  ,  , 9, 9,  ],
        [  ,  ,  ,  ,  , 9],
        [  ,  ,  ,  , 9,  ],
        [ 9, 9, 9, 9,  ,  ]
    ];
    var n4 = [
        [  ,  ,  ,  , 9,  ],
        [  ,  ,  , 9, 9,  ],
        [  ,  , 9,  , 9,  ],
        [  , 9,  ,  , 9,  ],
        [ 9,  ,  ,  , 9,  ],
        [ 9, 9, 9, 9, 9, 9],
        [  ,  ,  ,  , 9,  ],
        [  ,  ,  ,  , 9,  ],
        [  ,  ,  ,  , 9,  ]
    ];
    var n5 = [
        [  , 9,  ,  ,  ,  ],
        [  , 9, 9, 9, 9,  ],
        [  , 9,  ,  ,  ,  ],
        [  , 9,  ,  ,  ,  ],
        [  , 9, 9, 9, 9,  ],
        [  ,  ,  ,  ,  , 9],
        [  ,  ,  ,  ,  , 9],
        [  ,  ,  ,  , 9,  ],
        [ 9, 9, 9, 9,  ,  ]
    ];
    var n6 = [
        [  , 9, 9, 9,  ],
        [ 9,  ,  ,  , 9],
        [ 9,  ,  ,  ,  ],
        [ 9,  ,  ,  ,  ],
        [ 9, 9, 9, 9,  ],
        [ 9,  ,  ,  , 9],
        [ 9,  ,  ,  , 9],
        [ 9,  ,  ,  , 9],
        [  , 9, 9, 9,  ]
    ];
    var n7 = [
        [ 9, 9, 9, 9, 9],
        [  ,  ,  ,  ,  ],
        [  ,  ,  , 9,  ],
        [  ,  , 9,  ,  ],
        [  ,  , 9,  ,  ],
        [  ,  , 9,  ,  ],
        [  ,  , 9,  ,  ],
        [  ,  , 9,  ,  ],
        [  ,  , 9,  ,  ]
    ];
    var n8 = [
        [  , 9, 9, 9,  ],
        [ 9,  ,  ,  , 9],
        [ 9,  ,  ,  , 9],
        [  , 9,  , 9,  ],
        [  ,  , 9,  ,  ],
        [  , 9,  , 9,  ],
        [ 9,  ,  ,  , 9],
        [ 9,  ,  ,  , 9],
        [  , 9, 9, 9,  ]
    ];
    var n9 = [
        [  , 9, 9, 9,  ,  ],
        [ 9,  ,  ,  , 9,  ],
        [ 9,  ,  ,  , 9,  ],
        [ 9,  ,  ,  , 9,  ],
        [  , 9, 9, 9, 9,  ],
        [  ,  ,  ,  , 9,  ],
        [ 9,  ,  ,  , 9,  ],
        [  , 9,  , 9,  ,  ],
        [  ,  , 9,  ,  ,  ]
    ];
    var n0 = [
        [  ,  , 9,  ,  ],
        [  , 9,  , 9,  ],
        [ 9,  ,  ,  , 9],
        [ 9,  ,  ,  , 9],
        [ 9,  ,  ,  , 9],
        [ 9,  ,  ,  , 9],
        [ 9,  ,  ,  , 9],
        [  , 9,  , 9,  ],
        [  ,  , 9,  ,  ]
    ];
    var NUMS = [n0,n1,n2,n3,n4,n5,n6,n7,n8,n9];
    var DAYS = [
        [ 9, 9, 9,  ,  ,  ,   ,  ,  , 9,  ,  ,  ,  , 9,  ,  ,  , 9,  ,  ,  , 9, 9,  ,  ],
        [ 9,  ,  , 9,  ,  ,   ,  , 9,  , 9,  ,  ,  , 9,  ,  ,  , 9,  ,  , 9,  ,  , 9,  ],
        [ 9,  ,  ,  , 9,  ,   ,  , 9,  , 9,  ,  ,  , 9,  ,  ,  , 9,  , 9,  ,  ,  ,  , 9],
        [ 9,  ,  ,  , 9,  ,   ,  , 9,  , 9,  ,  ,  ,  , 9,  , 9,  ,  , 9,  ,  ,  ,  ,  ],
        [ 9,  ,  ,  , 9,  ,   , 9,  ,  ,  , 9,  ,  ,  , 9,  , 9,  ,  ,  , 9, 9,  ,  ,  ],
        [ 9,  ,  ,  , 9,  ,   , 9, 9, 9, 9, 9,  ,  ,  ,  , 9,  ,  ,  ,  ,  ,  , 9, 9,  ],
        [ 9,  ,  ,  , 9,  ,   , 9,  ,  ,  , 9,  ,  ,  ,  , 9,  ,  ,  ,  ,  ,  ,  ,  , 9],
        [ 9,  ,  , 9,  ,  ,  9,  ,  ,  ,  ,  , 9,  ,  ,  , 9,  ,  ,  , 9,  ,  ,  ,  , 9],
        [ 9, 9, 9,  ,  ,  ,  9,  ,  ,  ,  ,  , 9,  ,  ,  , 9,  ,  ,  ,  , 9, 9, 9, 9,  ]
    ];


    function calDays(){
        var time1 = Date.parse("9-2-2014");  
        var time2 = + new Date;  
          
        return Math.floor((Math.abs(time2 - time1))/1000/60/60/24);  
    }
}());