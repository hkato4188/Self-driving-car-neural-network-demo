const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 50;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.4);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 20, 50, "DUMMY", 2, "red"),
  new Car(road.getLaneCenter(0), -300, 20, 50, "DUMMY", 2, "#5D12D2"),
  new Car(road.getLaneCenter(2), -300, 20, 50, "DUMMY", 2, "#f4ce14"),
  new Car(road.getLaneCenter(0), -500, 20, 50, "DUMMY", 2, "green"),
  new Car(road.getLaneCenter(1), -700, 20, 50, "DUMMY", 2, "#5D12D2"),
  new Car(road.getLaneCenter(0), -800, 20, 50, "DUMMY", 2, "green"),
  new Car(road.getLaneCenter(1), -900, 20, 50, "DUMMY", 2, "#FF6C22"),
  new Car(road.getLaneCenter(0), -1100, 20, 50, "DUMMY", 2, "white"),
  new Car(road.getLaneCenter(2), -1300, 20, 50, "DUMMY", 2, "green"),
  new Car(road.getLaneCenter(1), -1500, 20, 50, "DUMMY", 2, "#5D12D2"),
  new Car(road.getLaneCenter(0), -1800, 20, 50, "DUMMY", 2, "green"),
  new Car(road.getLaneCenter(1), -1900, 20, 50, "DUMMY", 2, "#FF6C22"),
  new Car(road.getLaneCenter(1), -2000, 20, 50, "DUMMY", 2, "red"),
  new Car(road.getLaneCenter(0), -2200, 20, 50, "DUMMY", 2, "#5D12D2"),
  new Car(road.getLaneCenter(2), -2500, 20, 50, "DUMMY", 2, "#f4ce14"),
  new Car(road.getLaneCenter(0), -2700, 20, 50, "DUMMY", 2, "white"),
  new Car(road.getLaneCenter(1), -2800, 20, 50, "DUMMY", 2, "#FF6C22"),
  new Car(road.getLaneCenter(1), -3000, 20, 50, "DUMMY", 2, "red"),
  new Car(road.getLaneCenter(2), -3500, 20, 50, "DUMMY", 2, "#f4ce14"),
  new Car(road.getLaneCenter(1), -4000, 20, 50, "DUMMY", 2, "#5D12D2"),
  new Car(road.getLaneCenter(2), -4100, 20, 50, "DUMMY", 2, "green"),
  new Car(road.getLaneCenter(1), -4500, 20, 50, "DUMMY", 2, "#FF6C22"),
  new Car(road.getLaneCenter(1), -5000, 20, 50, "DUMMY", 2, "red"),
  new Car(road.getLaneCenter(2), -5200, 20, 50, "DUMMY", 2, "#f4ce14"),
  new Car(road.getLaneCenter(1), -5800, 20, 50, "DUMMY", 2, "gray"),
  new Car(road.getLaneCenter(2), -6000, 20, 50, "DUMMY", 2, "#FF6C22"),
  new Car(road.getLaneCenter(0), -6000, 20, 50, "DUMMY", 2, "blue"),
  new Car(road.getLaneCenter(1), -6800, 20, 50, "DUMMY", 2, "white"),
  new Car(road.getLaneCenter(2), -7000, 20, 50, "DUMMY", 2, "red"),
  new Car(road.getLaneCenter(0), -7100, 20, 50, "DUMMY", 2, "pink"),
  new Car(road.getLaneCenter(1), -7500, 20, 50, "DUMMY", 2, "green"),
  new Car(road.getLaneCenter(2), -7900, 20, 50, "DUMMY", 2, "brown"),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.75);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);
  carCtx.restore();

  networkCtx.lineDashOffset = -time / 60;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate);
}
