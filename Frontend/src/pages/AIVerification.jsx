import React, { useRef, useState, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, StopCircle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Topbar from "../components/Topbar";
import Footer from "./Footer";

export default function AIVerification() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [status, setStatus] = useState("Initializing AI Engine...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadResources() {
      try {
        setStatus("Loading TensorFlow Backend...");
        await tf.ready();
        
        setStatus("Fetching YOLO-style Model...");
        const loadedModel = await cocoSsd.load({
            base: 'lite_mobilenet_v2' // Using lite version for speed & reliability
        });
        
        if (isMounted) {
          setModel(loadedModel);
          setLoading(false);
          setStatus("AI System Ready! Position your vehicle in frame.");
        }
      } catch (err) {
        console.error("Model load error:", err);
        if (isMounted) {
          setError("Failed to initialize AI. Please check your connection.");
          setLoading(false);
        }
      }
    }

    loadResources();
    
    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    setStatus("Accessing Camera...");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (err) {
        setError("Camera permission denied. Please allow access to proceed.");
      }
    } else {
        setError("Your browser doesn't support camera access.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
       videoRef.current.srcObject.getTracks().forEach(track => track.stop());
       videoRef.current.srcObject = null;
       setIsCameraActive(false);
       setStatus("Camera offline.");
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset previous states
    stopCamera();
    setVerified(false);
    setError(null);
    setStatus("Image uploaded! Initializing analysis...");
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      // Detection will be triggered by useEffect when state changes.
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (uploadedImage && model) {
        // Give time for image to render in DOM
        setTimeout(() => detectImage(), 500);
    }
  }, [uploadedImage, model]);

  const detectImage = async () => {
    if (!imageRef.current || !model || !canvasRef.current) return;
    
    setIsAnalyzing(true);
    setStatus("Analyzing image for vehicles...");

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Wait for image to be fully loaded
    if (!img.complete) {
        await new Promise(resolve => img.onload = resolve);
    }

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    try {
        const predictions = await model.detect(img);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let vehicleFound = false;

        predictions.forEach(prediction => {
          const [x, y, width, height] = prediction.bbox;
          const label = prediction.class;
          const score = Math.round(prediction.score * 100);

          if (["car", "motorcycle", "truck", "bus"].includes(label)) {
              vehicleFound = true;
              
              ctx.strokeStyle = '#22c55e';
              ctx.lineWidth = 10; // Thicker for high-res images
              ctx.lineJoin = 'round';
              ctx.strokeRect(x, y, width, height);

              ctx.fillStyle = '#22c55e';
              ctx.fillRect(x, y - 60, width, 60);
              
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 36px Inter, sans-serif';
              ctx.fillText(`${label.toUpperCase()} ${score}%`, x + 20, y - 15);
          }
        });

        if (vehicleFound) {
            setVerified(true);
            setStatus("Identification Successful! ✅");
        } else {
            setStatus("No vehicle detected. Please try a different photo.");
            setError("Analysis failed: No vehicle found in image.");
        }
    } catch(e) {
        console.error("Image Inference Error:", e);
        setError("AI Analysis failed. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const detectFrame = async () => {
    if (!videoRef.current || !model || videoRef.current.readyState !== 4 || !isCameraActive) {
        if (isCameraActive) requestAnimationFrame(detectFrame);
        return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
        const predictions = await model.detect(video);
        
        // Clear canvas but keep backdrop slightly dimmed if camera active
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let vehicleFound = false;

        predictions.forEach(prediction => {
          const [x, y, width, height] = prediction.bbox;
          const label = prediction.class;
          const score = Math.round(prediction.score * 100);

          if (["car", "motorcycle", "truck", "bus"].includes(label)) {
              vehicleFound = true;
              
              // Draw Glow Box
              ctx.strokeStyle = '#22c55e';
              ctx.lineWidth = 4;
              ctx.lineJoin = 'round';
              ctx.strokeRect(x, y, width, height);

              // Label Background
              ctx.fillStyle = '#22c55e';
              ctx.fillRect(x, y - 30, width, 30);
              
              // Label Text
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 16px Inter, sans-serif';
              ctx.fillText(`${label.toUpperCase()} ${score}%`, x + 10, y - 10);
          }
        });

        if (vehicleFound && !verified) {
            setVerified(true);
            setStatus("Identification Successful! ✅");
        } else if (!vehicleFound && isCameraActive && !verified) {
            setStatus("Scanning for vehicles...");
        }
    } catch(e) {
        console.error("Inference Error:", e);
    }

    if (isCameraActive) requestAnimationFrame(detectFrame);
  };

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4 font-sans text-slate-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 max-w-xl"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            AI Smart Verification
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Proprietary neural network to verify your rental vehicle in real-time.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] w-full max-w-3xl overflow-hidden border border-slate-100"
        >
          <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                      error ? 'bg-red-50 text-red-600 border border-red-100' : 
                      verified ? 'bg-green-50 text-green-600 border border-green-100' : 
                      'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  }`}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                       error ? <AlertCircle className="w-4 h-4" /> : 
                       verified ? <CheckCircle className="w-4 h-4" /> :
                       <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />}
                      {status}
                  </div>
                  
                  {isCameraActive && !verified && (
                      <motion.span 
                          animate={{ opacity: [1, 0.4, 1] }} 
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="text-xs uppercase tracking-widest font-bold text-red-500"
                      >
                          Live Feed
                      </motion.span>
                  )}
              </div>

              <div className="relative w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden flex items-center justify-center shadow-inner group">
                  <video 
                      ref={videoRef} 
                      className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
                      autoPlay 
                      muted 
                      playsInline
                      onPlay={() => detectFrame()}
                  />
                  
                  {uploadedImage && !isCameraActive && (
                      <img 
                          ref={imageRef}
                          src={uploadedImage}
                          className="absolute top-0 left-0 w-full h-full object-contain z-0"
                          alt="Uploaded vehicle"
                      />
                  )}

                  <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-10" />
                  
                  {!isCameraActive && !uploadedImage && (
                      <div className="relative z-0 text-center">
                          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-xl">
                              <Camera className="w-8 h-8 text-slate-500" />
                          </div>
                          <p className="text-slate-400 font-medium">Ready to Verify</p>
                          <p className="text-slate-500 text-sm mt-1">Activate camera or upload a photo</p>
                          {error && <p className="text-red-400 text-sm mt-2 px-4 italic font-medium">⚠ {error}</p>}
                      </div>
                  )}

                  {/* Aesthetic Scanning Overlay */}
                  {isCameraActive && !verified && (
                      <motion.div 
                          initial={{ top: '0%' }}
                          animate={{ top: '100%' }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-[2px] bg-indigo-500/50 shadow-[0_0_15px_#6366f1] z-20 pointer-events-none"
                      />
                  )}
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  {!isCameraActive ? (
                      <button 
                          onClick={startCamera} 
                          disabled={loading || verified}
                          className="group relative bg-slate-900 overflow-hidden hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-xl flex items-center gap-3 active:scale-95"
                      >
                          <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>Activate Scanner</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </button>
                  ) : (
                      <button 
                          onClick={stopCamera}
                          className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-4 px-10 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-sm active:scale-95"
                      >
                          <StopCircle className="w-5 h-5 text-slate-400" />
                          Terminate Feed
                      </button>
                  )}

                  {!isCameraActive && (
                      <>
                          <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleFileUpload} 
                              accept="image/*" 
                              className="hidden" 
                          />
                          <button 
                              onClick={() => fileInputRef.current.click()}
                              disabled={loading || isAnalyzing}
                              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl active:scale-95 ${isAnalyzing ? 'opacity-70' : ''}`}
                          >
                              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                              <span>{uploadedImage ? "Upload New Photo" : "Upload Vehicle Photo"}</span>
                          </button>
                      </>
                  )}

                  {uploadedImage && !isCameraActive && (
                      <button 
                          onClick={() => {
                              setUploadedImage(null);
                              setVerified(false);
                              setStatus("Reset. Ready to Verify.");
                              if(canvasRef.current) {
                                  const ctx = canvasRef.current.getContext('2d');
                                  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                              }
                          }}
                          className="bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center gap-2 active:scale-95"
                      >
                          Clear
                      </button>
                  )}
              </div>
              
              <AnimatePresence>
                  {verified && (
                      <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-center"
                      >
                          <p className="text-green-700 font-semibold mb-3">Vehicle successfully verified!</p>
                          <button 
                              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-md"
                              onClick={() => window.location.href = '/checkout'}
                          >
                              Continue to Checkout
                          </button>
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
        </motion.div>
        
        <div className="mt-12 flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-tighter">
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
              Vison-X AI
          </div>
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-tighter">
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
              Neural Engine
          </div>
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-tighter">
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
              YOLO Core
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

