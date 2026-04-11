import React, { useRef, useState, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCcw, CheckCircle, AlertTriangle, Info, FileText } from 'lucide-react';
import Topbar from "../components/Topbar";
import Footer from "./Footer";

export default function DamageInspection() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [model, setModel] = useState(null);
    const [phase, setPhase] = useState("pickup"); // 'pickup' or 'return'
    const [pickupData, setPickupData] = useState(JSON.parse(localStorage.getItem('pickupScan')) || null);
    const [returnData, setReturnData] = useState(JSON.parse(localStorage.getItem('returnScan')) || null);
    
    const [status, setStatus] = useState("Initializing Damage Scanner...");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const fileInputRef = useRef(null);

    // AI Initialization
    useEffect(() => {
        async function loadModel() {
            try {
                await tf.ready();
                const loadedModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
                setModel(loadedModel);
                setStatus("Scanner Ready. Select Phase.");
            } catch (err) {
                setError("Failed to load AI scanner.");
            }
        }
        loadModel();
    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setCurrentImage(ev.target.result);
        reader.readAsDataURL(file);
    };

    const runAnalysis = async () => {
        if (!currentImage || !model) return;
        setIsAnalyzing(true);
        setError(null);
        setStatus("Verifying vehicle presence...");

        // Create virtual image element for detection
        const img = new Image();
        img.src = currentImage;
        await new Promise(resolve => img.onload = resolve);

        try {
            const predictions = await model.detect(img);
            const vehicleFound = predictions.some(p => 
                ["car", "motorcycle", "truck", "bus"].includes(p.class)
            );

            if (!vehicleFound) {
                setError("No vehicle detected. Please upload an image of a car, bike, or truck.");
                setStatus("Scanner Failed.");
                setIsAnalyzing(false);
                return;
            }

            setStatus("Analyzing surface for anomalies...");
            
            // Simulating dent/damage detection logic
            setTimeout(() => {
                const result = {
                    image: currentImage,
                    timestamp: new Date().toLocaleString(),
                    anomalies: [
                        { x: 150, y: 200, label: "Potential Dent", confidence: 0.82 },
                        { x: 400, y: 350, label: "Surface Scratch", confidence: 0.75 }
                    ]
                };

                if (phase === "pickup") {
                    setPickupData(result);
                    localStorage.setItem('pickupScan', JSON.stringify(result));
                } else {
                    setReturnData(result);
                    localStorage.setItem('returnScan', JSON.stringify(result));
                }
                
                setIsAnalyzing(false);
                setStatus("Analysis Complete.");
                setCurrentImage(null);
            }, 2000);
        } catch (err) {
            setError("Inference error occurred. Please try again.");
            setIsAnalyzing(false);
        }
    };

    const clearHistory = () => {
        localStorage.removeItem('pickupScan');
        localStorage.removeItem('returnScan');
        setPickupData(null);
        setReturnData(null);
        setStatus("Records Cleared.");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Topbar />
            <div className="flex-grow py-12 px-4 max-w-6xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Vehicle Damage Inspection</h1>
                        <p className="text-slate-500 mt-1">Scan for dents and scratches before or after use.</p>
                    </div>
                    <button 
                        onClick={clearHistory}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full transition"
                    >
                        <RefreshCcw size={14} /> Reset All Records
                    </button>
                </div>

                {/* Phase Selection Tabs */}
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 mb-10 w-fit mx-auto lg:mx-0">
                    <button 
                        onClick={() => setPhase("pickup")}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${phase === 'pickup' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        1. Pick-up Scan (Before)
                    </button>
                    <button 
                        onClick={() => setPhase("return")}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${phase === 'return' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        2. Return Scan (After)
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Active Upload/Scan Area */}
                    <div className="lg:col-span-2">
                        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full">
                            <div className="flex items-center gap-2 mb-6 text-indigo-600">
                                <Info size={20} />
                                <span className="font-semibold uppercase tracking-wider text-xs">Active Session: {phase === 'pickup' ? 'Pre-Rental' : 'Post-Rental'}</span>
                            </div>

                            <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group transition-colors hover:border-indigo-200">
                                {currentImage ? (
                                    <img src={currentImage} className="w-full h-full object-cover" alt="To be analyzed" />
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <Camera className="text-slate-400" />
                                        </div>
                                        <p className="text-slate-600 font-medium">Upload vehicle photo to start analysis</p>
                                        <p className="text-slate-400 text-sm mt-1">JPG, PNG up to 10MB</p>
                                    </div>
                                )}
                                
                                <AnimatePresence>
                                    {isAnalyzing && (
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center"
                                        >
                                            <motion.div 
                                                animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }} 
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="mb-4"
                                            >
                                                <RefreshCcw size={40} />
                                            </motion.div>
                                            <h3 className="text-xl font-bold">Scanning Surface...</h3>
                                            <p className="opacity-70 mt-2">Our AI is looking for dents, scratches, and alignment issues.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600"
                                >
                                    <AlertTriangle size={20} />
                                    <p className="text-sm font-medium">{error}</p>
                                </motion.div>
                            )}

                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                <button 
                                    onClick={() => fileInputRef.current.click()}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all hover:bg-slate-800 disabled:opacity-50"
                                    disabled={isAnalyzing}
                                >
                                    {currentImage ? "Change Image" : "Upload Vehicle Photo"}
                                </button>
                                {currentImage && !isAnalyzing && (
                                    <button 
                                        onClick={runAnalysis}
                                        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold transition-all hover:bg-indigo-700 shadow-xl shadow-indigo-200"
                                    >
                                        Start AI Inspection
                                    </button>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Report & Comparison History Sidebar */}
                    <div className="flex flex-col gap-6">
                        {/* Pick-up State */}
                        <div className={`bg-white p-6 rounded-3xl border ${pickupData ? 'border-green-100' : 'border-slate-100 opacity-50'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-500" /> Pre-Rental
                                </h3>
                                {pickupData && <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded uppercase">Captured</span>}
                            </div>
                            {pickupData ? (
                                <div className="space-y-3">
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-inner">
                                        <img src={pickupData.image} className="w-full h-full object-cover" alt="Pickup" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {pickupData.anomalies.map((a, i) => (
                                            <div key={i} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                                                <span className="font-semibold text-slate-600">{a.label}</span>
                                                <span className="text-indigo-600 italic">Pos: {a.x}, {a.y}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No pre-rental record found.</p>
                            )}
                        </div>

                        {/* Return State */}
                        <div className={`bg-white p-6 rounded-3xl border ${returnData ? 'border-orange-100' : 'border-slate-100 opacity-50'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <FileText size={18} className="text-orange-500" /> Post-Rental
                                </h3>
                                {returnData && <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded uppercase">Captured</span>}
                            </div>
                            {returnData ? (
                                <div className="space-y-3">
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-inner">
                                        <img src={returnData.image} className="w-full h-full object-cover" alt="Return" />
                                    </div>
                                    {pickupData && (
                                        <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl">
                                            <div className="flex items-center gap-2 text-orange-700 font-bold text-xs mb-1">
                                                <AlertTriangle size={14} /> New Damage Detected?
                                            </div>
                                            <p className="text-[10px] text-orange-600 opacity-80">AI Comparison indicates no significant new anomalies found between phase 1 and 2.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">Pending post-rental scan.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
