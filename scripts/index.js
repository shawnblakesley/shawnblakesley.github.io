/**
 *  globals
 */
var camera, scene, renderer, projector;
var menu;
const cube_space = 3.0;

/**
 *  
 */
function init()
{
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 5;
  menu = new THREE.Object3D();

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  projector = new THREE.Projector();

  var cube_geometry = new THREE.CubeGeometry(1,1,1);
  
  var tex = THREE.ImageUtils.loadTexture('resources/sample.png');
  var cube_material = new THREE.MeshLambertMaterial({color: 0xffffff, map: tex});
  var cube = new THREE.Mesh(cube_geometry, cube_material);
  cube.name = 'samples.html';
  menu.add(cube);

  tex = THREE.ImageUtils.loadTexture('resources/linked.png');
  cube_material = new THREE.MeshLambertMaterial({color: 0xffffff, map: tex});
  cube = new THREE.Mesh(cube_geometry, cube_material);
  cube.name = 'http://www.linkedin.com/in/shawnblakesley';
  cube.position.x = cube_space;
  menu.add(cube);

  tex = THREE.ImageUtils.loadTexture('resources/about.png');
  cube_material = new THREE.MeshLambertMaterial({color: 0xffffff, map: tex});
  cube = new THREE.Mesh(cube_geometry, cube_material);
  cube.position.x = -cube_space;
  cube.name = 'about.html';
  menu.add(cube);

  var red_light = new THREE.PointLight(0xff0000);
  red_light.position.set(-100,100,100);
  scene.add(red_light);

  var green_light = new THREE.DirectionalLight(0x00ff00);
  green_light.position.set(100,100,100);
  scene.add(green_light);

  var blue_light = new THREE.PointLight(0x0000ff);
  blue_light.position.set(100,-100,100);
  scene.add(blue_light);

  scene.add(menu);
}
var rotation_factor = new THREE.Vector3(0,0,0);
function render()
{
  requestAnimationFrame(render);
  var children = menu.getDescendants();
  for(var i = 0;i < children.length;i++)
  {
    children[i].rotation.x = rotation_factor.x;
    children[i].rotation.y = rotation_factor.y;
  }
  renderer.render(scene, camera);
}
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
function onDocumentMouseMove(event)
{
  rotation_factor = new THREE.Vector3(((event.clientY / window.innerHeight) - 0.5),((event.clientX / window.innerWidth) - 0.5),0);
}
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
function onDocumentMouseDown(event)
{
  event.preventDefault();

  var canvasPosition = renderer.domElement.getBoundingClientRect();
  var mouseX = event.clientX - canvasPosition.left;
  var mouseY = event.clientY - canvasPosition.top;

  var mouseVec = new THREE.Vector3( 2 * ( mouseX / window.innerWidth ) - 1, 1 - 2 * ( mouseY / window.innerHeight ));

  var ray = projector.pickingRay( mouseVec.clone(), camera );

  var intersects = ray.intersectObject( menu, true );
  if ( intersects.length > 0 ) {
    window.location.href = intersects[0].object.name;
    //TODO modify this section to use particles
    //sphere.position = intersects[0].point; //used to get the position of the click
    //intersects[0].object.add(sphere); //used to add an object to the heirarchy (should probably add to scene)
  }
}

init();
render();