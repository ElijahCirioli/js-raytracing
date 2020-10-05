class Vec {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  //add a vector to this one
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  }
  
  //subtract a vector from this one
  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
  }
  
  //set the vector to a specified length
  normalize(len) {
    var length = distance(new Vec(0, 0, 0), this);
    if (length !== 0) {
      this.x *= len / length;
      this.y *= len / length;
      this.z *= len / length;
    }
  }
  
  //return a copy to prevent aliasing
  clone() {
    return new Vec(this.x, this.y, this.z);
  }
  
  //return dot product of this vector and v
  dot(v) {
    return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
  }
  
  //make this vector all positive
  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
  }
}