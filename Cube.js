class Cube {
  constructor(x, y, z, radius, color, light, ref) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = radius;
    this.color = color;
    this.light = light; //is it a light
    if (light) {
      lights.push(this); //add to light array
    }
    this.ref = ref; //is it reflective
  }
  
  //return distance to surface
  distance(v) {
    var x = Math.max(v.x - this.x - this.r, this.x - v.x - this.r);
    var y = Math.max(v.y - this.y - this.r, this.y - v.y - this.r);
    var z = Math.max(v.z - this.z - this.r, this.z - v.z - this.r);
    
    return Math.max(x, y, z);
  }
  
  //return point on surface normal to given point
  surface(v) {
    var n = this.normal(v);
    var s = v.clone();
    if (n.x !== 0) {
      s.x = this.x + ((this.r + precision) * Math.sign(n.x));
    }
    if (n.y !== 0) {
      s.y = this.y + ((this.r + precision) * Math.sign(n.y));
    }
    if (n.z !== 0) {
      s.z = this.z + ((this.r + precision) * Math.sign(n.z));
    }
    return s;
  }
  
  //return normal vector from a given point
  normal(v) {
    var n = new Vec(0, 0, 0);
    if (v.x > this.x + this.r || v.x < this.x - this.r) {
      n.x = Math.sign(v.x - this.x);
    }
    if (v.y > this.y + this.r || v.y < this.y - this.r) {
      n.y = Math.sign(v.y - this.y);
    } 
    if (v.z > this.z + this.r || v.z < this.z - this.r) {
      n.z = Math.sign(v.z - this.z);
    }
    n.normalize(1);
    return n;
  }
  
  //act like a sphere for light giving off purposes to avoid casting rectangular beams of light
  normalLight(v) {
    var n = new Vec(v.x - this.x, v.y - this.y, v.z - this.z);
    n.normalize(1);
    return n;
  }
}