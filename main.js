/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
 // Three.jsをインポート
 // OrbitControlsをインポートしてカメラを制御
let scene, camera, renderer, controls, raycaster, mouse;
let cubes = [];
let balls = [];
let score = 0;
let canShoot = true;
let scoreText, scoreTexture, scoreMaterial, scoreMesh;
init();
animate();
function init() {
    // シーンの作成
    scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
    scene.background = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0xf0f0f0); // 背景色を明るいグレーに設定
    // カメラの作成
    camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    // レンダラーの作成
    renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // カメラコントロールの追加
    controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
    // ライトの追加
    const light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).clone().normalize();
    scene.add(light);
    // レイキャスターの設定
    raycaster = new three__WEBPACK_IMPORTED_MODULE_1__.Raycaster();
    mouse = new three__WEBPACK_IMPORTED_MODULE_1__.Vector2();
    // スコア表示用のキャンバスの作成
    createScoreCanvas();
    // 立方体の追加
    for (let i = 0; i < 10; i++) {
        const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry();
        const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: Math.random() * 0xffffff });
        const cube = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);
        // ランダムな位置に立方体を配置
        cube.position.x = Math.random() * 10 - 5;
        cube.position.y = Math.random() * 10 - 5;
        cube.position.z = Math.random() * 10 - 5;
        // ランダムな速度を設定
        cube.userData = { velocity: new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(Math.random() * 0.1 - 0.05, Math.random() * 0.1 - 0.05, Math.random() * 0.1 - 0.05) };
        cubes.push(cube);
        scene.add(cube);
    }
    // ウィンドウサイズ変更時の処理を追加
    window.addEventListener('resize', onWindowResize, false);
    // クリック時の処理を追加
    window.addEventListener('click', onClick, false);
}
function createScoreCanvas() {
    // スコア表示用のキャンバス作成
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;
    // キャンバスにスコアを描画
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '48px Arial';
    context.fillStyle = 'white';
    context.fillText('Score: ' + score, 10, 50);
    // キャンバステクスチャを作成
    scoreTexture = new three__WEBPACK_IMPORTED_MODULE_1__.CanvasTexture(canvas);
    scoreMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.SpriteMaterial({ map: scoreTexture });
    scoreMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Sprite(scoreMaterial);
    scoreMesh.scale.set(2, 1, 1); // スケールを調整
    scoreMesh.position.set(-4, 4, 0); // カメラの左上に配置
    scene.add(scoreMesh);
}
function updateScoreCanvas() {
    // スコアキャンバスを更新
    const canvas = scoreTexture.image;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '48px Arial';
    context.fillStyle = 'white';
    context.fillText('Score: ' + score, 10, 50);
    scoreTexture.needsUpdate = true; // テクスチャの更新を通知
}
function onWindowResize() {
    // ウィンドウサイズ変更時にカメラとレンダラーを更新
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    // アニメーションループ
    requestAnimationFrame(animate);
    // 立方体の位置を更新
    cubes.forEach(cube => {
        cube.position.add(cube.userData.velocity);
        // 壁に当たったら反射
        if (cube.position.x > 5 || cube.position.x < -5)
            cube.userData.velocity.x = -cube.userData.velocity.x;
        if (cube.position.y > 5 || cube.position.y < -5)
            cube.userData.velocity.y = -cube.userData.velocity.y;
        if (cube.position.z > 5 || cube.position.z < -5)
            cube.userData.velocity.z = -cube.userData.velocity.z;
    });
    // ボールの位置を更新
    balls.forEach(ball => {
        ball.position.add(ball.userData.velocity);
        checkBallCollision(ball); // ボールの衝突をチェック
    });
    controls.update(); // カメラコントロールを更新
    renderer.render(scene, camera); // シーンをレンダリング
}
function onClick(event) {
    // クリックイベント処理
    if (canShoot) {
        // マウス座標を正規化
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // レイキャスターを設定
        raycaster.setFromCamera(mouse, camera);
        // オブジェクトとの交差をチェック
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            shootBall(intersectedObject.position); // ボールを発射
            canShoot = false;
            // 一定時間後に再び発射可能にする
            setTimeout(() => {
                canShoot = true;
            }, 200); // ボールを連続で打つためのインターバル（200ミリ秒）
        }
    }
}
function shootBall(target) {
    // ボールを発射
    const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(0.1, 32, 32);
    const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0xff0000 });
    const ball = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);
    // カメラの位置から発射
    ball.position.copy(camera.position);
    ball.userData = { velocity: new three__WEBPACK_IMPORTED_MODULE_1__.Vector3().clone().subVectors(target, camera.position).clone().normalize().clone().multiplyScalar(0.2) };
    balls.push(ball);
    scene.add(ball);
}
function checkBallCollision(ball) {
    // ボールと立方体の衝突をチェック
    cubes.forEach(cube => {
        if (ball.position.distanceTo(cube.position) < 0.5) {
            score += 1; // スコアを更新
            updateScoreCanvas(); // スコアキャンバスを更新
            console.log('Score:', score);
            scene.remove(cube); // 立方体をシーンから削除
            cubes = cubes.filter(c => c !== cube);
            scene.remove(ball); // ボールをシーンから削除
            balls = balls.filter(b => b !== ball);
        }
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnOyAvLyBUaHJlZS5qc+OCkuOCpOODs+ODneODvOODiFxuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzJzsgLy8gT3JiaXRDb250cm9sc+OCkuOCpOODs+ODneODvOODiOOBl+OBpuOCq+ODoeODqeOCkuWItuW+oVxuXG5sZXQgc2NlbmUsIGNhbWVyYSwgcmVuZGVyZXIsIGNvbnRyb2xzLCByYXljYXN0ZXIsIG1vdXNlO1xubGV0IGN1YmVzID0gW107XG5sZXQgYmFsbHMgPSBbXTtcbmxldCBzY29yZSA9IDA7XG5sZXQgY2FuU2hvb3QgPSB0cnVlO1xuXG5sZXQgc2NvcmVUZXh0LCBzY29yZVRleHR1cmUsIHNjb3JlTWF0ZXJpYWwsIHNjb3JlTWVzaDtcblxuaW5pdCgpO1xuYW5pbWF0ZSgpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIC8vIOOCt+ODvOODs+OBruS9nOaIkFxuICAgIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcigweGYwZjBmMCk7IC8vIOiDjOaZr+iJsuOCkuaYjuOCi+OBhOOCsOODrOODvOOBq+ioreWumlxuXG4gICAgLy8g44Kr44Oh44Op44Gu5L2c5oiQXG4gICAgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICBjYW1lcmEucG9zaXRpb24ueiA9IDU7XG5cbiAgICAvLyDjg6zjg7Pjg4Djg6njg7zjga7kvZzmiJBcbiAgICByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgLy8g44Kr44Oh44Op44Kz44Oz44OI44Ot44O844Or44Gu6L+95YqgXG4gICAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIFxuICAgIC8vIOODqeOCpOODiOOBrui/veWKoFxuICAgIGNvbnN0IGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDEpO1xuICAgIGxpZ2h0LnBvc2l0aW9uLnNldCgxLCAxLCAxKS5ub3JtYWxpemUoKTtcbiAgICBzY2VuZS5hZGQobGlnaHQpO1xuXG4gICAgLy8g44Os44Kk44Kt44Oj44K544K/44O844Gu6Kit5a6aXG4gICAgcmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlcigpO1xuICAgIG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxuICAgIC8vIOOCueOCs+OCouihqOekuueUqOOBruOCreODo+ODs+ODkOOCueOBruS9nOaIkFxuICAgIGNyZWF0ZVNjb3JlQ2FudmFzKCk7XG5cbiAgICAvLyDnq4vmlrnkvZPjga7ov73liqBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoKTtcbiAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmIH0pO1xuICAgICAgICBjb25zdCBjdWJlID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOODqeODs+ODgOODoOOBquS9jee9ruOBq+eri+aWueS9k+OCkumFjee9rlxuICAgICAgICBjdWJlLnBvc2l0aW9uLnggPSBNYXRoLnJhbmRvbSgpICogMTAgLSA1O1xuICAgICAgICBjdWJlLnBvc2l0aW9uLnkgPSBNYXRoLnJhbmRvbSgpICogMTAgLSA1O1xuICAgICAgICBjdWJlLnBvc2l0aW9uLnogPSBNYXRoLnJhbmRvbSgpICogMTAgLSA1O1xuXG4gICAgICAgIC8vIOODqeODs+ODgOODoOOBqumAn+W6puOCkuioreWumlxuICAgICAgICBjdWJlLnVzZXJEYXRhID0geyB2ZWxvY2l0eTogbmV3IFRIUkVFLlZlY3RvcjMoTWF0aC5yYW5kb20oKSAqIDAuMSAtIDAuMDUsIE1hdGgucmFuZG9tKCkgKiAwLjEgLSAwLjA1LCBNYXRoLnJhbmRvbSgpICogMC4xIC0gMC4wNSkgfTtcblxuICAgICAgICBjdWJlcy5wdXNoKGN1YmUpO1xuICAgICAgICBzY2VuZS5hZGQoY3ViZSk7XG4gICAgfVxuXG4gICAgLy8g44Km44Kj44Oz44OJ44Km44K144Kk44K65aSJ5pu05pmC44Gu5Yem55CG44KS6L+95YqgXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gICAgLy8g44Kv44Oq44OD44Kv5pmC44Gu5Yem55CG44KS6L+95YqgXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaywgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTY29yZUNhbnZhcygpIHtcbiAgICAvLyDjgrnjgrPjgqLooajnpLrnlKjjga7jgq3jg6Pjg7Pjg5DjgrnkvZzmiJBcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY2FudmFzLndpZHRoID0gMjU2O1xuICAgIGNhbnZhcy5oZWlnaHQgPSAxMjg7XG5cbiAgICAvLyDjgq3jg6Pjg7Pjg5DjgrnjgavjgrnjgrPjgqLjgpLmj4/nlLtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknO1xuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBjb250ZXh0LmZvbnQgPSAnNDhweCBBcmlhbCc7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgIGNvbnRleHQuZmlsbFRleHQoJ1Njb3JlOiAnICsgc2NvcmUsIDEwLCA1MCk7XG5cbiAgICAvLyDjgq3jg6Pjg7Pjg5Djgrnjg4bjgq/jgrnjg4Hjg6PjgpLkvZzmiJBcbiAgICBzY29yZVRleHR1cmUgPSBuZXcgVEhSRUUuQ2FudmFzVGV4dHVyZShjYW52YXMpO1xuICAgIHNjb3JlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuU3ByaXRlTWF0ZXJpYWwoeyBtYXA6IHNjb3JlVGV4dHVyZSB9KTtcbiAgICBzY29yZU1lc2ggPSBuZXcgVEhSRUUuU3ByaXRlKHNjb3JlTWF0ZXJpYWwpO1xuICAgIHNjb3JlTWVzaC5zY2FsZS5zZXQoMiwgMSwgMSk7IC8vIOOCueOCseODvOODq+OCkuiqv+aVtFxuXG4gICAgc2NvcmVNZXNoLnBvc2l0aW9uLnNldCgtNCwgNCwgMCk7IC8vIOOCq+ODoeODqeOBruW3puS4iuOBq+mFjee9rlxuICAgIHNjZW5lLmFkZChzY29yZU1lc2gpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTY29yZUNhbnZhcygpIHtcbiAgICAvLyDjgrnjgrPjgqLjgq3jg6Pjg7Pjg5DjgrnjgpLmm7TmlrBcbiAgICBjb25zdCBjYW52YXMgPSBzY29yZVRleHR1cmUuaW1hZ2U7XG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknO1xuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBjb250ZXh0LmZvbnQgPSAnNDhweCBBcmlhbCc7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgIGNvbnRleHQuZmlsbFRleHQoJ1Njb3JlOiAnICsgc2NvcmUsIDEwLCA1MCk7XG5cbiAgICBzY29yZVRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlOyAvLyDjg4bjgq/jgrnjg4Hjg6Pjga7mm7TmlrDjgpLpgJrnn6Vcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gICAgLy8g44Km44Kj44Oz44OJ44Km44K144Kk44K65aSJ5pu05pmC44Gr44Kr44Oh44Op44Go44Os44Oz44OA44Op44O844KS5pu05pawXG4gICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICAvLyDjgqLjg4vjg6Hjg7zjgrfjg6fjg7Pjg6vjg7zjg5dcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG5cbiAgICAvLyDnq4vmlrnkvZPjga7kvY3nva7jgpLmm7TmlrBcbiAgICBjdWJlcy5mb3JFYWNoKGN1YmUgPT4ge1xuICAgICAgICBjdWJlLnBvc2l0aW9uLmFkZChjdWJlLnVzZXJEYXRhLnZlbG9jaXR5KTtcblxuICAgICAgICAvLyDlo4HjgavlvZPjgZ/jgaPjgZ/jgonlj43lsIRcbiAgICAgICAgaWYgKGN1YmUucG9zaXRpb24ueCA+IDUgfHwgY3ViZS5wb3NpdGlvbi54IDwgLTUpIGN1YmUudXNlckRhdGEudmVsb2NpdHkueCA9IC1jdWJlLnVzZXJEYXRhLnZlbG9jaXR5Lng7XG4gICAgICAgIGlmIChjdWJlLnBvc2l0aW9uLnkgPiA1IHx8IGN1YmUucG9zaXRpb24ueSA8IC01KSBjdWJlLnVzZXJEYXRhLnZlbG9jaXR5LnkgPSAtY3ViZS51c2VyRGF0YS52ZWxvY2l0eS55O1xuICAgICAgICBpZiAoY3ViZS5wb3NpdGlvbi56ID4gNSB8fCBjdWJlLnBvc2l0aW9uLnogPCAtNSkgY3ViZS51c2VyRGF0YS52ZWxvY2l0eS56ID0gLWN1YmUudXNlckRhdGEudmVsb2NpdHkuejtcbiAgICB9KTtcblxuICAgIC8vIOODnOODvOODq+OBruS9jee9ruOCkuabtOaWsFxuICAgIGJhbGxzLmZvckVhY2goYmFsbCA9PiB7XG4gICAgICAgIGJhbGwucG9zaXRpb24uYWRkKGJhbGwudXNlckRhdGEudmVsb2NpdHkpO1xuICAgICAgICBjaGVja0JhbGxDb2xsaXNpb24oYmFsbCk7IC8vIOODnOODvOODq+OBruihneeqgeOCkuODgeOCp+ODg+OCr1xuICAgIH0pO1xuXG4gICAgY29udHJvbHMudXBkYXRlKCk7IC8vIOOCq+ODoeODqeOCs+ODs+ODiOODreODvOODq+OCkuabtOaWsFxuICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTsgLy8g44K344O844Oz44KS44Os44Oz44OA44Oq44Oz44KwXG59XG5cbmZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQpIHtcbiAgICAvLyDjgq/jg6rjg4Pjgq/jgqTjg5njg7Pjg4jlh6bnkIZcbiAgICBpZiAoY2FuU2hvb3QpIHtcbiAgICAgICAgLy8g44Oe44Km44K55bqn5qiZ44KS5q2j6KaP5YyWXG4gICAgICAgIG1vdXNlLnggPSAoZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIDIgLSAxO1xuICAgICAgICBtb3VzZS55ID0gLSAoZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkgKiAyICsgMTtcblxuICAgICAgICAvLyDjg6zjgqTjgq3jg6Pjgrnjgr/jg7zjgpLoqK3lrppcbiAgICAgICAgcmF5Y2FzdGVyLnNldEZyb21DYW1lcmEobW91c2UsIGNhbWVyYSk7XG5cbiAgICAgICAgLy8g44Kq44OW44K444Kn44Kv44OI44Go44Gu5Lqk5beu44KS44OB44Kn44OD44KvXG4gICAgICAgIGNvbnN0IGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyhzY2VuZS5jaGlsZHJlbik7XG5cbiAgICAgICAgaWYgKGludGVyc2VjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJzZWN0ZWRPYmplY3QgPSBpbnRlcnNlY3RzWzBdLm9iamVjdDtcbiAgICAgICAgICAgIHNob290QmFsbChpbnRlcnNlY3RlZE9iamVjdC5wb3NpdGlvbik7IC8vIOODnOODvOODq+OCkueZuuWwhFxuICAgICAgICAgICAgY2FuU2hvb3QgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIOS4gOWumuaZgumWk+W+jOOBq+WGjeOBs+eZuuWwhOWPr+iDveOBq+OBmeOCi1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FuU2hvb3QgPSB0cnVlO1xuICAgICAgICAgICAgfSwgMjAwKTsgLy8g44Oc44O844Or44KS6YCj57aa44Gn5omT44Gk44Gf44KB44Gu44Kk44Oz44K/44O844OQ44Or77yIMjAw44Of44Oq56eS77yJXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNob290QmFsbCh0YXJnZXQpIHtcbiAgICAvLyDjg5zjg7zjg6vjgpLnmbrlsIRcbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjEsIDMyLCAzMik7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAgfSk7XG4gICAgY29uc3QgYmFsbCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICAvLyDjgqvjg6Hjg6njga7kvY3nva7jgYvjgonnmbrlsIRcbiAgICBiYWxsLnBvc2l0aW9uLmNvcHkoY2FtZXJhLnBvc2l0aW9uKTtcbiAgICBiYWxsLnVzZXJEYXRhID0geyB2ZWxvY2l0eTogbmV3IFRIUkVFLlZlY3RvcjMoKS5zdWJWZWN0b3JzKHRhcmdldCwgY2FtZXJhLnBvc2l0aW9uKS5ub3JtYWxpemUoKS5tdWx0aXBseVNjYWxhcigwLjIpIH07XG5cbiAgICBiYWxscy5wdXNoKGJhbGwpO1xuICAgIHNjZW5lLmFkZChiYWxsKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tCYWxsQ29sbGlzaW9uKGJhbGwpIHtcbiAgICAvLyDjg5zjg7zjg6vjgajnq4vmlrnkvZPjga7ooZ3nqoHjgpLjg4Hjgqfjg4Pjgq9cbiAgICBjdWJlcy5mb3JFYWNoKGN1YmUgPT4ge1xuICAgICAgICBpZiAoYmFsbC5wb3NpdGlvbi5kaXN0YW5jZVRvKGN1YmUucG9zaXRpb24pIDwgMC41KSB7XG4gICAgICAgICAgICBzY29yZSArPSAxOyAvLyDjgrnjgrPjgqLjgpLmm7TmlrBcbiAgICAgICAgICAgIHVwZGF0ZVNjb3JlQ2FudmFzKCk7IC8vIOOCueOCs+OCouOCreODo+ODs+ODkOOCueOCkuabtOaWsFxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Njb3JlOicsIHNjb3JlKTtcbiAgICAgICAgICAgIHNjZW5lLnJlbW92ZShjdWJlKTsgLy8g56uL5pa55L2T44KS44K344O844Oz44GL44KJ5YmK6ZmkXG4gICAgICAgICAgICBjdWJlcyA9IGN1YmVzLmZpbHRlcihjID0+IGMgIT09IGN1YmUpO1xuICAgICAgICAgICAgc2NlbmUucmVtb3ZlKGJhbGwpOyAvLyDjg5zjg7zjg6vjgpLjgrfjg7zjg7PjgYvjgonliYrpmaRcbiAgICAgICAgICAgIGJhbGxzID0gYmFsbHMuZmlsdGVyKGIgPT4gYiAhPT0gYmFsbCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfdGhyZWVfZXhhbXBsZXNfanNtX2NvbnRyb2xzX09yYml0Q29udHJvbHNfanNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=