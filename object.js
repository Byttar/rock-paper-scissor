const types = {
  paper: 0,
  scissor: 1,
  rock: 2,
};

const gutter = 30;

const killerType = {
  [types.paper]: types.rock,
  [types.scissor]: types.paper,
  [types.rock]: types.scissor,
};

const treatType = {
  [types.rock]: types.paper,
  [types.paper]: types.scissor,
  [types.scissor]: types.rock,
};

class Thing {
  type = 0;
  position = createVector(0, 0);
  velocity = createVector(0, 0);
  maxSpeed = 0.5;
  size = 20;
  target = null;
  noMoreTargets = false;
  sightRange = 300;

  constructor(canvasConfig) {
    this.type = Math.floor(Math.random() * 3);
    this.position.x = map(
      Math.random() * 10,
      0,
      10,
      gutter,
      canvasConfig.size.X - gutter
    );
    this.position.y = map(
      Math.random() * 10,
      0,
      10,
      gutter,
      canvasConfig.size.Y - gutter
    );
  }

  draw(images) {
    if (this.type === types.paper)
      image(
        images.paper,
        this.position.x,
        this.position.y,
        this.size,
        this.size
      );
    if (this.type === types.scissor)
      image(
        images.scissor,
        this.position.x,
        this.position.y,
        this.size,
        this.size
      );

    if (this.type === types.rock)
      image(
        images.rock,
        this.position.x,
        this.position.y,
        this.size,
        this.size
      );
  }

  move() {
    if (this.noMoreTargets || this.target == null) {
      const newX = Math.random() * this.maxSpeed - this.maxSpeed / 2;
      const newY = Math.random() * this.maxSpeed - this.maxSpeed / 2;
      this.velocity = createVector(newX, newY);
    }

    if (this.target) {
      this.velocity = p5.Vector.sub(this.target.position, this.position);
    }

    this.velocity.setMag(this.maxSpeed);

    this.position.add(this.velocity);
  }

  findTarget(allTargets) {
    if (this.noMoreTargets) {
      return;
    }

    const possibleTargets = allTargets.filter(
      (target) => killerType[this.type] == target.type
    );
    const possibleTreat = allTargets.filter(
      (target) => treatType[this.type] == target.type
    );

    if (possibleTreat.length == 0) this.sightRange = 1000;

    if (possibleTargets == 0) {
      this.noMoreTargets = true;
      this.target = null;
      return;
    }

    let closestPossibleTargetDistance = null;
    let closestPossibleTarget = null;

    possibleTargets.forEach((target) => {
      const distance = p5.Vector.dist(target.position, this.position);

      if (
        closestPossibleTarget == null ||
        distance < closestPossibleTargetDistance
      ) {
        closestPossibleTarget = target;
        closestPossibleTargetDistance = Math.floor(distance);
      }
    });

    if (
      closestPossibleTargetDistance > this.sightRange ||
      closestPossibleTarget === 0
    ) {
      this.target == null;
      return;
    }

    this.target = closestPossibleTarget;
  }

  colide(colidingThing, sounds) {
    if (colidingThing.type === types.paper && this.type === types.scissor) {
      colidingThing.convert(types.scissor);
      sounds.scissor.play()
    }

    if (colidingThing.type === types.scissor && this.type === types.rock) {
      colidingThing.convert(types.rock);
      sounds.rock.play()
    }

    if (colidingThing.type === types.rock && this.type === types.paper) {
      colidingThing.convert(types.paper);
      sounds.paper.play()
    }

    this.target = null;
    colidingThing.target = null;
  }

  convert(type) {
    this.type = type;
    this.noMoreTargets = false;
  }

  intersects(thing, sounds) {
    if (
      dist(
        this.position.x,
        this.position.y,
        thing.position.x,
        thing.position.y
      ) <
      this.size + 5
    ) {
      this.colide(thing, sounds);
    }
  }
}
