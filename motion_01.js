const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xcccccc);
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

const geometry = new THREE.CubeGeometry(30, 25, 1);
const material = new THREE.MeshBasicMaterial();
const mesh     = new THREE.Mesh(geometry, material);
mesh.position.x = 15;
scene.add(mesh);
const clock    = new THREE.Clock();

const light = new THREE.HemisphereLight(0xff99ad, 0xfef4f4);
light.position.y = 1050;

scene.add(light);
var loader = new THREE.FontLoader();
loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
	var textGeo = new THREE.TextGeometry( "THREE.JS", {
		font: font,
		size: 20, // font size
		height: 10, // how much extrusion (how thick / deep are the letters)
		curveSegments: 12,
		bevelThickness: 1,
		bevelSize: 1,
		bevelEnabled: true
	});
	textGeo.computeBoundingBox();
	var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff00ff, specular: 0xffffff } );
	var meshText = new THREE.Mesh( textGeo, textMaterial );
	meshText.position.x = -200;
	meshText.position.y = 25;
	meshText.position.z = -200;
	meshText.castShadow = true;
	meshText.receiveShadow = true;
	scene.add( meshText );
});

(function animate(){
	requestAnimationFrame(animate);
	renderer.render(shaderScene, shaderCamera, target);
	material.map = target.texture;
	shaderUniforms.time.value = clock.getElapsedTime();
	renderer.render(scene, camera);
}());
