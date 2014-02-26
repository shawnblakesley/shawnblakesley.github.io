/**
 *  globals
 */
var camera, scene, renderer, projector;
var cube;
var sphere = {};
sphere.length = 6;
var difference = 0.01;
var max_scale = 1.5;
var min_scale = 0.5;

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

  var cube_geometry = new THREE.CubeGeometry(1,1,1);
  var sphere_geometry = new THREE.SphereGeometry(0.5,32,32);
  var cube_material = new THREE.MeshLambertMaterial({color: 0x1aff1a});
  var sphere_material = new THREE.MeshPhongMaterial({color: 0x2eff2e});

  cube = new THREE.Mesh(cube_geometry, cube_material);
  scene.add(cube);
  var sphere_dist = 1.5;
  for(var i = 0;i < sphere.length;i++)
  {
    sphere[i] = new THREE.Mesh(sphere_geometry, sphere_material);
    switch(i)
    {
      case 0:
        sphere[i].position.x = sphere_dist;
        break;
      case 1:
        sphere[i].position.x = -sphere_dist;
        break;
      case 2:
        sphere[i].position.y = sphere_dist;
        break;
      case 3:
        sphere[i].position.y = -sphere_dist;
        break;
      case 4:
        sphere[i].position.z = sphere_dist;
        break;
      case 5:
        sphere[i].position.z = -sphere_dist;
        break;
    }
    sphere[i].scale.set(0.8, 0.8, 0.8);
    cube.add(sphere[i]);
  }

  var red_light = new THREE.PointLight(0xff0000);
  red_light.position.set(-100,100,100);
  scene.add(red_light);

  var green_light = new THREE.DirectionalLight(0x00ff00);
  green_light.position.set(100,100,100);
  scene.add(green_light);

  var blue_light = new THREE.PointLight(0x0000ff);
  blue_light.position.set(100,-100,100);
  scene.add(blue_light);

  camera.position.z = 5;
}
var rotation_factor = new THREE.Vector3(0,0,0);
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  var new_scale = sphere[0].scale.x + difference;
  for(var i = 0;i < sphere.length;i++)
  {
    sphere[i].scale.set(new_scale, new_scale, new_scale);
  }
  if(new_scale >= max_scale || new_scale <= min_scale)
  {
    difference = -difference;
  }
  cube.rotation.x += rotation_factor.y;
  cube.rotation.y += rotation_factor.x;

  scene.rotation.x += 0.01;
}
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
function onDocumentMouseMove(event)
{
  rotation_factor = new THREE.Vector3(((event.clientX / window.innerWidth) - 0.5) / 20,((event.clientY / window.innerHeight) - 0.5) / 20,0);
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

  var intersects = ray.intersectObject( cube, true );
  if ( intersects.length > 0 ) {
    //TODO modify this section to use particles
    //sphere.position = intersects[0].point; //used to get the position of the click
    //intersects[0].object.add(sphere); //used to add an object to the heirarchy (should probably add to scene)
  }
}

init();
render();