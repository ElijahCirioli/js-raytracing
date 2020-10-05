class Ray {
  constructor(vi, vf, len) {
    this.initial = new Vec(vi.x, vi.y, vi.z); //ray's starting point (for calculating distance travelled)
    this.pos = this.initial.clone(); //current ray position
    this.dir = new Vec(vf.x, vf.y, vf.z); //direction ray is heading in
    this.dir.subtract(vi);
    this.obj = null; //what the ray collided with
    this.maxDist = len; //how far the ray is allowed to travel
    
    try {
     this.march(); //cast the ray out
    } catch(error) {
      console.log(error);
    }
  }
  
  //move forward in 3D space
  march() {
    var totalDist = squareDist(this.pos, this.initial); //see how far it's travelled
    
    var pos = this.pos;
    if (totalDist < this.maxDist) { //if ray length is less than max distance
      objects.sort(function(a, b) {return a.distance(pos) - b.distance(pos)}); //sort all objects by distance
      var obj = objects[0]; //set obj to closest object
      var rad = obj.distance(this.pos); //set radius to closest object's distance
      
      if (rad >= precision) { //if ray is far enough away from object
        //move froward by distance equal to that of closest object
        this.dir.normalize(rad);
        this.pos.add(this.dir);
  			this.march();
  		} else {
  			this.obj = obj;
  		}
    } else if (this.dir.y > 0) { //if ray is going to intersect with ground
      this.obj = ground;
    }
  }
}