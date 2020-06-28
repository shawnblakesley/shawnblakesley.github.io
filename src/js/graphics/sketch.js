//draw a spinning teapot

let selected = "suzanne"
let modelMap;
let theShader;
var canvas;
var easycam;

function preload() {
    // Load model with normalise parameter set to true
    modelMap = {
        "teapot": loadModel('/data/teapot.obj', true),
        "bunny": loadModel('/data/bunny.obj', true),
        "suzanne": loadModel('/data/suzanne.obj', true)
    }
    theShader = loadShader('/shaders/toon.vert', '/shaders/toon.frag');
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight - 185, WEBGL);
    canvas.parent("p5");
    easycam = createEasyCam({
        rotation: [0.7071068, 0.7071068, 0, 4.4427519]
    });
    // 
    easycam.setRotation(Dw.Rotation.create({
        angles_xyz: [PI, 2 * PI, 0]
    }), 0);
    easycam.reset(1000);
    // cameras[i].setDistance(random(400, 600), 2000);
    sel = createSelect();
    sel.position(10, 10);
    sel.option('suzanne');
    sel.option('teapot');
    sel.option('bunny');
    sel.changed(() => {
        selected = sel.value();
        easycam.reset(1000);
    });
    noStroke();


    shader(theShader);
    theShader.setUniform('fraction', 1.0);
}

function draw() {
    background(100);

    // shaderTypes(theShader);
    shader(theShader);
    let dirY = (mouseY / height - 0.5) * 2;
    let dirX = map(mouseX, 0, width, 3, 0);
    directionalLight(255, 204, 204, dirX, -dirY, -1);
    ambientMaterial(0, 255, 255);

    push();
    scale(2);
    // rotateX(PI + frameCount * 0.001);
    // rotateY(frameCount * 0.01);
    model(modelMap[selected]);
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 185);
    resizeEasyCam();
}






















// -- 

// const margins = 200;
// const rowHeight = 100;
// // To add a test, raise this number by the number of rows that you wish to add
// // then add your test at the bottom of draw()
// const numberOfRows = 10;
// const uniqueGeometry = 6;
// let columnWidth;

// let currentX,
//     currentY,
//     theta = 0;

// // let img;

// function preload() {
//     // img = loadImage('../assets/cat.jpg');
// }

// function setup() {
//     setAttributes('perPixelLighting', true);
//     createCanvas(windowWidth, rowHeight * numberOfRows, WEBGL);
//     columnWidth = (width - margins) / uniqueGeometry;
// }

// function draw() {
//     background(150, 150, 150, 255);

//     // ambientMaterial() + ambientLight()
//     currentY = -rowHeight * (numberOfRows / 2);
//     translate(0, currentY, 0);
//     push();
//     noStroke();
//     ambientMaterial(200, 100, 100);
//     ambientLight(255);
//     drawGeometryRow();
//     pop();

//     // ambientMaterial() + ambientLight()
//     translate(0, rowHeight, 0);
//     currentY += rowHeight;
//     push();
//     noStroke();
//     emissiveMaterial(200, 100, 100);
//     drawGeometryRow();
//     pop();

//     // ambientLight() + pointLight() + specularMaterial with low shininess()
//     translate(0, rowHeight, 0);
//     currentY += rowHeight;
//     push();
//     ambientLight(0, 0, 150);
//     pointLight(200, 0, 0, 0, 0, 0);
//     directionalLight(0, 200, 0, 0.5, 0, -1);
//     noStroke();
//     specularMaterial(250);
//     shininess(0.1);
//     drawGeometryRow();
//     pop();

//     // ambientLight() + pointLight() + specularMaterial with low shininess()
//     translate(0, rowHeight, 0);
//     currentY += rowHeight;
//     push();
//     ambientLight(0, 0, 150);
//     pointLight(200, 0, 0, 0, 0, 0);
//     directionalLight(0, 200, 0, 0.5, 0, -1);
//     noStroke();
//     specularMaterial(250);
//     shininess(10);
//     drawGeometryRow();
//     pop();

//     // ambientLight() + pointLight() + fill with high lightFalloff()
//     translate(0, rowHeight, 0);
//     currentY += rowHeight;
//     push();
//     ambientLight(100, 200, 100);
//     pointLight(0, 0, 200, 0, 0, 0);
//     noStroke();
//     lightFalloff(1, 0, 0);
//     drawGeometryRow();
//     pop();

//     // ambientLight() + pointLight() + fill with high lightFalloff()
//     translate(0, rowHeight, 0);
//     currentY += rowHeight;
//     push();
//     ambientLight(100, 200, 100);
//     pointLight(0, 0, 200, 0, 0, 0);
//     noStroke();
//     lightFalloff(0.1, 0, 0);
//     drawGeometryRow();
//     pop();

//     // texture() + directionalLight()
//     translate(0, rowHeight, 0);
//     currentY += rowHeight;
//     // push();
//     // ambientLight(255);
//     // directionalLight(200, 0, 0, 0.5, 0, -1);
//     // noStroke();
//     // // texture(img);
//     // drawGeometryRow();
//     // pop();

//     //specularColor()
//     noStroke();
//     translate(0, rowHeight, 0);
//     currentY += rowHeight;
//     push();
//     shininess(10);
//     ambientLight(50);
//     specularColor(250, 0, 0);
//     pointLight(255, 0, 0, 0, -100, 100);
//     specularColor(0, 250, 0);
//     pointLight(0, 255, 0, 0, 100, 100);
//     specularMaterial(255);
//     drawGeometryRow();
//     pop();

//     // spotLight()
//     translate(0, rowHeight, 0);
//     currentY += rowHeight;
//     push();
//     ambientLight(50);
//     spotLight(0, 250, 0, 0, currentY + 100, 200, 0, 0, -1, 10, 3);
//     spotLight(0, 0, 250, -width / 2, currentY, 100, 1, 0, 0, 100, 25);
//     ambientMaterial(250);
//     drawGeometryRow();
//     pop();

//     translate(0, rowHeight, 0);
//     currentY += rowHeight;
//     push();
//     fill(255);
//     ambientLight(150);
//     pointLight(200, 200, 200, 0, 0, 0);
//     drawGeometryRow(() => {
//         noLights();
//         fill(255);
//     });
//     pop();

//     // to add test, copy-paste the following lines and uncomment
//     // translate(0, rowHeight, 0);
//     // currentY += rowHeight;
//     // push();
//     // Add your lighting and material conditions here :-)
//     // drawGeometryRow(); // you can change condition halfway through a row by adding a function argument
//     // pop();

//     theta += 0.05;
// }

// function drawGeometryRow(callInMiddle) {
//     currentX = -columnWidth * (uniqueGeometry / 2);
//     translate(currentX, 0, 0);
//     drawObject(() => {
//         plane(25);
//     });

//     translate(columnWidth, 0, 0);
//     currentX += columnWidth;
//     drawObject(() => {
//         box(25, 25, 25);
//     });

//     translate(columnWidth, 0, 0);
//     currentX += columnWidth;
//     drawObject(() => {
//         cylinder(25, 25);
//     });

//     translate(columnWidth, 0, 0);
//     currentX += columnWidth;
//     drawObject(() => {
//         cone(25, 25);
//     });

//     if (typeof callInMiddle === 'function') {
//         callInMiddle();
//     }

//     translate(columnWidth, 0, 0);
//     currentX += columnWidth;
//     drawObject(() => {
//         torus(25, 10);
//     });

//     translate(columnWidth, 0, 0);
//     currentX += columnWidth;
//     drawObject(() => {
//         sphere(25);
//     });

//     translate(columnWidth, 0, 0);
//     currentX += columnWidth;
//     drawObject(() => {
//         rect(0, 0, 25, 25);
//     });
// }

// function drawObject(geom) {
//     push();
//     _rotate();
//     geom();
//     pop();
// }

// function _rotate() {
//     rotateZ(theta * mouseX * 0.001);
//     rotateX(theta * mouseX * 0.001);
//     rotateY(theta * mouseX * 0.001);
// }