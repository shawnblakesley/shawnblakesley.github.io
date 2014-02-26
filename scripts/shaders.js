/**
 *  globals
 */
var camera, scene, renderer;
var teapot;
var light;
var teapot_material;

/**
 *  
 */
function init()
{
  scene = new THREE.Scene();
  //scene.fog = new THREE.Fog(0x000000, 0.5, 6);
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  projector = new THREE.Projector();

  // LIGHTS
  var ambientLight = new THREE.AmbientLight(0x333333); // 0.2

  light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
  light.position.set(320, 390, 700);

  scene.add(ambientLight);
  scene.add(light);

  var teapot_geometry = new THREE.TeapotGeometry(2, 20, true, true, true, true);
  var materialColor = new THREE.Color();
  materialColor.setRGB(0.6, 0.8, 1.0);
  teapot_material = createShaderMaterial("toon_shader", light, materialColor);

  teapot = new THREE.Mesh(teapot_geometry, teapot_material);
  scene.add(teapot);
  camera.position.z = 5;

  // CONTROLS
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 0, 0);
}

function loadShader(shadertype) {
  return document.getElementById(shadertype).textContent;
}

function createShaderMaterial(id, light, materialColor) {

  // could be a global, defined once, but here for convenience
  var shaderTypes = {
    'toon_shader' : {

      uniforms: {

        "uDirLightPos": { type: "v3", value: new THREE.Vector3() },
        "uDirLightColor": { type: "c", value: new THREE.Color( 0xFFFFFF ) },

        "uMaterialColor": { type: "c", value: new THREE.Color( 0xFFFFFF ) },

        uKd: {
          type: "f",
          value: 0.7
        },
        uBorder: {
          type: "f",
          value: 0.4
        }
      }
    }
  };
  var shader = shaderTypes[id];
  var u = THREE.UniformsUtils.clone(shader.uniforms);
  var vs = loadShader("vertexShader");
  var fs = loadShader("fragmentShader");
  var material = new THREE.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs });

  material.uniforms.uDirLightPos.value = light.position;
  material.uniforms.uDirLightColor.value = light.color;
  material.uniforms.uMaterialColor.value.copy(materialColor);

  return material;
}

function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  teapot.rotation.y += 0.005; //TODO: tie this to a slider
  teapot_material.uniforms.uDirLightPos.value = light.position;
  //TODO: Attach uBorder to a slider
  //TODO: add a slider for checker size
}

/*document.addEventListener( 'mousemove', onDocumentMouseMove, false );
function onDocumentMouseMove(event)
{

}//*/
/*document.addEventListener( 'mousedown', onDocumentMouseDown, false );
function onDocumentMouseDown(event)
{

}//*/

init();
render();