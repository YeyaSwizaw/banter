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

const BALL_RADIUS = 8;
const BALL_SPEED = 10;

function Ball(x, y, stage) {
    this.x = x;
    this.y = y;
    this.r = BALL_RADIUS;

    this.dx = 0;
    this.dy = 0;

    this.reposition = () => {
        this.shape.x = this.x;
        this.shape.y = this.y;
    };

    this.draw = stage => {
        this.shape = new createjs.Shape();

        this.shape.graphics
            .f("DarkBlue")
            .dc(0, 0, this.r);

        this.reposition();

        stage.addChild(this.shape);
    };

    this.tick = () => {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;

        this.reposition();
    };

    this.direction = (dir) => {
        const angle = dir * 3.141592 / 180;
        this.dx = Math.sin(angle) * BALL_SPEED;
        this.dy = Math.cos(angle) * BALL_SPEED;
    };

    this.draw(stage);

    this.collides = (paddle) => {
        if(this.x < 110) {
            if(this.y > paddle.y - paddle.h / 2 && this.y < paddle.y + paddle.h / 2 && this.x > paddle.x && this.x <= paddle.x + (paddle.w / 2) + BALL_RADIUS) {
                return true;
            }
        } else {
            if(this.y > paddle.y - paddle.h / 2 && this.y < paddle.y + paddle.h / 2 && this.x < paddle.x && this.x >= paddle.x - (paddle.w / 2) - BALL_RADIUS) {
                return true;
            }
        }

        return false;
    }
}

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
    let ball = new Ball(0, 0, stage);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        left.x = 90;
        right.x = canvas.width - 90;
    }

    function render() {
        stage.update();
    }

    function resetGame() {
        resize();

        left.y = canvas.height / 2;
        right.y = canvas.height / 2;

        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.direction(Math.random() * 360);

        left.reposition();
        right.reposition();
        ball.reposition();
    }

    function tick() {
        left.tick();
        right.tick();
        ball.tick();

        if(ball.y < 0 || ball.y > canvas.height) {
            ball.dy = ball.dy * -1;
        }

        if(ball.collides(left) || ball.collides(right)) {
            ball.dx = ball.dx * -1;
        }

        if(ball.x < 80 || ball.x > canvas.width - 80) {
            resetGame();
        }

        render();
    }

    $(window).resize(() => {
        resize();

        left.reposition(stage);
        right.reposition(stage);
        ball.reposition();

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
    resetGame();
});
