(function(T) {
	'use strict';

	/**
	 * Rotate gesture. Supports a rotation threshold that is used to measure when the gesture starts.
	 * Triggers `start`, `update` and `end` events.
	 * @name T.gestures.rotate
	 * @function
	 */
	var Rotate = T.Gesture.augment(function(Gesture) {

		this.defaults = {
			touches: 2,
			rotationThreshold: 12,
			preventDefault: true
		};
		
		this.start = function(event, data) {
			this.rect = T.utils.getRect(this.gestureHandler.element);
			this.rotate = {
				start: {},
				current: {}
			};

			if(this.hasMoreTouches(data.pagePoints)) {
				this.cancel();
				return;
			}

			this.rotate.start.point1 = data.pagePoints[0];
			this.rotate.start.point2 = data.pagePoints[1];

			if(this.options.preventDefault) {
				event.preventDefault();
				T.WebkitHack.prevent();
			}
		};

		this.update = function(event, data) {
			if(this.hasMoreTouches(data.pagePoints)) {
				this.cancel();
				return;
			} else if(this.hasEqualTouches(data.pagePoints)) {
				if(!this.rotate.start.point2) {
					this.rotate.start.point2 = data.pagePoints[1];
				} else {
					this.rotate.current.point1 = data.pagePoints[0];
					this.rotate.current.point2 = data.pagePoints[1];
					this.startAngle = T.utils.getDeltaAngle(this.rotate.start.point2, this.rotate.start.point1);
					this.currentAngle = T.utils.getDeltaAngle(this.rotate.current.point2, this.rotate.current.point1);
					this.rotation = this.currentAngle - this.startAngle;
					data.rotation = this.rotation;

					if(!this.started && Math.abs(this.rotation) >= this.options.rotationThreshold) {
						this.started = true;
						this.gestureHandler.cancelGestures(this.type);
						this.binder.start.call(this, event, data);
					} else if(this.started) {
						this.binder.update.call(this, event, data);
					}
				}
			}

			if(this.options.preventDefault) {
				event.preventDefault();
				T.WebkitHack.prevent();
			}
		};

		this.end = function(event, data) {
			if(this.started) {
				this.binder.end.call(this, event, data);
			}

			if(this.options.preventDefault) {
				event.preventDefault();
				T.WebkitHack.prevent();
			}
		};

		this.cancel = function() {
			if(this.cancelled) {
				return;
			}
			this.cancelled = true;
			if(this.started) {
				this.bindingObj.cancel.call(this.bindingObj);
			}
		};

		function Rotate() {
			Gesture.apply(this, arguments);
		}
		return Rotate;
	});

T.gestures.add('rotate', Rotate);

})(window.Touche);
