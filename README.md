# Antenna Digital Twin Dashboard

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-black.svg)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0+-646CFF.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC.svg)](https://tailwindcss.com/)

A sophisticated digital twin dashboard for real-time antenna performance monitoring and visualization. This final-year project combines computer vision, OCR technology, and modern web development to create an interactive platform for analyzing antenna polar plots and telemetry data.

## 🌟 Features

- **Real-time Camera Feed**: Live MJPEG streaming from camera input
- **OCR-Powered Data Extraction**: Automatic reading of meter values using Tesseract OCR
- **Interactive Polar Plots**: Dynamic visualization of antenna gain patterns
- **Telemetry Dashboard**: Real-time display of current, gain, and angle measurements
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **RESTful API**: Flask backend providing structured data endpoints

## 🛠️ Tech Stack

### Backend
- **Python 3.8+** - Core language
- **Flask** - Web framework for API and streaming
- **OpenCV** - Computer vision for image processing
- **Pytesseract** - OCR engine for text recognition
- **NumPy** - Numerical computations

### Frontend
- **React 18** - UI framework with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for polar plots

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- Tesseract OCR installed on your system
- Webcam or camera device

### Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd antenna-digital-twin

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install flask opencv-python pytesseract numpy flask-cors

# Configure Tesseract path (macOS example)
# Update reader.py if needed for your system
```

### Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

### Running the Application
```bash
# Terminal 1: Start Flask backend
python app.py

# Terminal 2: Start frontend (in another terminal)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to access the dashboard.

## 📖 Usage

1. **Camera Setup**: Ensure your camera is connected and accessible
2. **Start Services**: Launch both backend and frontend servers
3. **View Feed**: The dashboard displays the live camera feed
4. **Monitor Data**: Real-time telemetry updates automatically
5. **Analyze Plots**: Interactive polar plots show antenna performance

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Camera Feed   │───▶│   Flask Backend │───▶│   React Frontend│
│                 │    │                 │    │                 │
│  MJPEG Stream   │    │  OCR Processing │    │  Polar Plotter  │
│  Telemetry Data │    │  Data Extraction│    │  Dashboard UI   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. Camera captures frames continuously
2. Backend processes frames with OCR to extract readings
3. Telemetry data (current, gain, angle) is computed
4. Frontend polls API for updates and renders visualizations
5. Polar plot accumulates data points for pattern analysis

## 📁 Project Structure

```
antenna-digital-twin/
├── app.py                 # Flask application server
├── reader.py              # OCR and image processing logic
├── package.json           # Node.js dependencies
├── vite.config.ts         # Vite configuration with proxy
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── src/
│   ├── App.tsx            # Main React application
│   ├── main.tsx           # Application entry point
│   ├── components/
│   │   └── PolarPlotter.tsx # Polar plot visualization
│   └── hooks/
│       └── useOrchestrator.ts # Data polling and state management
├── templates/
│   └── index.html         # HTML template
└── Stepper Rotation/      # Arduino stepper motor control
    ├── degreesEditable.ino
    └── standard.ino
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Acknowledgments

- Built as a Final Year Project
- Special thanks to the Computer Vision and Web Development communities
- Inspired by real-world antenna measurement systems

---

*For questions or support, please open an issue in the repository.*