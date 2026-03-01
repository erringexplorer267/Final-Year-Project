#include <WiFi.h>
#include <WebServer.h>
#include <Stepper.h>

// --- Configuration ---
const int stepsPerRevolution = 2048; 
int currentAngle = 0; 

const char* ssid = "Uttiyo's stepper";
const char* password = "123456789";

Stepper myStepper(stepsPerRevolution, 27, 26, 25, 33);
WebServer server(80);

// --- 1. The Website UI (With Dual Inputs) ---
void handleRoot() {
  String html = "<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'>";
  html += "<style>body{font-family:'Courier New', monospace; background:#0a0a0a; color:#00ff00; padding:20px; text-align:center;}";
  html += ".container{max-width:600px; margin:auto; border:1px solid #00ff00; padding:20px; border-radius:10px; background:#111;}";
  html += "#terminal{height:300px; overflow-y:auto; background:#000; border:1px solid #333; padding:15px; text-align:left; margin-top:20px; font-size:14px;}";
  html += "input{background:#000; color:#00ff00; border:1px solid #00ff00; padding:8px; width:80px; margin:5px;}";
  html += "button{background:#00ff00; color:#000; border:none; padding:12px 20px; cursor:pointer; font-weight:bold; margin:10px 5px;}";
  html += ".btn-reset{background:#ff4444; color:white;}</style>";
  
  html += "<script>";
  html += "let lastAngle = -1;";
  html += "setInterval(function() {";
  html += "  fetch('/getAngle').then(r => r.text()).then(angle => {";
  html += "    if(angle != lastAngle) {";
  html += "      let term = document.getElementById('terminal');";
  html += "      let timestamp = new Date().toLocaleTimeString();";
  html += "      term.innerHTML += '[' + timestamp + '] > Current Stepper Angle: ' + angle + '&deg;<br>';";
  html += "      term.scrollTop = term.scrollHeight;"; 
  html += "      lastAngle = angle;";
  html += "    }";
  html += "  });";
  html += "}, 100);"; 
  html += "</script>";
  
  html += "</head><body><div class='container'>";
  html += "<h2>STEPPER COMMAND CENTER</h2>";
  
  html += "<form action='/run' method='GET' target='hidden-frame'>";
  html += "Degrees per step: <input type='number' name='deg' value='10' min='1'><br>";
  html += "Number of steps: <input type='number' name='num' value='1' min='1'><br>";
  html += "<button type='submit'>START ROTATION</button>";
  html += "</form>";

  html += "<button class='btn-reset' onclick=\"fetch('/reset'); document.getElementById('terminal').innerHTML='> Log Cleared...<br>'\">CLEAR LOG</button>";
  html += "<div id='terminal'>> Awaiting command...<br></div>";
  html += "<iframe name='hidden-frame' style='display:none;'></iframe>";
  html += "</div></body></html>";
  
  server.send(200, "text/html", html);
}

// --- 2. Logic Handlers ---

void handleGetAngle() {
  server.send(200, "text/plain", String(currentAngle));
}

void handleReset() {
  currentAngle = 0;
  server.send(200, "text/plain", "Reset Successful");
}

void handleRotate() {
  if (server.hasArg("num") && server.hasArg("deg")) {
    int iterations = server.arg("num").toInt();
    int degPerStep = server.arg("deg").toInt();
    
    // Calculate steps required for the user's custom degree
    // Formula: (degree / 360) * total_steps_per_rev
    int stepsToMove = (degPerStep * stepsPerRevolution) / 360;

    server.send(200, "text/plain", "OK"); 

    for (int i = 0; i < iterations; i++) {
      myStepper.step(stepsToMove);
      currentAngle += degPerStep; // Update by the user's custom degree
      
      Serial.print("Current Stepper Angle: ");
      Serial.println(currentAngle);
      
      unsigned long startPause = millis();
      while (millis() - startPause < 500) {
        server.handleClient(); 
        yield();               
      }
    }
  }
}

// --- 3. Setup & Loop ---
void setup() {
  Serial.begin(115200);
  myStepper.setSpeed(10); 
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  
  Serial.println("\nWiFi Connected!");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/getAngle", handleGetAngle);
  server.on("/run", handleRotate);
  server.on("/reset", handleReset);
  server.begin();
}

void loop() {
  server.handleClient();
}