class Plane {
  constructor(y, color, ref) {
    this.y = y;
    this.color = color;
    this.ref = ref; //is it reflective
  }
  
  //return distance to plane from a given point
  distance(v) {
    return this.y - v.y;
  }
  
  //return point on surface of plane closest to given point
  surface(v) {
    return new Vec(v.x, this.y - precision, v.z);
  }
  
  //return normal vec from plane to given point
  normal(v) {
    return new Vec(0, -1, 0);
  }
}