
// calculator program

const display = document.getElementById("display");

function appendToDisplay(input) {
  display.value += input;
}
function clearDisplay() {
    display.value = "";
}

function calculate() {
    try {
        display.value = eval(display.value);
    } 
    catch (error) {
        display.value  = "Error";
    }
}

// Mode switching logic
function switchMode() {
    const mode = document.getElementById('mode-select').value;
    document.getElementById('calculator').style.display = (mode === 'basic') ? '' : 'none';
    document.getElementById('scientific-calc').style.display = (mode === 'scientific') ? '' : 'none';
    document.getElementById('graphing-calc').style.display = (mode === 'graphing') ? '' : 'none';
    document.getElementById('programmer-calc').style.display = (mode === 'programmer') ? '' : 'none';
    document.getElementById('datetime-calc').style.display = (mode === 'datetime') ? '' : 'none';
    if (mode === 'scientific') loadScientific();
    if (mode === 'graphing') loadGraphing();
    if (mode === 'programmer') loadProgrammer();
    if (mode === 'datetime') loadDateTime();
}


function loadScientific() {
    document.getElementById('scientific-calc').innerHTML = `
        <input id="sci-display" readonly style="width: 90%; margin-bottom: 8px;">
        <div>
            <button onclick="sciInput('sin(')">sin</button>
            <button onclick="sciInput('cos(')">cos</button>
            <button onclick="sciInput('tan(')">tan</button>
            <button onclick="sciInput('log(')">log</button>
            <button onclick="sciInput('exp(')">exp</button>
            <button onclick="sciInput('^')">^</button>
            <button onclick="sciInput('(')">(</button>
            <button onclick="sciInput(')')">)</button>
            <button onclick="sciInput('pi')">π</button>
            <button onclick="sciInput('e')">e</button>
        </div>
        <div>
            <button onclick="sciInput('7')">7</button>
            <button onclick="sciInput('8')">8</button>
            <button onclick="sciInput('9')">9</button>
            <button onclick="sciInput('/')">/</button>
        </div>
        <div>
            <button onclick="sciInput('4')">4</button>
            <button onclick="sciInput('5')">5</button>
            <button onclick="sciInput('6')">6</button>
            <button onclick="sciInput('*')">*</button>
        </div>
        <div>
            <button onclick="sciInput('1')">1</button>
            <button onclick="sciInput('2')">2</button>
            <button onclick="sciInput('3')">3</button>
            <button onclick="sciInput('-')">-</button>
        </div>
        <div>
            <button onclick="sciInput('0')">0</button>
            <button onclick="sciInput('.')">.</button>
            <button onclick="sciCalculate()">=</button>
            <button onclick="sciClear()">C</button>
        </div>
    `;
    window.sciInput = function(val) {
        const d = document.getElementById('sci-display');
        d.value += val;
    };
    window.sciClear = function() {
        document.getElementById('sci-display').value = '';
    };
    window.sciCalculate = function() {
        let expr = document.getElementById('sci-display').value;
        try {
            expr = expr.replace(/pi/g, Math.PI).replace(/e/g, Math.E)
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/exp\(/g, 'Math.exp(')
                .replace(/\^/g, '**');
            document.getElementById('sci-display').value = eval(expr);
        } catch (e) {
            document.getElementById('sci-display').value = 'Error';
        }
    };
}

function loadGraphing() {
    document.getElementById('graphing-calc').innerHTML = `
        <div>
            <input id="graph-eq" placeholder="y = f(x), e.g. sin(x)" style="width: 70%;">
            <button onclick="drawGraph()">Plot</button>
        </div>
        <canvas id="graph-canvas" width="350" height="200" style="border:1px solid #ccc;margin-top:10px;"></canvas>
    `;
    window.drawGraph = function() {
        const eq = document.getElementById('graph-eq').value;
        const canvas = document.getElementById('graph-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.beginPath();
        ctx.moveTo(0,canvas.height/2);
        for(let px=0; px<canvas.width; px++) {
            let x = (px - canvas.width/2)/30;
            let y = 0;
            try {
                y = eval(eq.replace(/x/g, '('+x+')').replace(/sin/g,'Math.sin').replace(/cos/g,'Math.cos').replace(/tan/g,'Math.tan').replace(/log/g,'Math.log10').replace(/exp/g,'Math.exp').replace(/pi/g, Math.PI).replace(/e/g, Math.E));
            } catch(e) { y = 0; }
            let py = canvas.height/2 - y*30;
            if(px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = '#0074d9';
        ctx.lineWidth = 2;
        ctx.stroke();
    };
}

function loadProgrammer() {
    document.getElementById('programmer-calc').innerHTML = `
        <input id="prog-in" placeholder="Enter decimal" style="width: 60%;">
        <button onclick="convertProg()">Convert</button>
        <div id="prog-results" style="margin-top:10px;"></div>
    `;
    window.convertProg = function() {
        const val = parseInt(document.getElementById('prog-in').value, 10);
        if(isNaN(val)) {
            document.getElementById('prog-results').innerHTML = 'Invalid input';
            return;
        }
        document.getElementById('prog-results').innerHTML =
            `<b>Binary:</b> ${val.toString(2)}<br><b>Hex:</b> ${val.toString(16).toUpperCase()}<br><b>Octal:</b> ${val.toString(8)}`;
    };
}

function loadDateTime() {
    document.getElementById('datetime-calc').innerHTML = `
        <div>
            <label>Start Date: <input type="date" id="dt1"></label>
            <label>End Date: <input type="date" id="dt2"></label>
            <button onclick="dateDiff()">Difference</button>
        </div>
        <div id="dt-result" style="margin-top:10px;"></div>
    `;
    window.dateDiff = function() {
        const d1 = new Date(document.getElementById('dt1').value);
        const d2 = new Date(document.getElementById('dt2').value);
        if(isNaN(d1) || isNaN(d2)) {
            document.getElementById('dt-result').innerText = 'Invalid date(s)';
            return;
        }
        const diff = Math.abs((d2-d1)/(1000*60*60*24));
        document.getElementById('dt-result').innerText = `Difference: ${diff} day(s)`;
    };
}

// Initialize mode on page load
window.onload = function() {
    switchMode();
};
