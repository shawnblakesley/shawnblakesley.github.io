/**
 *  globals
 */
var camera, scene, renderer;
var teapot;
var light;
var teapot_material;
var guiController;
var teapot_geometry = new THREE.TeapotGeometry(2, 20, true, true, true, true);

// Definition of shader types to allow for easier switching between shaders
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
  },
  'env_shader' : {
    uniforms: {

    }
  }
};

/**
 *  
 */
function init()
{
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 0.5, 6);
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

function loadShader(shadertype) 
{
  return document.getElementById(shadertype).textContent;
}

function createShaderMaterial(id, light, materialColor) 
{
  var shader = shaderTypes[id];
  var u = THREE.UniformsUtils.clone(shader.uniforms);
  var vs = loadShader(id + "_vertex");
  var fs = loadShader(id + "_fragment");
  var material = new THREE.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs });
  material.name = id;
  if(id === 'toon_shader')
  {
    material.uniforms.uDirLightPos.value = light.position;
    material.uniforms.uDirLightColor.value = light.color;
    material.uniforms.uMaterialColor.value.copy(materialColor);
  }
  else if(id === 'env_shader')
  {
    //Do anything specific for env shader
    //currently not implemented
    alert("This shader is not yet implemented");
  }
  else
  {
    alert("The given shader id was unrecognized: " + id);
  }
  return material;
}

function createGui()
{
  guiController = {
    shader: "toon_shader",
    kd: 0.7,
    border: 0.4,
    rot_x: 0.0,
    rot_y: 0.005,
    rot_z: 0.0
  }
  var gui = new dat.GUI();
  gui.add(guiController, 'shader', ['toon_shader', 'env_shader']);
  gui.add(guiController, 'border', 0.0, 1.0);
  gui.add(guiController, 'kd', 0.0, 1.0);
  var folder = gui.addFolder('Movement');
  folder.add(guiController, 'rot_x', -0.01, 0.01);
  folder.add(guiController, 'rot_y', -0.01, 0.01);
  folder.add(guiController, 'rot_z', -0.01, 0.01);
}

function render()
{
  requestAnimationFrame(render);
  teapot.rotation.x += guiController.rot_x;
  teapot.rotation.y += guiController.rot_y;
  teapot.rotation.z += guiController.rot_z;
  if(teapot_material.name !== guiController.shader)
  {
    var materialColor = new THREE.Color();
    materialColor.setRGB(0.6, 0.8, 1.0);
    teapot_material = createShaderMaterial(guiController.shader, light, materialColor);
    scene.remove(teapot);
    teapot = new THREE.Mesh(teapot_geometry, teapot_material);
    scene.add(teapot);
  }
  if(teapot_material.name === 'toon_shader')
  {
    teapot_material.uniforms.uDirLightPos.value = light.position;
    teapot_material.uniforms.uKd.value = guiController.kd;
    teapot_material.uniforms.uBorder.value = guiController.border;
  }
  //TODO: add a slider for checker size

  renderer.render(scene, camera);
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
createGui();
render();