new p5();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const canvasHeight = urlParams.get('canvasHeight');
const canvasWidth = urlParams.get('canvasWidth');
const population = urlParams.get('population');
const disableSound = urlParams.get('disableSound');
const volume = urlParams.get('volume');

if(canvasWidth > 2000) throw new Error('Canvas width out of range')
if(canvasHeight > 2000) throw new Error('Canvas height out of range')


const canvasConfig = {
  size: {
    X: canvasWidth || 750,
    Y: canvasHeight || 750.
  }
}

const images = {}
const sounds = {}

const things = [...new Array(parseInt(population) || 80)].map(_ => new Thing(canvasConfig));

function preload() {
  images.scissor = loadImage('./assets/scissor.png');
  images.rock = loadImage('./assets/stone.png');
  images.paper = loadImage('./assets/paper.png');

  sounds.scissor = loadSound('./assets/sounds/scissor_sound.mp3');
  sounds.rock = loadSound('./assets/sounds/stone_sound.mp3');
  sounds.paper = loadSound('./assets/sounds/paper_sound.mp3');

  const currentVolume = disableSound == 'on' ? 0 : parseFloat(volume);

  console.log(volume);

  sounds.scissor.setVolume(currentVolume ?? 0.3)
  sounds.rock.setVolume(currentVolume ?? 0.3)
  sounds.paper.setVolume(currentVolume ?? 0.3)
}

function setup() {
  createCanvas(canvasConfig.size.X, canvasConfig.size.Y);
  // frameRate(4)
}

function draw() {
  background(0)

  for(let i = 0; i < things.length; i++) {
    for(let j = 0; j < things.length; j++) {
      things[i].intersects(things[j], sounds)
    }
    things[i].findTarget(things);
  }

  things.map(thing => {
    thing.draw(images)
    thing.move()
  })
}
