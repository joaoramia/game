
(function() {
    function Sprite(url, pos, size, speed, frames, dir, selectable) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.selectable = selectable; //selectable if not another player's unit
        this.selected = false;
    };

    Sprite.prototype = {

        renderEllipse: function(enemy){
            ctx.beginPath();
            ctx.ellipse(this.pos[0] + this.size[0]/2, this.pos[1] + this.size[1], this.size[1]/3, this.size[1]/5, 0, 0, Math.PI*2);
            
            if (enemy) {
                ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            } else {
                ctx.fillStyle = this.selected ? "rgba(0, 0, 255, 0.3)" : "rgba(0, 0, 0, 0.3)";
            
            }
            ctx.fill();
            ctx.closePath();
        },

        renderHpBar: function (currentHealth, maxHealth) {
            if (this.url === 'img/moneybag.png') return;

            ctx.strokeStyle = 'black'; // HP Border for maxHealth
            ctx.strokeRect(this.pos[0], this.pos[1] - 10, this.size[0], 5);

            ctx.beginPath(); // HP Green for currentHealth
            ctx.rect(this.pos[0], this.pos[1] - 10, currentHealth / maxHealth * this.size[0], 5);
            ctx.fillStyle = "rgba(0,128,0, 1)";
            ctx.closePath();
            ctx.fill();
        },

        render: function(ctx, currentHealth, maxHealth) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }

            if (this.selectable) this.renderEllipse();

            this.renderHpBar(currentHealth, maxHealth);

            if (frame === -1) {
                ctx.drawImage(resources.get(this.url),
                         x, y);
            } else {
                ctx.drawImage(resources.get(this.url),
                         x, y,
                         this.size[0], this.size[1],
                         0, 0,
                         this.size[0], this.size[1]);
            }
        }
    };

    window.Sprite = Sprite;
})()

function generateSprite(type, selectable){
    selectable = selectable || false;

    if (type === 'hero' && selectable) {
       return new Sprite('img/hero.png', [0, 0], [46, 81], 16, [0, 1, 2, 3, 4, 5, 6, 7], 'horizontal', selectable);
    } else if (type === 'soldier' && selectable) {
        return new Sprite('img/soldier-asset.png', [0, 0], [64, 64], 1, [0, 1, 2, 3, 4, 5, 6, 7], 'horizontal', selectable);
    }else if(type === 'moneybag'){
        return new Sprite('img/'+ type +'.png', [0,0], [10,25], 1, [-1], false);
    }
}