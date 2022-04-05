
const players = [];
let setter = 0;
let highlight = -1;
let simulate = false;
let detail = -1;

function mod(n, m) {
    while (n < 0) {
        n += m;
    }

    return n % m;
}

function setup() {
    // displayWidth - 50
    createCanvas(700, displayHeight - 120);
    rectMode(CENTER);
    textAlign(CENTER);

    players.push(new Player(1, 0, "S", "chartreuse", true));
    players.push(new Player(2, 1, "A1", "cornflowerblue"));
    players.push(new Player(3, 2, "M2", "orangered"));
    players.push(new Player(4, 3, "D", "white"));
    players.push(new Player(5, 1, "A2", "cornflowerblue"));
    players.push(new Player(6, 2, "M1", "orangered"));


    players.forEach((p, idx) => {
        p.left = players[mod(idx - 1, 6)];
        p.right = players[mod(idx + 1, 6)];
        p.diagonal = players[mod(idx + 3, 6)];
        p.setPosition(p.position, setter);
    })

    console.log(players.map(p => p.toString()))
}

function draw() {
    background(0);
    drawMap();


    players.forEach((p, i) => {
        p.setPosition(p.position, setter);
        p.draw({ highlight: i === highlight, showTarget: detail === i || simulate })
    });
    if (simulate) {
        simulate = !players.reduce((all, p) => p.moveToWantedPosition({ check: true }) && all, true);
    }

    textSize(30);
    fill(255)
    text("Läufer " + (mod(setter + 1, 6) + 1), 100, 60);
}

function drawMap() {
    const rH = height / 3;
    const rL = width / 5 * 3;


    rectMode(CORNER);
    noFill();
    strokeWeight(1);
    stroke(100);
    rect(0, 0, rL, rH);
    rect(0, rH, rL, rH);
    rect(0, rH * 2, rL, rH);

    rect(rL, 0, rL, rH);
    rect(rL, rH, rL, rH);
    rect(rL, rH * 2, rL, rH);

    fill(0, 255, 0, 60);
    ellipse(width, rH * 2 + 100, 300, 300);

    fill(180)
    rect(width - 10, 0, width, height); // netz
    rectMode(CENTER);

    push()
    textSize(20)
    translate(20, rH / 2 + 10)
    text("5", 0, 0);
    text("6", 0, rH);
    text("1", 0, rH * 2);

    text("4", rL, 0);
    text("3", rL, rH);
    text("2", rL, rH * 2);
    pop()

    strokeWeight(4);
    stroke(60, 140, 255);
    line(rL, 0, rL, height);

    strokeWeight(20);
    stroke(255, 255, 255, 80);
    noFill();
    arc(width * 0.4, height * 0.5, -width * 0.6, height * 0.8, HALF_PI, HALF_PI * 3);
    strokeWeight(1);
}

function mouseMoved(e) {
    detail = players.findIndex(p => p.clicked([e.x, e.y]));
}

function mouseClicked(e) {
    // fullscreen(true)
}

function keyReleased(e) {
    if (e.key === "ArrowRight") {
        setter = (setter % 6) + 1;
    } else if (e.key === "ArrowLeft") {
        setter = mod(setter - 2, 6) + 1;
    } else if (e.key === " ") {
        simulate = !simulate;
    }
}

function mouseReleased() {
    highlight = -1;
}

function mouseDragged(e) {
    if (highlight === -1) {
        highlight = players.findIndex(p => p.clicked([e.x, e.y]));
        if (highlight < 0) {
            return;
        }
    }
    players[highlight].coords = [e.x, e.y];
}


