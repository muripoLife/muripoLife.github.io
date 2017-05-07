(() => {
	window.addEventListener('load',async () => {
		const scene    = new THREE.Scene();
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0xff0000);
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

		const geometry = new THREE.PlaneGeometry(window.innerWidth/15, window.innerHeight/15, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		const mesh     = new THREE.Mesh(geometry, material);
		mesh.position.x = 15;
		scene.add(mesh);
		const clock    = new THREE.Clock();

		const light = new THREE.HemisphereLight(0xff99ad, 0xfef4f4);
		light.position.y = 1050;

		let count = 0;

		scene.add(light);
		// var loader = new THREE.FontLoader();

		// var geoText = function ( font ) {
		// 	var textGeo_bf = new THREE.TextGeometry( "xxx Lion", {
		// 		font: font,
		// 		size: 30,
		// 		height: 10,
		// 		curveSegments: 12,
		// 		bevelThickness: 1,
		// 		bevelSize: 1,
		// 		bevelEnabled: true
		// 	});
		
		// 	textGeo_bf.computeBoundingBox();
		// 	var textMaterial = new THREE.MeshPhongMaterial( { color: 0x00ffff, specular: 0xffffff } );
		// 	var meshText_bf = new THREE.Mesh( textGeo_bf, textMaterial );
		// 	meshText_bf.castShadow = true;
		// 	meshText_bf.receiveShadow = true;
		// 	return meshText_bf;
		// };

		// const font = await loadFont('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json');
		// const textMesh = geoText(font);
		// textMesh.scale.set(0.05, 0.05, 0.05);
		// textMesh.position.set(-25, 7, 0);

		// scene.add(textMesh);

		animate();

		function animate(){
			requestAnimationFrame(animate);
			renderer.render(shaderScene, shaderCamera, target);
			material.map = target.texture;
			time                      = clock.getElapsedTime();
			shaderUniforms.time.value = clock.getElapsedTime();
			// textMesh.position.y = 10*Math.sin(time);

			renderer.render(scene, camera);
		}

		function loadFont (url) {
			return new Promise(resolve => {
				const loader = new THREE.FontLoader();
				loader.load(url, (font) => {
					resolve(font);
				})
			});

		}
	}, false);
})();
