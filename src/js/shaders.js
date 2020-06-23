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
      "uPrimaryColor": { type: "v3", value: new THREE.Vector3(2.0, 0.0, 0.0)},
      "uSecondaryColor": { type: "v3", value: new THREE.Vector3(1.5, 1.0, 0.0)},

      uShine: {
        type: "f",
        value:0.1
      },
      uBorder: {
        type: "f",
        value: 0.4
      },
      uCheckerSize: {
        type: "f",
        value: 0.2
      }
    }
  },
  'placeholder_shader' : {
    uniforms: {

    }
  }
};

if (!window.WebGLRenderingContext) {
  // the browser doesn't even know what WebGL is
  window.location.href = "http://get.webgl.org";
} else {
  /* This is currently not working
  var canvas = document.getElementsByTagName("canvas");
  var context = canvas.item(0).getContext("webgl");
  if (!context) {
    // browser supports WebGL but initialization failed.
    window.location = "http://get.webgl.org/troubleshooting";
  }//*/
}

/**
 *  Responsible for all of the initialization routines
 *  Sets up the scene, renderer, camera, lights and objects
 */
function init()
{
  document.getElementById( "shader" );
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 0.5, 6);
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.getElementById( "shader" ).appendChild( renderer.domElement );

  projector = new THREE.Projector();

  // LIGHTS
  var ambientLight = new THREE.AmbientLight(0x333333); // 0.2

  light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
  light.position.set(320, 390, 700);

  scene.add(ambientLight);
  scene.add(light);

  var materialColor = new THREE.Color();
  materialColor.setRGB(1.0, 1.0, 1.0);
  teapot_material = createShaderMaterial("toon_shader", light, materialColor);

  teapot = new THREE.Mesh(teapot_geometry, teapot_material);
  scene.add(teapot);
  camera.position.z = 5;

  // CONTROLS
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 0, 0);
}

/*
 *  Loads the text of a given shader
 */
function loadShader(shadertype) 
{
  return document.getElementById(shadertype).textContent;
}

/*
 *  Creates and loads custom shaders
 *  Based on code provided in Udacity's Interactive 3D Programming Course
 */
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
  else if(id === 'placeholder_shader')
  {
    //Do anything specific for placeholder shader
    //currently not implemented
    var is_chrome = window.chrome;
    if(is_chrome)
    {
      //alert only seems to work correctly on chrome
      alert("This shader is not yet implemented");
    }
  }
  else
  {
    alert("The given shader id was unrecognized: " + id);
  }
  return material;
}

/*
 *  Sets up the gui elements using dat.GUI
 *  This includes a selector for shaders, sliders for uniforms, and movement controls for the teapot
 */
function createGui()
{
  guiController = {
    shader: "toon_shader",
    border: 0.4,
    checker_size: 0.2,
    shininess: 0.5,
    primary_r: 1.0,    
    primary_g: 0.0,
    primary_b: 0.0,
    secondary_r: 1.0,
    secondary_g: 0.65,
    secondary_b: 0.0,    
    rot_x: 0.0,
    rot_y: 0.005,
    rot_z: 0.0
  };
  //guiController = new GuiController();
  var gui = new dat.GUI({autoPlace: false});
  gui.add(guiController, 'shader', ['toon_shader', 'placeholder_shader']);
  gui.add(guiController, 'border', 0.0, 1.0);
  gui.add(guiController, 'checker_size', 0.0, 4.0);
  gui.add(guiController, 'shininess', 0.0, 1.0);
  var folder = gui.addFolder('Color');
  folder.add(guiController, 'primary_r', 0.0, 2.0);
  folder.add(guiController, 'primary_g', 0.0, 2.0);
  folder.add(guiController, 'primary_b', 0.0, 2.0);
  folder.add(guiController, 'secondary_r', 0.0, 2.0);
  folder.add(guiController, 'secondary_g', 0.0, 2.0);
  folder.add(guiController, 'secondary_b', 0.0, 2.0);
  folder = gui.addFolder('Movement');
  folder.add(guiController, 'rot_x', -0.01, 0.01);
  folder.add(guiController, 'rot_y', -0.01, 0.01);
  folder.add(guiController, 'rot_z', -0.01, 0.01);
  var customContainer = document.getElementById('shader-controls');
  customContainer.appendChild(gui.domElement);
}

/*
 *  Renders the scene, and handles updates based on which shader is in use.
 *  Will probably extract each update type into it's own method for readability
 *  as this program expands in size.
 */
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
    teapot_material.uniforms.uBorder.value = guiController.border;
    teapot_material.uniforms.uShine.value = guiController.shininess;  //TODO: Make shininess actually do something
    teapot_material.uniforms.uCheckerSize.value = guiController.checker_size;
    teapot_material.uniforms.uPrimaryColor.value = new THREE.Vector3(guiController.primary_r, guiController.primary_g, guiController.primary_b);
    teapot_material.uniforms.uSecondaryColor.value = new THREE.Vector3(guiController.secondary_r, guiController.secondary_g, guiController.secondary_b);
  }

  renderer.render(scene, camera);
}

//The following code exists in case I want to add some clicking/mouse tracking
/*
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
function onDocumentMouseMove(event)
{

}//*/
/*
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
function onDocumentMouseDown(event)
{

}//*/

createGui();
init();
render();
