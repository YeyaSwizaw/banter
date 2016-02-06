/**
 * Created by sam on 06/02/2016.
 */

"use strict";

const FRAME_TIME = 1000 / 60;

const KEY_UP = 38;
const KEY_DOWN = 40;

const KEY_W = 87;
const KEY_S = 83;

const PADDLE_W = 20;
const PADDLE_H = 100;
const PADDLE_SPEED = 5;

function Paddle(x, y, stage) {
    this.x = x;
    this.y = y;
    this.w = PADDLE_W;
    this.h = PADDLE_H;

    this.up = false;
    this.down = false;

    this.reposition = () => {
        this.shape.x = this.x - this.w / 2;
        this.shape.y = this.y - this.h / 2;
    };

    this.draw = stage => {
        this.shape = new createjs.Shape();

        this.shape.graphics
            .f("DarkRed")
            .dr(0, 0, this.w, this.h);

        this.reposition();

        stage.addChild(this.shape)
    };

    this.tick = () => {
        if (this.up === true) {
            this.y = this.y - PADDLE_SPEED;
        }

        if (this.down === true) {
            this.y = this.y + PADDLE_SPEED;
        }

        this.reposition();
    };

    this.draw(stage);
}

$(() => {
    let canvas = document.getElementById('canvas');
    let stage = new createjs.Stage('canvas');

    let left = new Paddle(0, 0, stage);
    let right = new Paddle(0, 0, stage);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        left.x = 90;
        right.x = canvas.width - 90;
    }

    function render() {
        stage.update();
    }

    function tick() {
        left.tick();
        right.tick();

        render();
    }

    resize();

    left.y = canvas.height / 2;
    right.y = canvas.height / 2;

    left.reposition(stage);
    right.reposition(stage);

    $(window).resize(() => {
        resize();

        left.reposition(stage);
        right.reposition(stage);

        render();
    });

    $(window).keyup(e => {
        switch(e.keyCode) {
            case KEY_UP:
                right.up = false;
                break;

            case KEY_DOWN:
                right.down = false;
                break;

            case KEY_W:
                left.up = false;
                break;

            case KEY_S:
                left.down = false;
                break;
        }
    });

    $(window).keydown(e => {
        switch(e.keyCode) {
            case KEY_UP:
                right.up = true;
                break;

            case KEY_DOWN:
                right.down = true;
                break;

            case KEY_W:
                left.up = true;
                break;

            case KEY_S:
                left.down = true;
                break;
        }

        console.log(`Key down: ${e.keyCode}`);
    });

    setInterval(tick, FRAME_TIME);
});
