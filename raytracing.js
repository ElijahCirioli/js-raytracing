var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

//objects
var c; //the camera object
var ground; //the ground plane object

//lists
var objects = []; //all objects in the scene
var unsorted = []; //unsorted list of the same objects (for menu purposes)
var lights = []; //all light sources in the scene

//settings
var focalLength = 520; //camera distance from image
var fov = Math.round(360 * Math.atan2(300, focalLength) / Math.PI); //the camera's viewing angle
var precision = 0.5; //precision cutoff for ray marching, don't really worry about it
var maxShadow = 0.8; //the alpha value for the maximum darkness of shadows (1=black, 0=no shadows)
var maxHighlight = 0.65; //the alpha value for the maximum brightness of highlights (1=white, 0=no highlights)
var backgroundColor = "#b5e3eb"; //the skybox color
var lightColor = "#fbfcde"; //color that lights shine (yellowish-white)
var lightIntensity = 400000; //the intensity of light (diminishes with inverse-square law)
var shadowFloor = 1; //the cutoff point where something becomes a shadow vs a highlight
var highlightCeiling = 5; //the brightness highlights cap out at (lower=less dynamic range)
var gamma = 0; //arbitrarily added brightness
var maxReflections = 4; //maximum amount of time rays can bounce of reflective objects
var reflectivity = 1; //the amount of light that gets reflected vs diffused (0=no reflections, 2=perfectly reflective)
var maxRayLength = 100000000; //squared maximum length for a ray (10,000)

//run on window load
function setup() {
  //create camera
  c = new Camera(focalLength)
  
  //populate object array
  preset1();
}

//blue sky scene with minimal reflections and only one light source
function preset1() {
  //empty arrays
  objects = [];
  lights = [];
  
  //global variables
  reflectivity = 1;
  backgroundColor = "#b5e3eb";
  ground = new Plane(1000, "#ffe1ba", false);
  
  //create objects
  objects.push(new Sphere(750, 170, 945, 160, "#ff0000", false, false));
  objects.push(new Sphere(330, 620, 1000, 200, "#00ff00", false, false));
  objects.push(new Sphere(145, 135, 1450, 300, "#0000ff", false, true));
  
  objects.push(new Sphere(740, -110, 475, 100, lightColor, true, false));
  
  objects.push(new Cube(-220, -100, 870, 160, "#fcdf03", false, false));
  objects.push(new Cube(700, 700, 720, 60, "#9e59ff", false, false));
  objects.push(ground);
  
  unsorted = objects.slice();
}

//black sky scene showing off reflections and multiple light sources
function preset2() {
  //empty arrays
  objects = [];
  lights = [];
  
  //global variables
  reflectivity = 1.5;
  backgroundColor = "#000000";
  ground = new Plane(1000, "#edd1ab", false);
  
  //create objects
  objects.push(new Sphere(750, 170, 945, 160, "#ff0000", false, true));
  objects.push(new Sphere(330, 620, 1000, 200, "#00ff00", false, true));
  objects.push(new Sphere(145, 135, 1350, 300, "#0000ff", false, true));
  
  objects.push(new Sphere(500, -100, 530, 120, lightColor, true, false));
  
  objects.push(new Cube(-300, 350, 900, 140, "#fcdf03", false, false));
  objects.push(new Cube(700, 700, 700, 60, lightColor, true, false));
  objects.push(ground);
  
  unsorted = objects.slice();
}

//returns distance between two 3D vectors
function distance(v1, v2) {
  return Math.sqrt(((v1.x - v2.x) * (v1.x - v2.x)) + ((v1.y - v2.y) * (v1.y - v2.y)) + ((v1.z - v2.z) * (v1.z - v2.z)));
}

//returns square of distance between two 3D vectors for optimization purposes
function squareDist(v1, v2) {
  return ((v1.x - v2.x) * (v1.x - v2.x)) + ((v1.y - v2.y) * (v1.y - v2.y)) + ((v1.z - v2.z) * (v1.z - v2.z));
}