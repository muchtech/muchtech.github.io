$( document ).ready(function() {
    var $img;
    var img_w;
    var img_h;
    var img_data;
    var w;
    var h;

    function init() {
        $img = $('.img_crop');
        img_w = $img[0].clientWidth;
        img_h = $img[0].clientHeight;
        var img_zone = $('.img_zone')[0];
        w = img_zone.clientWidth;
        h = img_zone.clientHeight;
        $img.css('left', '-'+(img_w/2 - w/2)+'px');
        $img.css('top', '-'+(img_h/2 - h/2)+'px');
        img_data = {
            velocity: {x: 0, y: 0},
            position: {x: -1*(img_w/2 - w/2), y: -1*(img_h/2 - h/2)}
        };

        if(window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function(event){
                    img_data.velocity.y = Math.round(event.beta);
                    img_data.velocity.x = Math.round(event.gamma);
            });
        };

        update();
    }

    function update() {
        img_data.position.x += img_data.velocity.x;
        img_data.position.y += img_data.velocity.y;

        if(-1*img_data.position.x > (img_w-w) && img_data.velocity.x > 0) {
           img_data.position.x = -1*(img_w-w);
        }

        if(-1*img_data.position.x < 0 && img_data.velocity.x < 0) {
            img_data.position.x = 0;
        }

        if(-1*img_data.position.y > (img_h-h) && img_data.velocity.y > 0) {
           img_data.position.y = -1*(img_h-h);
        }

        if(-1*img_data.position.y < 0 && img_data.velocity.y < 0) {
           img_data.position.y = 0;
        }

        $img.css('left', '-'+img_data.position.x + 'px');
        $img.css('top', '-'+img_data.position.y + 'px');
        window.setTimeout( callback, 1000 / 60 );
    }

    init();
});
