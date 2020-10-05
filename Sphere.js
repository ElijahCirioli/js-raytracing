class Sphere {
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
  
  //return distance to surface of sphere
  distance(v) {
    return distance(this, v) - this.r;
  }
  
  //return point on surface of sphere closest to given point
  surface(v) {
    var nVec = this.normal(v);
    nVec.normalize(this.r + precision + 0.0001);
    return new Vec(nVec.x + this.x, nVec.y + this.y, nVec.z + this.z);
  }
  
  //return normal vector to sphere from given point
  normal(v) {
    var n = new Vec(v.x - this.x, v.y - this.y, v.z - this.z);
    n.normalize(1);
    return n;
  }
}