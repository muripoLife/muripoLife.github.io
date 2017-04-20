const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 遠近効果があるカメラ
const camera        = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z   = 30;
// const controls      = new THREE.OrbitControls(camera);
const target        = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
const shaderScene   = new THREE.Scene();
// 遠近効果がないカメラ
const shaderCamera  = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -1, 1);

// JSからGLSLへ変数を渡す変数
const shaderUniforms = {
	resolution: {
		value: new THREE.Vector2(window.innerWidth, window.innerHeight)
	},
	time: {
		value: 0
	}
};

const shaderGeometry  = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
const shaderMaterial  = new THREE.ShaderMaterial({
	vertexShader: document.getElementById("vs").textContent,
	fragmentShader: document.getElementById("fs").textContent,
	uniforms: shaderUniforms
});

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
shaderMesh.position.x = -100;
shaderScene.add(shaderMesh);

const geometry = new THREE.PlaneGeometry(30, 25, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const mesh     = new THREE.Mesh(geometry, material);
mesh.position.x = 15;
scene.add(mesh);
const clock    = new THREE.Clock();

const light = new THREE.HemisphereLight(0xff99ad, 0xfef4f4);
light.position.y = 1050;

let count = 0;

scene.add(light);
var loader = new THREE.FontLoader();

(function animate(){
	requestAnimationFrame(animate);
	renderer.render(shaderScene, shaderCamera, target);
	material.map = target.texture;
	shaderUniforms.time.value = clock.getElapsedTime();

	loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
		var textGeo_bf = new THREE.TextGeometry( "x^2+y^2+z^2=r^2", {
			font: font,
			size: 30,
			height: 10,
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: true
		});

		var textGeo_arrow = new THREE.TextGeometry( "----------------------", {
			font: font,
			size: 50,
			height: 10,
			curveSegments: 12,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: true
		});

		var textGeo_af = new THREE.TextGeometry( "x^2+y^2+z^2+R^2-2R(x2+y2)^1/2=r^2", {
			font: font,
			size: 18,
			height: 5,
			curveSegments: 2,
			bevelThickness: 1,
			bevelSize: 1,
			bevelEnabled: true
		});

		textGeo_bf.computeBoundingBox();
		textGeo_af.computeBoundingBox();
		textGeo_arrow.computeBoundingBox();
		var textMaterial = new THREE.MeshPhongMaterial( { color: 0x00ffff, specular: 0xffffff } );
		var meshText_bf = new THREE.Mesh( textGeo_bf, textMaterial );
		var meshText_af = new THREE.Mesh( textGeo_af, textMaterial );
		var meshText_arrow = new THREE.Mesh( textGeo_arrow, textMaterial );
		meshText_bf.position.x = -400;
		meshText_bf.position.y = 60*Math.sin(count * 0.005);
		meshText_bf.position.z = -400;
		meshText_bf.castShadow = true;
		meshText_bf.receiveShadow = true;

		meshText_arrow.position.x = -500;
		meshText_arrow.position.y = 0;
		meshText_arrow.position.z = -400;
		meshText_arrow.castShadow = true;
		meshText_arrow.receiveShadow = true;

		meshText_af.position.x = -450;
		meshText_af.position.y = -60;
		meshText_af.position.z = -400;
		meshText_af.castShadow = true;
		meshText_af.receiveShadow = true;
		scene.add( meshText_bf, meshText_af, meshText_arrow);
	});
	count++;
	renderer.render(scene, camera);
}());
