from flask import Flask, render_template, Response, jsonify
import cv2
import reader

app = Flask(__name__)
camera = cv2.VideoCapture(0)

# Global variable to store the latest reading
latest_value = "0"

def gen_frames():
    global latest_value
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            processed_frame, text = reader.process_frame(frame)
            # Update our global variable if a number was found
            if text:
                latest_value = text
            
            ret, buffer = cv2.imencode('.jpg', processed_frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# NEW: Route to send the data to the website as JSON
@app.route('/get_data')
def get_data():
    try:
        val = float(latest_value)
        # YOUR FORMULA: Change this to your actual CNC gain formula
        # Example: Gain = (Value * 1.5) / 100
        gain = (val * 1.5) / 100 
    except:
        val = 0
        gain = 0
    
    return jsonify(reading=val, gain=round(gain, 4))

if __name__ == "__main__":
    app.run(debug=True)