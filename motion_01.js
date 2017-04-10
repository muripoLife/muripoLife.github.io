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

shaderScene.add(shaderMesh);

const geometry = new THREE.CubeGeometry(40, 25, 1);
const material = new THREE.MeshBasicMaterial();
const mesh     = new THREE.Mesh(geometry, material);
scene.add(mesh);
const clock    = new THREE.Clock();


// 文字追加
	var text1;
	var controls = new function () {
		this.size = 90;
		this.height = 90;
		this.bevelThickness = 2;
		this.bevelSize = 0.5;
		this.bevelEnabled = true;
		this.bevelSegments = 3;
		this.bevelEnabled = true;
		this.curveSegments = 12;
		this.steps = 1;
		this.font = "helvetiker";
		this.weight = "normal";
//			this.style = "italics";

		this.asGeom = function () {
			// remove the old plane
			scene.remove(text1);
			// create a new one
			var options = {
				size: controls.size,
				height: controls.height,
				weight: controls.weight,
				font: controls.font,
				bevelThickness: controls.bevelThickness,
				bevelSize: controls.bevelSize,
				bevelSegments: controls.bevelSegments,
				bevelEnabled: controls.bevelEnabled,
				curveSegments: controls.curveSegments,
				steps: controls.steps
			};
			console.log(THREE.FontUtils.faces);
			// text1 = createMesh(new THREE.TextGeometry('sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y+p.z*p.z*abs(sin(time))) ) - r', options));
			text1 = createMesh(new THREE.TextGeometry('', options));
			// text2 = createMesh(new THREE.TextGeometry('sqrt(p.x*p.x+p.y*p.y+p.z*p.z + R*R - 2.0 * R * sqrt(p.x*p.x+p.y*p.y) ) - r', options));
			text1.position.z = -100;
			// text1.position.y = 100;
			text1.position.x = -220;
			scene.add(text1);
		};
	};

(function animate(){
	requestAnimationFrame(animate);
	renderer.render(shaderScene, shaderCamera, target);
	material.map = target.texture;
	shaderUniforms.time.value = clock.getElapsedTime();
	renderer.render(scene, camera);
}());
