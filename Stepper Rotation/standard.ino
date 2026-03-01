#include <WiFi.h>
#include <WebServer.h>
#include <Stepper.h>

// --- Configuration ---
const int stepsPerRevolution = 2048; 
const int stepsForTenDegrees = 57; 
int currentAngle = 0; 

const char* ssid = "Uttiyo's stepper";
const char* password = "123456789";

// Initialize stepper on pins 27, 26, 25, 33
Stepper myStepper(stepsPerRevolution, 27, 26, 25, 33);
WebServer server(80);

// --- 1. The Website UI (HTML/JS) ---
void handleRoot() {
  String html = "<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'>";
  html += "<style>body{font-family:'Courier New', monospace; background:#0a0a0a; color:#00ff00; padding:20px; text-align:center;}";
  html += ".container{max-width:600px; margin:auto; border:1px solid #00ff00; padding:20px; border-radius:10px; background:#111;}";
  html += "#terminal{height:300px; overflow-y:auto; background:#000; border:1px solid #333; padding:15px; text-align:left; margin-top:20px; font-size:14px; line-height:1.5;}";
  html += "input{background:#000; color:#00ff00; border:1px solid #00ff00; padding:10px; width:70px; font-size:16px;}";
  html += "button{background:#00ff00; color:#000; border:none; padding:12px 20px; cursor:pointer; font-weight:bold; margin:10px 5px; border-radius:3px;}";
  html += ".btn-reset{background:#ff4444; color:white;}";
  html += ".cursor{animation: blink 1s infinite;} @keyframes blink{0%{opacity:0} 50%{opacity:1} 100%{opacity:0}}</style>";
  
  // JAVASCRIPT: High-speed polling (every 100ms) to catch every increment
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
  html += "}, 100);"; // 10 times per second
  html += "</script>";
  
  html += "</head><body><div class='container'>";
  html += "<h2>STEPPER MONITOR v2.0</h2>";
  
  html += "<form action='/run' method='GET' target='hidden-frame'>";
  html += "Enter Rotations (1 unit = 10&deg;):<br><br>";
  html += "<input type='number' name='num' value='1' min='1'> ";
  html += "<button type='submit'>START ROTATION</button>";
  html += "</form>";

  html += "<button class='btn-reset' onclick=\"fetch('/reset'); document.getElementById('terminal').innerHTML='> Log Cleared...<br>'\">CLEAR TERMINAL</button>";
  
  html += "<div id='terminal'>> Initialized. Awaiting command...<span class='cursor'>_</span><br></div>";
  
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
  if (server.hasArg("num")) {
    int units = server.arg("num").toInt();
    server.send(200, "text/plain", "OK"); // Tell browser we started

    for (int i = 0; i < units; i++) {
      // 1. Move the motor
      myStepper.step(stepsForTenDegrees);
      
      // 2. Update the variable
      currentAngle += 10;
      Serial.print("Current Stepper Angle: ");
      Serial.println(currentAngle);
      
      // 3. NON-BLOCKING DELAY (0.5 seconds)
      // This allows the ESP32 to handle the web request WHILE waiting
      unsigned long startPause = millis();
      while (millis() - startPause < 500) {
        server.handleClient(); // This makes the website updates work mid-loop!
        yield();               // Prevent WDT (Watchdog Timer) reset
      }
    }
  }
}

// --- 3. Setup & Loop ---
void setup() {
  Serial.begin(115200);
  myStepper.setSpeed(10); // 10 RPM
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi Connected!");
  Serial.print("Local IP: http://");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/getAngle", handleGetAngle);
  server.on("/run", handleRotate);
  server.on("/reset", handleReset);
  server.begin();
}

void loop() {
  server.handleClient(); // Normal listening when idle
}