/**
 * JSX version of the Mithril Getting Started documentation's TODO example.
 * http://lhorie.github.io/mithril/getting-started.html
 * @jsx m
 */

var m = require('./../components/m/m.js');
var PubSub = require('./../components/p/p.js');
//var $ = require('jquery');

var THREE = require('threejs');

/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CSS3DObject = function ( element ) {

	THREE.Object3D.call( this );

	this.element = element;
	this.element.style.position = 'absolute';

	this.addEventListener( 'removed', function ( event ) {

		if ( this.element.parentNode !== null ) {

			this.element.parentNode.removeChild( this.element );

			for ( var i = 0, l = this.children.length; i < l; i ++ ) {

				this.children[ i ].dispatchEvent( event );

			}

		}

	} );

};

THREE.CSS3DObject.prototype = Object.create( THREE.Object3D.prototype );

THREE.CSS3DSprite = function ( element ) {

	THREE.CSS3DObject.call( this, element );

};

THREE.CSS3DSprite.prototype = Object.create( THREE.CSS3DObject.prototype );

//

THREE.CSS3DRenderer = function () {

	console.log( 'THREE.CSS3DRenderer', THREE.REVISION );

	var _width, _height;
	var _widthHalf, _heightHalf;

	var matrix = new THREE.Matrix4();

	var domElement = document.createElement( 'div' );
	domElement.style.overflow = 'hidden';

	domElement.style.WebkitTransformStyle = 'preserve-3d';
	domElement.style.MozTransformStyle = 'preserve-3d';
	domElement.style.oTransformStyle = 'preserve-3d';
	domElement.style.transformStyle = 'preserve-3d';

	this.domElement = domElement;

	var cameraElement = document.createElement( 'div' );

	cameraElement.style.WebkitTransformStyle = 'preserve-3d';
	cameraElement.style.MozTransformStyle = 'preserve-3d';
	cameraElement.style.oTransformStyle = 'preserve-3d';
	cameraElement.style.transformStyle = 'preserve-3d';

	domElement.appendChild( cameraElement );

	this.setClearColor = function () {

	};

	this.setSize = function ( width, height ) {

		_width = width;
		_height = height;

		_widthHalf = _width / 2;
		_heightHalf = _height / 2;

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

		cameraElement.style.width = width + 'px';
		cameraElement.style.height = height + 'px';

	};

	var epsilon = function ( value ) {

		return Math.abs( value ) < 0.000001 ? 0 : value;

	};

	var getCameraCSSMatrix = function ( matrix ) {

		var elements = matrix.elements;

		return 'matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( - elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( elements[ 6 ] ) + ',' +
			epsilon( elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( - elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( - elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
			')';

	};

	var getObjectCSSMatrix = function ( matrix ) {

		var elements = matrix.elements;

		return 'translate3d(-50%,-50%,0) matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( - elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( - elements[ 6 ] ) + ',' +
			epsilon( - elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
			')';

	};

	var renderObject = function ( object, camera ) {

		if ( object instanceof THREE.CSS3DObject ) {

			var style;

			if ( object instanceof THREE.CSS3DSprite ) {

				// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

				matrix.copy( camera.matrixWorldInverse );
				matrix.transpose();
				matrix.copyPosition( object.matrixWorld );
				matrix.scale( object.scale );

				matrix.elements[ 3 ] = 0;
				matrix.elements[ 7 ] = 0;
				matrix.elements[ 11 ] = 0;
				matrix.elements[ 15 ] = 1;

				style = getObjectCSSMatrix( matrix );

			} else {

				style = getObjectCSSMatrix( object.matrixWorld );

			}

			var element = object.element;

			element.style.WebkitTransform = style;
			element.style.MozTransform = style;
			element.style.oTransform = style;
			element.style.transform = style;

			if ( element.parentNode !== cameraElement ) {

				cameraElement.appendChild( element );

			}

		}

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			renderObject( object.children[ i ], camera );

		}

	};

	this.render = function ( scene, camera ) {

		var fov = 0.5 / Math.tan( THREE.Math.degToRad( camera.fov * 0.5 ) ) * _height;

		domElement.style.WebkitPerspective = fov + "px";
		domElement.style.MozPerspective = fov + "px";
		domElement.style.oPerspective = fov + "px";
		domElement.style.perspective = fov + "px";

		scene.updateMatrixWorld();

		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix( camera.matrixWorldInverse ) +
			" translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

		cameraElement.style.WebkitTransform = style;
		cameraElement.style.MozTransform = style;
		cameraElement.style.oTransform = style;
		cameraElement.style.transform = style;

		renderObject( scene, camera );

	};

};



var home = {};

//here's the view
home.view = function(ctrl) {
	/*jshint ignore:start */
	return 	<div class="" style="
	color:#FFF;
  padding-top:50px;
  ">
  <div id="asdzxc" class="mapcontainer" >
		sf,jhsdfjj <br/>
	sf,jhsdfjj <br/>
	sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>
	sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>
	  <img src="assets/img/profile-pic.jpg" style="width:80%;height: 400px;"/>
  sf,jhsdfjj <br/>
  sf,jhsdfjj <br/>
  sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>
  sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>		sf,jhsdfjj <br/>

<div id="tch" style="width:80%; height:200px; background-color:#aaa;">QWEASD</div>

</div>

		</div>
	/*jshint ignore:end */
};

home.controller = function() {
	var that = this;

	this.state = m.prop("State1");

	this.say = function() {
		PubSub.publish( 'MY TOPIC', new Date() );

	}

	PubSub.subscribe( 'MY TOPIC', function( msg, data ){
		that.state(data);
//		m.endComputation();
		m.redraw();

		//console.log( msg, data );
	} );

	setTimeout(function () {
		if (!(window.device && window.device.available)) {
			$('#datetimepicker1').attr('type','text');
			$('#datetimepicker1').datetimepicker();
		}

		$(".chosen-select").chosen({disable_search_threshold: 10});
		$(".chosen-select").append('<option value="United States">United States</option>');
		$('.chosen-select').trigger("chosen:updated");


		var s = '<div class="map" id="map0" style="width:80%;height: 400px;background: none;-webkit-transform: translate3d(0px,0px,0px);"></div>'//+
			//'<div class="mapshadow" style="width:80%;height: 400px;background-color: #000; "></div>'
		$(s).appendTo('.mapcontainer');





		var el;
		var camera, scene, renderer;
		var geometry, material, mesh;
		var target = new THREE.Vector3();

		var lon = 90, lat = 0;
		var phi = 0, theta = 0;

		var touchX, touchY;




		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

		scene = new THREE.Scene();

		var sides = [
			{
				url: 'http://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
				position: [ -512, 0, 0 ],
				rotation: [ 0, Math.PI / 2, 0 ]
			},
			{
				url: 'http://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
				position: [ 512, 0, 0 ],
				rotation: [ 0, -Math.PI / 2, 0 ]
			},
			{
				url: 'http://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
				position: [ 0,  512, 0 ],
				rotation: [ Math.PI / 2, 0, Math.PI ]
			},
			{
				url: 'http://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
				position: [ 0, -512, 0 ],
				rotation: [ - Math.PI / 2, 0, Math.PI ]
			},
			{
				url: 'http://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
				position: [ 0, 0,  512 ],
				rotation: [ 0, Math.PI, 0 ]
			},
			{
				url: 'http://threejs.org/examples/textures/cube/Bridge2/negz.jpg',
				position: [ 0, 0, -512 ],
				rotation: [ 0, 0, 0 ]
			}
		];

		for ( var i = 0; i < sides.length; i ++ ) {

			var side = sides[ i ];

			var element = document.createElement( 'img' );
			element.width = 1026; // 2 pixels extra to close the gap.
			element.src = side.url;

			var object = new THREE.CSS3DObject( element );
			object.position.fromArray( side.position );
			object.rotation.fromArray( side.rotation );
			scene.add( object );

		}

		renderer = new THREE.CSS3DRenderer();
		renderer.setSize( 300, 300 );


		//var rendererdomElement = $('<div style="width:80%; height:200px; background-color:#aaa;">QWEASD2</div>')[0];
		var rendererdomElement = renderer.domElement;

		//console.log(rendererdomElement);
		rendererdomElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		rendererdomElement.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

		rendererdomElement.addEventListener( 'touchstart', onDocumentTouchStart, false );
		rendererdomElement.addEventListener( 'touchmove', onDocumentTouchMove, false );

		document.getElementById('asdzxc').appendChild(rendererdomElement);


		//el = $(renderer.domElement).appendTo('.mapcontainer');
		//console.log('awm');
		// el.on('touchmove', function () {
		// 	alert('touchmove1');
		// })


		// el = $('<div style="width:80%; height:200px; background-color:#aaa;">QWEASD</div>').appendTo('.mapcontainer');
		

		animate();


		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function onDocumentMouseDown( event ) {

			event.preventDefault();

			rendererdomElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
			rendererdomElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

		}

		function onDocumentMouseMove( event ) {

			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			lon -= movementX * 0.5;
			lat += movementY * 0.5;

		}

		function onDocumentMouseUp( event ) {

			rendererdomElement.removeEventListener( 'mousemove', onDocumentMouseMove );
			rendererdomElement.removeEventListener( 'mouseup', onDocumentMouseUp );

		}

		function onDocumentMouseWheel( event ) {

			camera.fov -= event.wheelDeltaY * 0.05;
			camera.updateProjectionMatrix();

		}

		function onDocumentTouchStart( event ) {
			//alert('onDocumentTouchStart')
			event.preventDefault();

			var touch = event.touches[ 0 ];

			touchX = touch.screenX;
			touchY = touch.screenY;

		}

		function onDocumentTouchMove( event ) {


			event.preventDefault();

			var touch = event.touches[ 0 ];

			lon -= ( touch.screenX - touchX ) * 0.1;
			lat += ( touch.screenY - touchY ) * 0.1;

			touchX = touch.screenX;
			touchY = touch.screenY;

		}

		function animate() {

			requestAnimationFrame( animate );

			//lon +=  0.1;
			lat = Math.max( - 85, Math.min( 85, lat ) );
			phi = THREE.Math.degToRad( 90 - lat );
			theta = THREE.Math.degToRad( lon );

			target.x = Math.sin( phi ) * Math.cos( theta );
			target.y = Math.cos( phi );
			target.z = Math.sin( phi ) * Math.sin( theta );

			camera.lookAt( target );

			renderer.render( scene, camera );

		}

		setTimeout(function () {

			var map = L.map('map0',{keyboard: false}).setView([51.505, -0.09], 18);

			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
				maxZoom: 18
			}).addTo(map);






			function initscene() {





				//window.addEventListener( 'resize', onWindowResize, false );

			}




		},1000);






	},2000);

};


//initialize the application

module.exports = home;
