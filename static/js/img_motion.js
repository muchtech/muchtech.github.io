$( document ).ready(function() {
    var acc = {
      x: [0,0,0,0,0,0,0,0,0,0],
      y: [0,0,0,0,0,0,0,0,0,0],
      z: [0,0,0,0,0,0,0,0,0,0]
    }

    var acc_gravity = {
      x: [0,0,0,0,0,0,0,0,0,0],
      y: [0,0,0,0,0,0,0,0,0,0],
      z: [0,0,0,0,0,0,0,0,0,0]
    }

    var rotation = {
      a: [0,0,0,0,0,0,0,0,0,0],
      b: [0,0,0,0,0,0,0,0,0,0],
      g: [0,0,0,0,0,0,0,0,0,0]
    }

    function deadband(old_val, new_val) {
      var db = 1;
      if(Math.abs(old_val-new_val) > db) {
        old_val = new_val;
      } else {
        old_val = 0;
      }
      return old_val;
    }

    function avg(vals) {
      var val_avg = 0;
      for(var i=0; i<vals.length; i++) {
        val_avg += vals[i];
      }
      return val_avg/vals.length;
    }

    function deviceMotionHandler(eventData) {
      var info, xyz = "[X, Y, Z]";
      var array_last = acc.x.length-2;

      // Grab the acceleration from the results
      var acceleration = eventData.acceleration;
      acc.x.shift();
      acc.x.push(deadband(acc.x[array_last], acceleration.x));
      acc.y.shift();
      acc.y.push(deadband(acc.y[array_last], acceleration.y));
      acc.z.shift();
      acc.z.push(deadband(acc.z[array_last], acceleration.z));

      info = xyz.replace("X", avg(acc.x));
      info = info.replace("Y", avg(acc.y));
      info = info.replace("Z", avg(acc.z));
      //$("#acceleration").text(info);

      // Grab the acceleration including gravity from the results
      acceleration = eventData.accelerationIncludingGravity;
      acc_gravity.x.shift();
      acc_gravity.x.push(deadband(acc_gravity.x[array_last], acceleration.x));
      acc_gravity.y.shift();
      acc_gravity.y.push(deadband(acc_gravity.y[array_last], acceleration.y));
      acc_gravity.z.shift();
      acc_gravity.z.push(deadband(acc_gravity.z[array_last], acceleration.z));

      info = xyz.replace("X", avg(acc_gravity.x));
      info = info.replace("Y", avg(acc_gravity.y));
      info = info.replace("Z", avg(acc_gravity.z));
      //$("#accelerationIncludingGravity").text(info);

      // Grab the refresh interval from the results
      info = eventData.interval;
      //$("#interval").text(info);
    }

    function deviceOrientationHandler(eventData) {
      var img = $('.img_crop')[0];
      var width = img.clientWidth;
      var height = img.clientHeight;
      var array_last = rotation.a.length-2;

      $('.img_crop').css('left', -width/2+'px');
      $('.img_crop').css('top', -height/2+'px');
      return;

      var info, xyz = "[X, Y, Z]";

      rotation.a.shift();
      rotation.a.push(deadband(rotation.a[array_last], eventData.alpha));
      rotation.b.shift();
      rotation.b.push(deadband(rotation.b[array_last], eventData.beta));
      rotation.g.shift();
      rotation.g.push(deadband(rotation.g[array_last], eventData.gamma));

      info = xyz.replace("X", avg(rotation.a));
      info = info.replace("Y", avg(rotation.b));
      info = info.replace("Z", avg(rotation.g));
      //$("#rotationRate").text(info);
      var img_position = {
        key: 'Rotation',
        left: 0.5*width + (width * (avg(rotation.g)-90)/180),
        top: 0.5*height + (height * (avg(rotation.b)-180)/360)
      };
      $('#img_pos').text('Left: '+img_position.left+'; Top: '+img_position.top + '; 0.5');
      updateImg(img_position);
    }

    function updateImg(eventData) {
      var top_val = parseInt($('.img_crop').css('top'));
      var left_val = parseInt($('.img_crop').css('left'));
      switch(eventData.key) {
        case 'ArrowDown':
          $('.img_crop').css('top', top_val-1+'px');
          break;
        case 'ArrowUp':
          $('.img_crop').css('top', top_val+1+'px');
          break;
        case 'ArrowLeft':
          $('.img_crop').css('left', left_val+1+'px');
          break;
        case 'ArrowRight':
          $('.img_crop').css('left', left_val-1+'px');
          break;
        case 'Rotation':
          if(eventData.left <= 0) {
            $('.img_crop').css('left', eventData.left+'px');
          } else {
            $('.img_crop').css('left', -1*eventData.left+'px');
          }
          if(eventData.top <= 0) {
            $('.img_crop').css('top', eventData.top+'px');
          } else {
            $('.img_crop').css('top', -1*eventData.top+'px');
          }
          break;
      }
    }

    if (window.DeviceMotionEvent) {
      $('#motion_info').text('Device motion supported');
      window.addEventListener('devicemotion', deviceMotionHandler, false);
      window.addEventListener('deviceorientation', deviceOrientationHandler, false);
    } else {
      $('#motion_info').text('Device motion not supported');
    }

    $(document).keydown(updateImg);
});