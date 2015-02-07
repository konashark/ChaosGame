/* ***********************************************************
    CHAOS PLOTTER
    Copyright (c) 2015, Jeffrey Sprague
    www.wildlizardranch.com

    This software may be used or distributed free of charge
    for any non-commercial, educational purpose as long as
    the credits and copyright remain intact.
    **********************************************************/

window.addEventListener("load", start, false);

var g = {
    canvas: null,
    context: null,
    POLY: 3,
    POINTS: 10000,
    RAD: 1.0 - (1/2),
    SPEED: 'Fast',
    loops: 0,
    basePointArray: [],
    pointX: 0,
    pointY: 0,
    WIDTH: window.innerWidth,
    HEIGHT: window.innerHeight,
    HALF_WIDTH: 50 + window.innerWidth / 2,
    HALF_HEIGHT: window.innerHeight / 2
};

// ******************************************
function start () {

    g.canvas = document.getElementById("canvas");
    g.canvas.width = window.innerWidth;
    g.canvas.height = window.innerHeight;
    g.context = g.canvas.getContext("2d");
    g.context.font = "24px _sans";

    // Launch test when button is clicked
    document.getElementById('startBtn').onclick = function(ev) {
        setUp(g.POLY);
        animationLoop(g.POLY, g.RAD);
    };

    document.getElementById('demo1').onclick = function(ev) {
        runDemo(3, 1.0-(1/2));
    };
    document.getElementById('demo2').onclick = function(ev) {
        runDemo(4, 1.0-(2/5));
    };
    document.getElementById('demo3').onclick = function(ev) {
        runDemo(5, 1.0-(3/8));
    };
    document.getElementById('demo4').onclick = function(ev) {
        runDemo(6, 1.0-(1/3));
    };
    document.getElementById('demo5').onclick = function(ev) {
        runDemo(12, 1.0-(1/4));
    };

    var runDemo = function(verts, rad) {
        var oldPoly = g.POLY;
        var oldRad = g.RAD;
        g.POLY = verts;
        g.RAD = rad;
        setUp(g.POLY);
        animationLoop(g.POLY, g.RAD, function() {
            g.POLY = oldPoly;
            g.RAD = oldRad;
        });
    };

    // ******************************************
    var setUp = function(verts) {
        var p;
        var r = (g.HALF_HEIGHT < g.HALF_WIDTH) ? (g.HALF_HEIGHT - 35) : (g.HALF_WIDTH - 35);
        g.loops = 0;

        g.context.fillStyle = "#FFFFFF";
        g.context.fillRect(0, 0, g.WIDTH, g.HEIGHT);
        g.context.fillStyle = "#000000";

        for (p = 0; p < verts; p++) {
            var a = 360 / verts * p - 90;
            a = (a * (Math.PI / 180));
            var x = g.HALF_WIDTH + (Math.cos(a) * r);
            var y = g.HALF_HEIGHT + (Math.sin(a) * r);

            g.basePointArray[p] = {x: x, y: y };
            g.context.fillRect(x-2, y-2, 5, 5);
        }

        for (p = 1; p < verts; p++) {
            g.context.beginPath();
            g.context.moveTo(g.basePointArray[p - 1].x, g.basePointArray[p - 1].y);
            g.context.lineTo(g.basePointArray[p].x, g.basePointArray[p].y)
            g.context.stroke();
        }
        g.context.lineTo(g.basePointArray[0].x, g.basePointArray[0].y)
        g.context.stroke();

        g.pointX = g.HALF_WIDTH + (Math.floor(Math.random() * 200) - 100);
        g.pointY = g.HALF_HEIGHT + (Math.floor(Math.random() * 200) - 100);
        g.context.fillStyle = "#DD0000";
        //g.context.fillRect(g.pointX - 1, g.pointY - 1, 3, 3);
    };

    // ******************************************
    var animationLoop = function(verts, rad, callback) {
        var i;

        if (g.SPEED === 'Fast') {
            var begin = performance.now();
            for (i = 0; i < g.POINTS; i++) {
                plotPoint(verts, rad);
            }
            var end = performance.now();
            var delta = end - begin;
            console.log("Plotted " + g.POINTS + " points in " + delta + "ms (" + (1000/delta* g.POINTS) + " points per second!)");
            if (callback) {
                callback();
            }
        } else {
            for (i = 0; i < 10; i++) {
                plotPoint(verts, rad);
            }
            plotPoint(verts, rad);

            if ((g.loops += 10) < g.POINTS) {
                setTimeout(function () {
                    animationLoop(verts, rad);
                }, (g.SPEED === 'Slow' ? 100 : 1));
            } else {
                if (callback) {
                    callback();
                }
            }
        }
    };

    // ******************************************
    var plotPoint = function(verts, rad) {
        var randomTarget = Math.floor(Math.random() * verts);
        var targetX = g.basePointArray[randomTarget].x;
        var targetY = g.basePointArray[randomTarget].y;

        var newX = (g.pointX - (g.pointX - targetX) * rad);
        var newY = (g.pointY - (g.pointY - targetY) * rad);

        g.pointX = newX;
        g.pointY = newY;

        g.context.fillRect(g.pointX, g.pointY, 1, 1);
    }

    // ******************************************
    // Configure Sliders
    // ******************************************
    var sliderPoly = new dhtmlXSlider({
        parent: "sliderPoly",
        min: 3,
        max: 12,
        step: 1,
        value: 3
    });
    sliderPoly.attachEvent("onChange", function(value){
        g.POLY = value;
        setUp(value);
    });

    var sliderRad = new dhtmlXSlider({
        parent: "sliderRad",
        size: 120,
        min: 0,
        max: 4,
        step: 1,
        value: 2
    });
    sliderRad.attachEvent("onChange", function(value){
        document.getElementById('sliderRadLink').textContent = ['1/4', '3/8', '1/2', '5/8', '3/4'][value];
        g.RAD = [1.0 - (1/4), 1.0 - (3/8), 1.0 - (1/2), 1.0 - (5/8), 1.0 - (3/4)][value];
    });

    var sliderPoints = new dhtmlXSlider({
        parent: "sliderPoints",
        min: 0,
        max: 13,
        step: 1,
        value: 5
    });
    sliderPoints.attachEvent("onChange", function(value){
        var v;
        if (value < 4) {
            v = [10, 100, 500, 1000][value];
        } else {
            v = (value - 3) * 5000;
        }
        document.getElementById('sliderPointsLink').textContent = g.POINTS = v;
    });

    var sliderSpeed = new dhtmlXSlider({
        parent: "sliderSpeed",
        min: 0,
        max: 2,
        step: 1,
        value: 2
    });
    sliderSpeed.attachEvent("onChange", function(value){
        document.getElementById('sliderSpeedLink').textContent = g.SPEED = ['Slow','Med','Fast'][value];
    });

    // Draw initial configuration and then wait for START button to be pressed
    setUp(g.POLY);
}
