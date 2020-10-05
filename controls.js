var selObj; //selected obj
var pCanvas, pContext;

function setupControls() {
  setup();
  selObj = unsorted[0];
  new KellyColorPicker({place: "color-canvas", input: "color", size: 140});
  pCanvas = document.getElementById("preview-canvas");
  pContext = pCanvas.getContext("2d");
  updateObjButtons(0);
  updateGenButtons();
  drawPreview();
  
  setTimeout(callRender, 10);
}

$(document).ready(function () {
  $("#render-button").click(function() {
    setTimeout(showLoad, 10);
  });
  
  /************************************************
                   OBJECT CONTROLS
  ************************************************/
  
  $(".obj-button").click(function() {
    var id = parseInt($(this).attr('id').substring(1));
    if (id < 7) {
      selObj = unsorted[id];
    } else if (id === 7) {
      selObj = null;
    }
    updateObjButtons(id)
  });
  
  $("#color-canvas").mousemove(function() {
    if (selObj !== null) {
      selObj.color = $("#color").val();
    } else {
      backgroundColor = $("#color").val();
    }
    colorButtons();
    drawPreview();
  });
  
  $("#ref-button").click(function() {
    if (selObj !== null) {
      $("#color-blocker").css("display", "none");
      if (!selObj.ref) {
        $("#ref-button").css("background-color", "#506E45");
        $("#ref-button").css("border", "4px solid #c9c9c9");
        $("#light-button").css("background-color", "#c9c9c9");
        selObj.ref = true;
        selObj.light = false;
        colorButtons();
        if (lights.indexOf(selObj) > -1) {
          lights.splice(lights.indexOf(selObj), 1);
        }
      } else {
        selObj.ref = false;
        $("#ref-button").css("background-color", "#c9c9c9");
      }
    }
  });
  
  $("#light-button").click(function() {
    if (selObj !== null && selObj !== ground) {
      if (!selObj.light) {
        $("#light-button").css("background-color", "#506E45");
        $("#light-button").css("border", "4px solid #c9c9c9");
        $("#ref-button").css("background-color", "#c9c9c9");
        $("#color-blocker").css("display", "block");
        selObj.light = true;
        selObj.ref = false;
        selObj.color = lightColor;
        $("#color").val(selObj.color);
        $("#color").trigger("click");
        colorButtons();
        lights.push(selObj);
      } else {
        selObj.light = false;
        if (lights.indexOf(selObj) > -1) {
          lights.splice(lights.indexOf(selObj), 1);
        }
        $("#light-button").css("background-color", "#c9c9c9");
        $("#color-blocker").css("display", "none");
      }
    }
    drawPreview();
  });
  
  $("#x-slider").mousemove(function() {
    selObj.x = parseInt($("#x-slider").val());
    drawPreview();
  });
  
  $("#y-slider").mousemove(function() {
    selObj.y = parseInt($("#y-slider").val());
    drawPreview();
  });
  
  $("#z-slider").mousemove(function() {
    selObj.z = parseInt($("#z-slider").val());
    drawPreview();
  });
  
  $("#rad-slider").mousemove(function() {
    selObj.r = parseInt($("#rad-slider").val());
    drawPreview();
  });
  
  /************************************************
                   GENERAL CONTROLS
  ************************************************/
  
  $("#focal-slider").mousemove(function() {
    focalLength = parseInt($(this).val());
    fov = Math.round(360 * Math.atan2(300, focalLength) / Math.PI);
    $("#fov-slider").val(fov);
    $("#fov-label").text("FOV: " + fov + "°");
    c.z = -focalLength;
    drawPreview();
  });
  
  $("#fov-slider").mousemove(function() {
    fov = parseInt($(this).val());
    focalLength = Math.round(300 / Math.tan(fov * Math.PI / 360));
    $("#focal-slider").val(focalLength);
    $("#fov-label").text("FOV: " + fov + "°");
    c.z = -focalLength;
    drawPreview();
  });
  
  $("#light-slider").change(function() {
    lightIntensity = parseInt($("#light-slider").val()); 
  });
  
  $("#highlight-slider").change(function() {
    maxHighlight = parseInt($("#highlight-slider").val() / 100); 
  });
  
  $("#shadow-slider").change(function() {
    maxShadow = parseInt($("#shadow-slider").val() / 100); 
  });
  
  $("#floor-slider").change(function() {
    shadowFloor = parseInt($("#floor-slider").val() / 100); 
  });
  
  $("#ref-slider").change(function() {
    reflectivity = parseInt($("#ref-slider").val() / 100); 
  });
  
  $("#bounce-slider").change(function() {
    maxReflections = parseInt($("#bounce-slider").val()); 
    $("#bounce-label").text("Max light bounces: " + maxReflections);
  });
  
  $("#gamma-slider").change(function() {
    gamma = parseInt($("#gamma-slider").val() / 100); 
  });
  
  $("#preset1-button").click(function() {
    preset1();
    setTimeout(updatePreset, 10);
  });
  
  $("#preset2-button").click(function() {
    preset2();
    setTimeout(updatePreset, 10);
  });
});

function updatePreset() {
  selObj = unsorted[0];
  updateObjButtons(0);
  updateGenButtons();
  drawPreview();
}

function updateObjButtons(id) {
  showAllButtons();
  
  $("#y-slider").attr("min", -500);
  $("#y-slider").attr("max", 1100);
  
  if (selObj !== null) { //real objects
    $("#color").val(selObj.color);
    
    if (selObj.light) {
      $("#light-button").css("background-color", "#506E45");
      $("#light-button").css("border", "4px solid #c9c9c9");
      $("#color-blocker").css("display", "block");
    } else {
      $("#light-button").css("background-color", "#c9c9c9");
    }
    
    if (selObj.ref) {
      $("#ref-button").css("background-color", "#506E45");
      $("#ref-button").css("border", "4px solid #c9c9c9");
    } else {
      $("#ref-button").css("background-color", "#c9c9c9");
    }
    
    if (id === 6) { //ground plane
      $("#x-slider").prop("disabled", true);
      $("#z-slider").prop("disabled", true);
      $("#rad-slider").prop("disabled", true);
      $("#light-button").prop("disabled", true);
      $("#x-slider").val(300);
      $("#z-slider").val(900);
      $("#y-slider").attr("min", 310);
      $("#y-slider").attr("max", 1500);
      $("#rad-slider").val(10);
    } else {
      $("#x-slider").val(selObj.x);
      $("#z-slider").val(selObj.z);
      $("#rad-slider").val(selObj.r);
    }
      
    $("#y-slider").val(selObj.y);
    
  } else { //skybox
    $("#color").val(backgroundColor);
    $("#x-slider").prop("disabled", true);
    $("#y-slider").prop("disabled", true);
    $("#z-slider").prop("disabled", true);
    $("#rad-slider").prop("disabled", true);
    $(".checkbox").prop("disabled", true);
    $("#ref-button").css("background-color", "#c9c9c9");
    $("#light-button").css("background-color", "#c9c9c9");
    $("#x-slider").val(300);
    $("#y-slider").val(300);
    $("#z-slider").val(900);
    $("#rad-slider").val(10);
  }
  $("#color").trigger("click");
  
  colorButtons();
  shapeButtons(id);
}

function showAllButtons() {
  $("#x-slider").prop("disabled", false);
  $("#y-slider").prop("disabled", false);
  $("#z-slider").prop("disabled", false);
  $("#rad-slider").prop("disabled", false);
  $(".checkbox").prop("disabled", false);
  $("#color-canvas").prop("disabled", false);
  $("#color-blocker").css("display", "none");
}

function updateGenButtons() {
  $("#focal-slider").val(focalLength);
  $("#fov-slider").val(fov);
  $("#fov-label").text("FOV: " + fov + "°");
  $("#light-slider").val(lightIntensity);
  $("#highlight-slider").val(Math.floor(maxHighlight * 100));
  $("#shadow-slider").val(Math.floor(maxShadow * 100));
  $("#floor-slider").val(Math.floor(shadowFloor * 100));
  $("#ref-slider").val(Math.floor(reflectivity * 100));
  $("#bounce-slider").val(maxReflections);
  $("#bounce-label").text("Max light bounces: " + maxReflections);
  $("#gamma-slider").val(Math.floor(gamma * 100));
}

function colorButtons() {
  for (var i = 0; i < 7; i++) {
    $("#b" + i).css("color", unsorted[i].color);
  }
  $("#b7").css("color", backgroundColor);
}

function shapeButtons(id) {
  for (var i = 0; i < 9; i++) {
    $("#b" + i).css("width", "100%");
    $("#b" + i).css("padding-right", "0");
  }
  $("#b" + id).css("width", "118%");
  $("#b" + id).css("padding-right", "18%");
}

function showLoad() {
  $("#loading").show();
  setTimeout(callRender, 10);
}

function callRender() {
  c.render();
  $("#loading").hide();
}

function drawPreview() {
  var scale = pCanvas.width / 1600;
  
  pContext.fillStyle = ground.color;
  pContext.fillRect(0, 0, pCanvas.width, pCanvas.height);
  var tinyObj = objects.slice();
  tinyObj.sort(function(a, b) {return (b.y - b.r) - (a.y - a.r)});
  for (var i = 0; i < tinyObj.length; i++) {
    var to = tinyObj[i];
    
    if (to.y - to.r < ground.y) {
      var scaledX = pCanvas.width - ((parseInt(to.z) - 100) * scale);
      var scaledY = pCanvas.height - ((parseInt(to.x) + 500) * scale);
      
      if (to !== ground) {
        pContext.fillStyle = to.color;
        if (to instanceof Cube) {
          pContext.fillRect(scaledX - (to.r * scale), scaledY - (to.r * scale), 2 * to.r * scale, 2 * to.r * scale);
        } else {
          pContext.beginPath();
          pContext.arc(scaledX, scaledY, to.r * scale, 0, 2 * Math.PI);
          pContext.fill();
        }
      }
    }
  }
  
  $("#camera-image").css("left", Math.floor(126 + (focalLength * scale)) + "px");
}