const p5Container = document.querySelector("#p5-container");
let w = p5Container.clientWidth;
let h = p5Container.clientHeight - 70;

let trees = [];
let wind;
let windStrengthSlider, windDirectionSelect;

function setup() {
  let cnv = createCanvas(w, h);
  cnv.parent(p5Container);
  cnv.style("position", "absolute");
  cnv.style("inset", 0);
  cnv.style("z-index", 100);
  
  let cols = 25;
  let rows = 25;
  
  let spacingX = width / cols;
  let spacingY = height / rows;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows -1; j++) {
      let x = i * spacingX + spacingX / 2;
      let y = j * spacingY + spacingY / 2;
      if (random() < 0.9) {
        trees.push(new Tree(x, y, spacingX / 2));
      }
      
    }
  }
  
  wind = new Wind(createVector(0, 0), 0.0);

  windStrengthSlider = createSlider(0, 1, 0, 0.1);
  windStrengthSlider.position(20, height + 10);
  windStrengthSlider.parent(p5Container);

  windDirectionSelect = createSelect();
  windDirectionSelect.position(20, height + 40);
  windDirectionSelect.parent(p5Container);
  windDirectionSelect.option('No wind');
  windDirectionSelect.option('North');
  windDirectionSelect.option('South');
  windDirectionSelect.option('West');
  windDirectionSelect.option('East');
  windDirectionSelect.style('font-size', '15px');
  windDirectionSelect.changed(updateWindDirection);
}

function draw() {
  background(220);

  for (let tree of trees) {
    tree.update();
    tree.draw();
  }
  
  wind.strength = windStrengthSlider.value();
  
  textSize(16);
  fill(0);
  
  text(`Wind Strength: ${wind.strength.toFixed(1)}`, 20, height - 15);
  text(`Wind Direction: ${windDirectionSelect.value()}`, 200, height - 15);
}

function mousePressed() {
  for (let tree of trees) {
    if (tree.isInDistance(mouseX, mouseY)) {
      tree.ignite();
    }
  }
}

function updateWindDirection() {
  let direction = windDirectionSelect.value();
  
  if (direction == 'No wind') {
    wind.direction = createVector(0, 0);
  } else if (direction == 'North') {
    wind.direction = createVector(0, -1);
  } else if (direction == 'East') {
    wind.direction = createVector(1, 0);
  } else if (direction == 'South') {
    wind.direction = createVector(0, 1);
  } else if (direction == 'West') {
    wind.direction = createVector(-1, 0);
  }
  
}

class Tree {
  constructor(x, y, size) {
    this.position = createVector(x, y);
    this.size = size;
    this.state = "healthy";
    this.burnTime = 150;
  }

  draw() {
    if (this.state == "healthy") {
      // green circle
      fill(10, 180, 10);
      noStroke();
      ellipse(this.position.x, this.position.y, this.size);
    } else if (this.state == "burning") {
      // red circle and orange triangle
      fill(255, 0, 0);
      noStroke();
      ellipse(this.position.x, this.position.y, this.size);
      fill(255, 165, 0);
      triangle(
        this.position.x - this.size / 2, this.position.y,
        this.position.x + this.size / 2, this.position.y,
        this.position.x, this.position.y - this.size
      );
    } else if (this.state == "ash") {
      // gray circle
      noStroke();
      fill(140);
      ellipse(this.position.x, this.position.y, this.size);
    }
  }
  
  isInDistance(x, y) {
    let d = dist(x, y, this.position.x, this.position.y);
    return d < this.size / 2;
  }
  
  ignite() {
    if (this.state == "healthy") {
      this.state = "burning";
    }
  }
  
  update() {
    if(this.state == "burning") {
      this.burnTime--;
      
      if (this.burnTime <= 0) {
        this.state = "ash";
      } else {
        this.spreadFire();
      }
    }
  }
  
  spreadFire() {
    for(let neighbor of trees) {
      if(neighbor.state == "healthy") {
        let distance = dist(this.position.x, this.position.y, neighbor.position.x, neighbor.position.y);
        if(distance <= this.size * 2) {
          let fireDirection = p5.Vector.sub(neighbor.position, this.position).normalize();
          let windEffect = wind.direction.dot(fireDirection) * wind.strength;

          let baseProbability = 0.01;
          
          let probability = baseProbability / 3 + windEffect / 15;

          if (random() < probability) {
            neighbor.ignite();
          }
        }
      }
    }
  }
}

class Wind {
  constructor(direction, strength) {
    this.direction = direction;
    this.strength = strength;
  }
}
