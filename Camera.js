class Camera {
  constructor(z) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.z = -z;
  }
  
  render() {    
    //draw background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    //cast rays
    for (var y = 0; y < canvas.height; y++) {
      for (var x = 0; x < canvas.width; x++) {
        
        //determine whether ray will eventually hit ground to see what distance we need to cap it at
        var len = maxRayLength;
        if (y > canvas.height / 2) {
          len = maxRayLength * 3;
        }
        
        //create ray object starting at camera and intersecting screen coordinates
        var ray = new Ray(this, new Vec(x + 0.5, y + 0.5, 0), len);
        
        //if ray collides with object
        if (ray.obj !== null) {
          //draw base pixel
          context.fillStyle = ray.obj.color;
          context.fillRect(x, y, 1, 1);
          
          //if ray is reflective
          if (ray.obj.ref) {
            this.reflect(x, y, ray, maxReflections);
          }
          
          //draw shading/highlights on top of base pixel
          var totalLight = this.getLightAmount(ray);
          this.drawLight(x, y, totalLight, 1);
        }
      }
    }
  }
  
  //calculate amount of light received by given ray
  getLightAmount(ray) {
    //make sure ray hasn't just collided with a light
    if (!ray.obj.light) {
      var totalLight = 0;
      
      //iterate through all light sources
      for (var l = 0; l < lights.length; l++) {
        //cast ray towards light source to see if there's obstructions
        var shadowRay = new Ray(ray.obj.surface(ray.pos), lights[l], maxRayLength * 3);
        
        //if unobstructed
        if (lights.includes(shadowRay.obj)) {
          
          //calculate normal vector from light to object
          var lightVec = lights[l].normal(ray.pos);
          if (lights[l] instanceof Cube) {
            lightVec = lights[l].normalLight(ray.pos);
          }
          
          //calulate light amount by dotting the the two normal unit vectors to get the cos of their angle
          //then multiply by the light intensity over the distance between them squared
          totalLight += Math.abs(lightVec.dot(ray.obj.normal(ray.pos))) * lightIntensity / Math.pow(lights[l].distance(ray.pos), 2);
        }
      }
      
      //average the amount of light recieved over the amount of lights in the scene and add gamma
      totalLight /= lights.length;
      totalLight += gamma;
      
      //make sure it's not too high a value
      if (totalLight > highlightCeiling + shadowFloor) {
        totalLight = highlightCeiling + shadowFloor;
      }
      return totalLight;
    } else {
      //return flat unshaded amount of light (for reflecting with lightsources)
      return shadowFloor;
    }
  }
  
  //correctly shade a given pixel for a given amount of light
  drawLight(x, y, light, weight) {
    //if the light is a shadow or a highlight
    if (light < shadowFloor) {
      var shade = (shadowFloor - light) * maxShadow * weight;
      if (shade > 1) {
        shade = 1;
      }
      context.fillStyle = "rgba(0, 0, 0, " + shade + ")";
      context.fillRect(x, y, 1, 1);
    } else {
      var highlight = (light - shadowFloor) / highlightCeiling;
      highlight = Math.floor((highlight * maxHighlight * 255) * weight).toString(16);
      if (highlight.length === 1) {
        highlight = "0" + highlight;
      }
      
      context.fillStyle = lightColor + highlight;
      context.fillRect(x, y, 1, 1);
    }
  }
  
  //recursively calculate and draw reflections from a given ray to a given pixel on screen
  reflect(x, y, ray, depth) {
    //make sure this isn't base case
    if (depth > 0) {
      //create reflect vector
      var i = ray.dir.clone(); //incident ray
      i.normalize(1); //make it a unit vector
      var n = ray.obj.normal(ray.pos); //normal from object collided (unit vec)
      var angle = n.dot(i); //calculate cosine of angle between them
      n.normalize(2 * angle); //scale the normal vector to subtract away the correct amount
      i.subtract(n); //reverse the direction of the incident but only the part that matches up with the normal
      
      //cast reflection ray
      i.add(ray.obj.surface(ray.pos)); //calculate point in 3D space from the our reflected incident vector and the surface of the object
      var len = maxRayLength;
      if (i.y > ray.y) { //determine if it will hit ground
        len = maxRayLength * 3;
      }
      var reflectRay = new Ray(ray.obj.surface(ray.pos), i, len);

      //weight transparency of reflection
      var weight = Math.floor(255 * Math.pow(reflectivity, maxReflections - depth + 1) * Math.pow(2, depth - 1) / Math.pow(2, maxReflections)).toString(16);
      if (weight.length === 1) {
        weight = "0" + weight;
      }
      
      //if reflection does not hit sky
      if (reflectRay.obj !== null) {
        //draw base color of reflected object
        context.fillStyle = reflectRay.obj.color + weight;
        context.fillRect(x, y, 1, 1);
        
        //draw shadows and highlights on reflected object
        var refShadow = this.getLightAmount(reflectRay);
        this.drawLight(x, y, refShadow, parseInt(weight, 16) / 255);
        
        //if it hits another reflected object then the cycle continues
        if (reflectRay.obj.ref) {
          this.reflect(x, y, reflectRay, depth - 1);
        }
      } else {
        //draw sky color (weighted)
        context.fillStyle = backgroundColor + weight;
        context.fillRect(x, y, 1, 1);
      }
    }
  }
}