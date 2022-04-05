// @ts-check
const margin = 60;
const radius = 50;

class Player {

    constructor(position, type, name, color, isSetter) {
        this.left = this.right = this.diagonal = {};
        this.position = position;
        this.name = name;
        this.color = color;

        this.w = width - margin;
        this.h = height - margin;
        this.h0_5 = height / 2;
        const back = width * 0.3;
        const front = width * 0.08;
        const side = height * 0.1;

        this.positionMap = {
            1: [margin + back, this.h - side],
            "1.5": [width / 2, this.h],
            2: [this.w - front, this.h - side],
            "2.5": [this.w, height * 0.75],
            3: [this.w - front, this.h0_5],
            4: [this.w - front, margin + side],
            5: [margin + back, margin + side],
            6: [margin + back, this.h0_5],
        }
        this.index = -1;
        // this.setPosition(position);
        this.type = type;
        this.isSetter = isSetter;
    }

    draw({ highlight, showTarget }) {
        const [x, y] = this.coords;
        const correct = this.hasCorrectPosition();
        if (highlight || !correct) {
            fill("gray");
            if (!correct) {
                fill("pink");
            }
            ellipse(x, y, radius * 1.4, radius * 1.4);

            stroke(255, 0, 0);
            line(x, margin, x, this.h);
            line(margin, y, this.w, y);

            stroke(255);
        }
        fill(this.color);
        if (showTarget) {
            // squareColor = color(100, 50, 100);
            // squareColor.setAlpha(128 + 128 * sin(millis() / 1000));
            stroke(this.color);
            strokeWeight(3);
            line(x, y, ...this.wantsPosition());
            strokeWeight(1);
        }
       
        if (this.isSetter) {
            rect(x, y, radius);
        } else {
            ellipse(x, y, radius, radius);
        }
        textSize(35);
        fill("black");
        noStroke();
        text(this.name, x, y + 15)
    }

    setPosition(pos, index = 0) {
        if (pos === this.position && index === this.index) {
            return;
        }
        this.position = pos;
        this.index = index;

        const calcPos = ((pos + index) % 6) + 1;
        this.coords = this.positionMap[calcPos].slice();

        this.isInFront = [2, 3, 4].includes(calcPos);
        this.isInCenter = [3, 6].includes(calcPos);
        this.isLeft = calcPos < 3;
        switch (calcPos) {
            case 1: {
                this.opposite = this.right;
                return;
            }
            case 2: {
                this.opposite = this.left;
                return;
            }
            case 4: {
                this.opposite = this.right;
                return;
            }
            case 5: {
                this.opposite = this.left;
                return;
            }
            default: {
                this.opposite = this.diagonal;
            }
        }
    }

    hasCorrectPosition() {
        if (!this.opposite.coords) {
            return;
        }
        let mode = this.isLeft ? "left" : "right";
        if (this.isInCenter) {
            mode = "left right";
        }
        const checks = [];

        if (mode.includes("left") && this.isInFront) {
            checks.push(this.isInBetween(this.coords[1], this.right.coords[1], height + radius))
        }
        if (mode.includes("right") && this.isInFront) {
            checks.push(this.isInBetween(this.coords[1], -radius, this.left.coords[1]))
        }

        if (mode.includes("left") && !this.isInFront) {
            checks.push(this.isInBetween(this.coords[1], this.left.coords[1], height + radius))
        }
        if (mode.includes("right") && !this.isInFront) {
            checks.push(this.isInBetween(this.coords[1], -radius, this.right.coords[1]))
        }

        if (this.isInFront) {
            checks.push(this.isInBetween(this.coords[0], this.opposite.coords[0], width + radius))
        } else {
            checks.push(this.isInBetween(this.coords[0], -radius, this.opposite.coords[0]))
        }

        return checks.every(c => c);
    }

    moveToWantedPosition({ check }) {
        const t = 0.018;
        const last = this.coords.slice();
        const [x, y] = this.coords;
        const [x2, y2] = this.wantsPosition();

        this.coords[0] = this.lerp(x, x2, t);
        if (check && !this.hasCorrectPosition()) {
            this.coords[0] = last[0];
        }

        this.coords[1] = this.lerp(y, y2, t);
        if (check && !this.hasCorrectPosition()) {
            this.coords[1] = last[1];
        }
        const e = 0.1;
        return Math.abs(last[0] - this.coords[0]) < e && Math.abs(last[1] - this.coords[1]) < e;
    }

    lerp(v0, v1, t) {
        return v0 * (1 - t) + v1 * t
    }

    wantsPosition() {
        switch (this.type) {
            case 0: {
                return this.positionMap["2.5"];
            }
            case 1: {
                return this.positionMap[this.isInFront ? 4 : 6];
            }
            case 2: {
                return this.positionMap[this.isInFront ? 3 : 5];
            }
            case 3: {
                return this.positionMap[this.isInFront ? 2 : 1];
            }
        }
    }

    isInBetween(test, lower, higher) {
        return test >= lower + radius && test + radius <= higher;
    }

    clicked([x, y]) {
        const r2 = radius * 2;
        return this.isInBetween(x, this.coords[0] - r2, this.coords[0] + r2) && this.isInBetween(y, this.coords[1] - r2, this.coords[1] + r2);
    }

    toString() {
        return `${this.name}: l> ${this.left.name}, r> ${this.right.name}, d> ${this.diagonal.name}`;
    }


}