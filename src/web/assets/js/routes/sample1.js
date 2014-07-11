/**
 * JSX version of the Mithril Getting Started documentation's TODO example.
 * http://lhorie.github.io/mithril/getting-started.html
 * @jsx m
 */

var m = require('./../components/m/m.js');
var PubSub = require('./../components/p/p.js');

var L = require('leaflet');
//var $ = require('jquery');

var THREE = require('three');

require('./../components/three/threejs-CSS3D.js')(THREE);

var sample1 = {};

//here's the view
sample1.view = function(ctrl) {
	/*jshint ignore:start */
	return [
		<div class="view">

			<div class="view-bar noscroll" style="">
				Sample1
			</div>

			<div class="view-content scroll" style="">
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
				</div>
				<div class="map" id="map0" style="width:80%;height: 400px;background: none;-webkit-transform: translate3d(0px,0px,0px);"></div>
			</div>

		</div>
	]
	/*jshint ignore:end */
};

sample1.controller = function() {
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

		// var s = '<div class="map" id="map0" style="width:80%;height: 400px;background: none;-webkit-transform: translate3d(0px,0px,0px);"></div>'//+
		// 	//'<div class="mapshadow" style="width:80%;height: 400px;background-color: #000; "></div>'
		// $(s).appendTo('.mapcontainer');





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

		var rendererdomElement = renderer.domElement;



			// console.log('rendererdomElement.addEventListener');



			// var qwe = $(rendererdomElement);

			// $('#asdzxc').append(qwe);

			// qwe.on('click', function () {
			// 	console.log('click');
			// })


		// document.addEventListener( 'touchstart', function (evt) {console.log(evt)}, true );



		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function onDocumentMouseDown( event ) {
			console.log('onDocumentMouseDown')
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
			console.log('onDocumentTouchStart')
			event.preventDefault();

			var touch = event.touches[ 0 ];

			touchX = touch.screenX;
			touchY = touch.screenY;

		}

		function onDocumentTouchMove( event ) {
			console.log('onDocumentTouchMove')

			event.preventDefault();

			var touch = event.touches[ 0 ];

			lon -= ( touch.screenX - touchX ) * 0.1;
			lat += ( touch.screenY - touchY ) * 0.1;

			touchX = touch.screenX;
			touchY = touch.screenY;

		}



		rendererdomElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		rendererdomElement.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

		rendererdomElement.addEventListener( 'touchstart', onDocumentTouchStart,  false );
		rendererdomElement.addEventListener( 'touchmove', onDocumentTouchMove, false );


		document.getElementById('asdzxc').appendChild(rendererdomElement);


		// var qwe = $('<div id="tch" style="width:80%; height:200px; background-color:#aaa;">QWEASD</div>')[0];

		// qwe.addEventListener( 'touchstart', function () {console.log('touchstart qwe')}, false );

		// document.getElementById('asdzxc').appendChild(qwe);

		
		//document.addEventListener( 'touchstart', function () {console.log("document touchstart")}, false );



		//document.getElementById('tch').addEventListener( 'touchstart', function () {console.log('touchstart tch')}, false );




		animate();


		function animate() {



			requestAnimationFrame( animate );

			lon +=  0.1;
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


			//document.getElementById('asdzxc').appendChild(rendererdomElement);



		},1000);






	},2000);

};


//initialize the application

module.exports = sample1;
