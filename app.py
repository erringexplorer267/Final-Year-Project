from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
import reader

app = Flask(__name__)
# Task 1: Zero-Failure Bridge - Allow Vite Dev Server (localhost:5173)
CORS(app, resources={r"/*": {"origins": "*"}})

camera = cv2.VideoCapture(0)

# Global State for ECE Analytics
latest_state = {
    "current_v": 0.0,
    "theta": 0,
    "gain_db": -40.0,
    "status": "ready"
}

def gen_frames():
    global latest_state
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            processed_frame, text = reader.process_frame(frame)
            if text:
                try:
                    val = float(text)
                    latest_state["current_v"] = val
                    # Calculation for Gain dB: Shifted to Center/Ref
                    latest_state["gain_db"] = round((val * 0.4) - 40, 2)
                    
                    # Task 1 Requirement: Update Theta (Simulated rotation if hardware not connected)
                    latest_state["theta"] = (latest_state["theta"] + 5) % 360
                except:
                    pass
            
            ret, buffer = cv2.imencode('.jpg', processed_frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/get_data', methods=['GET'])
def get_data():
    """
    Exposes latest ECE analytics JSON to the React dashboard.
    """
    return jsonify({
        "current_v": latest_state["current_v"],
        "theta": latest_state["theta"],
        "gain_db": latest_state["gain_db"],
        "timestamp": cv2.getTickCount()
    })

if __name__ == "__main__":
    # Ensure port 5000 is used for the Vite Proxy to see it
    app.run(debug=True, port=5000, host='127.0.0.1')