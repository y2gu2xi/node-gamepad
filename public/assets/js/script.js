$(function() {

	// Initialize the Reveal.js library with the default config options
	// See more here https://github.com/hakimel/reveal.js#configuration

	Reveal.initialize({
		history: true		// Every slide will change the URL
	});

	// Connect to the socket

	var socket = io();

	// Variable initialization

	var form = $('form.login');
	var secretTextBox = form.find('input[type=text]');
	var presentation = $('.reveal');

	var start = false;

	var key = "", animationTimeout;

	// When the page is loaded it asks you for a key and sends it to the server

	form.submit(function(e){

		e.preventDefault();

		key = secretTextBox.val().trim();

		// If there is a key, send it to the server-side
		// through the socket.io channel with a 'load' event.

		if(key.length) {
			socket.emit('load', {
				key: key
			});
		}

	});

	$('.btn-fc').on('click',function(){
	    start = !start;
        $('.btn-fc').text(start?'收车':'发车');
    });

	// The server will either grant or deny access, depending on the secret key

	socket.on('access', function(data){

		// Check if we have "granted" access.
		// If we do, we can continue with the presentation.

		if(data.access === "granted") {

			// Unblur everything
			presentation.removeClass('blurred');

			form.hide();

			var ignore = false;

			$(window).on('hashchange', function(){

				// Notify other clients that we have navigated to a new slide
				// by sending the "slide-changed" message to socket.io

				if(ignore){
					// You will learn more about "ignore" in a bit
					return;
				}

				var hash = window.location.hash;

				socket.emit('slide-changed', {
					hash: hash,
					key: key
				});
			});

			socket.on('navigate', function(data){
	
				// Another device has changed its slide. Change it in this browser, too:

				window.location.hash = data.hash;

				// The "ignore" variable stops the hash change from
				// triggering our hashchange handler above and sending
				// us into a never-ending cycle.

				ignore = true;

				setInterval(function () {
					ignore = false;
				},100);

			});

            var last_x = 0;
            var last_y = 0;
			//websocket创建
            var websocketBusyFlag = 0;
            setInterval(function(){
                websocketBusyFlag = false;
            },100)
            if(!window.DeviceMotionEvent)
            {
                alert('你的浏览器不支持手机重力传感');
            }
            else
            {
                //方向获取
                window.ondevicemotion = function(e) {
                    if(websocketBusyFlag) return;

                    var x = e.accelerationIncludingGravity.x;
                    var y = e.accelerationIncludingGravity.y;

                    var direction = null;
                    if(x > 7.5 && x > last_x)
                    {
                       // direction = 'backward';	//减速
                        last_x = x;
                    }
                    else if(x < -1.0 && x < last_x)
                    {
                       // direction = 'forward';	//加速
                        last_x = x;
                    }
                    else last_x = 0;

                    if(y < -3 && y < last_y)
                    {
                        direction = 'leftward';	//向左
                        last_y = y;
                    }
                    else if(y > 3 && y > last_y)
                    {
                        direction = 'rightward';	//向右
                        last_y = y;
                    }
                    else last_y = 0;

                   // directionImgInit();
					if(start&& !websocketBusyFlag && direction){
                        socket.emit('direction', {
                            direction: direction,
                            key: key
                        });
                        direction = '';
                        websocketBusyFlag = true;
					}

                }
            }



		}
		else {

			// Wrong secret key

			clearTimeout(animationTimeout);

			// Addding the "animation" class triggers the CSS keyframe
			// animation that shakes the text input.

			secretTextBox.addClass('denied animation');
			
			animationTimeout = setTimeout(function(){
				secretTextBox.removeClass('animation');
			}, 1000);

			form.show();
		}

	});

});