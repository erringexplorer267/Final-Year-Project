import cv2
import pytesseract
import re
#SHOB COMMENT KORE DIECHI FUNCTIONS
pytesseract.pytesseract.tesseract_cmd = r'/opt/homebrew/bin/tesseract'

def process_frame(frame):
    # 1. Get dimensions
    h, w, _ = frame.shape
    
    # 2. Define a "Scanner Box" (ROI)
    # Positioning the box in the center
    x1, y1, x2, y2 = int(w*0.3), int(h*0.4), int(w*0.7), int(h*0.6)
    roi = frame[y1:y2, x1:x2]
    
    # 3. Enhanced Pre-processing for better accuracy
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    
    # NEW: Smooth out "noise" (those little black dots in the image)
    blurred = cv2.medianBlur(gray, 3)
    
    # NEW: Otsu's Thresholding (Automatically finds the best contrast)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # 4. OCR configuration
    config = '--psm 7 -c tessedit_char_whitelist=0123456789.'
    raw_text = pytesseract.image_to_string(thresh, config=config).strip()
    
    # NEW: Clean the text to ensure it's a valid number for your math formula
    # This removes anything that isn't a digit or a decimal point
    clean_text = re.sub(r'[^0-9.]', '', raw_text)
    
    # 5. Visual Feedback on the Video Feed
    # Draw the green scanner box
    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
    
    # Display the result on the screen
    display_text = f"Reading: {clean_text}" if clean_text else "Scanning..."
    cv2.putText(frame, display_text, (x1, y1-10), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    
    return frame, clean_text