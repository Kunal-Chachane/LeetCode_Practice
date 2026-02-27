import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap,
  LogOut,
  User,
  Mail,
  Key,
  Music,
  Volume2,
  Play,
  Pause,
  Clipboard,
  Save,
  Moon,
  Sun,
  Eye,
  FileUp,
  Activity,
  Maximize2
} from 'lucide-react';
import { encodeMessage, decodeMessage, stringToUint8, uint8ToString } from './utils/steganography';
import { encodeAudioMessage, decodeAudioMessage, audioBufferToWav } from './utils/audioSteganography';
import { encryptData, decryptData } from './utils/crypto';

// Helper for Statistical Analysis
const calculateHistogram = (imageData: ImageData) => {
  const r = new Array(256).fill(0);
  const g = new Array(256).fill(0);
  const b = new Array(256).fill(0);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    r[data[i]]++;
    g[data[i+1]]++;
    b[data[i+2]]++;
  }
  return { r, g, b };
};

const calculateChiSquare = (imageData: ImageData) => {
  const data = imageData.data;
  const observed = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    observed[data[i]]++;
  }
  let chiSquare = 0;
  for (let i = 0; i < 256; i += 2) {
    const y_i = (observed[i] + observed[i + 1]) / 2;
    if (y_i > 0) {
      chiSquare += Math.pow(observed[i] - y_i, 2) / y_i;
    }
  }
  // Simplified probability mapping: higher chi-square = higher chance of LSB hiding
  // A typical image has very high chi-square if natural, but lower if bits are randomized
  const prob = Math.max(0, 100 - (chiSquare / (data.length / 400)));
  return Math.min(100, prob);
};

const HistogramView = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[1px] h-16 w-full bg-slate-50/50 rounded-lg p-1 overflow-hidden">
      {data.map((val, i) => (
        <div
          key={i}
          className="flex-1 min-w-[1px]"
          style={{
            height: `${(val / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.6
          }}
        />
      ))}
    </div>
  );
};

type Mode = 'home' | 'encode' | 'decode' | 'compare' | 'analyze' | 'signin' | 'signup';

interface RecentActivity {
  id: string;
  type: 'encode' | 'decode';
  timestamp: number;
  imageName: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
}

export default function App() {
  const [mode, setMode] = useState<Mode>('home');
  
  const [isSecure, setIsSecure] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [decodedMessage, setDecodedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageMetadata, setImageMetadata] = useState<{ width: number; height: number; size: string; capacity: number } | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [resultAudio, setResultAudio] = useState<string | null>(null);
  const [audioMetadata, setAudioMetadata] = useState<{ duration: string; size: string; capacity: number } | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [password, setPassword] = useState('');
  const [seed, setSeed] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [hiddenFile, setHiddenFile] = useState<{ name: string, data: Uint8Array } | null>(null);
  const [useCompression, setUseCompression] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{ red: string; green: string; blue: string; heatmap: string } | null>(null);
  const [bitPlane, setBitPlane] = useState(0);
  const [analysisChannel, setAnalysisChannel] = useState<'all' | 'red' | 'green' | 'blue' | 'heatmap'>('all');
  const [histograms, setHistograms] = useState<{ original: any, result: any } | null>(null);
  const [chiSquareScore, setChiSquareScore] = useState<number | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  // Load Activity
  useEffect(() => {
    const savedActivity = localStorage.getItem('stegano_activity');
    if (savedActivity) {
      setRecentActivity(JSON.parse(savedActivity));
    }
  }, []);

  useEffect(() => {
    const len = password.length;
    const lower = /[a-z]/.test(password) ? 1 : 0;
    const upper = /[A-Z]/.test(password) ? 1 : 0;
    const digit = /[0-9]/.test(password) ? 1 : 0;
    const symbol = /[^A-Za-z0-9]/.test(password) ? 1 : 0;
    const variety = lower + upper + digit + symbol;
    const score = Math.min(100, Math.round((len / 24) * 50) + variety * 12);
    setPasswordStrength(score);
  }, [password]);

  const reset = () => {
    setSelectedImage(null);
    setSelectedAudio(null);
    setAudioBuffer(null);
    setResultAudio(null);
    setAudioMetadata(null);
    setMessage('');
    setResultImage(null);
    setDecodedMessage(null);
    setError(null);
    setIsProcessing(false);
  };

  const addActivity = (type: 'encode' | 'decode') => {
    const newActivity: RecentActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      timestamp: Date.now(),
      imageName: selectedAudio ? 'Audio_Carrier' : 'Image_Carrier'
    };
    const updated = [newActivity, ...recentActivity].slice(0, 5);
    setRecentActivity(updated);
    localStorage.setItem('stegano_activity', JSON.stringify(updated));
  };

  const processSelectedFile = (file: File | undefined) => {
    if (file) {
      setError(null);
      reset(); // Clear previous state
      
      if (file.type.startsWith('image/')) {
        setIsImageLoading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
          const dataUrl = event.target?.result as string;
          const img = new Image();
          img.onload = () => {
            setSelectedImage(dataUrl);
            const capacity = Math.floor((img.width * img.height * 3) / 8);
            setImageMetadata({
              width: img.width,
              height: img.height,
              size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
              capacity
            });
            setIsImageLoading(false);
          };
          img.onerror = () => {
            setError('Failed to load image. Please try another file.');
            setIsImageLoading(false);
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('audio/')) {
        setIsImageLoading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const buffer = await audioCtx.decodeAudioData(arrayBuffer);
            setAudioBuffer(buffer);
            setSelectedAudio(URL.createObjectURL(file));
            const capacity = Math.floor((buffer.length * buffer.numberOfChannels) / 8);
            setAudioMetadata({
              duration: buffer.duration.toFixed(2) + 's',
              size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
              capacity
            });
            setIsImageLoading(false);
          } catch (err) {
            setError('Failed to decode audio. Please try another file.');
            setIsImageLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setError('Unsupported file type. Please select an image or audio file.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    processSelectedFile(file);
  };

  const handleEncode = async () => {
    if ((!selectedImage && !audioBuffer) || (!message && !hiddenFile)) return;
    setIsProcessing(true);
    setProcessingProgress(0);
    setError(null);

    try {
      setProcessingStep('Security Handshake');
      setProcessingProgress(10);
      await new Promise(r => setTimeout(r, 400));

      let payload: Uint8Array;
      const dataToHide = hiddenFile ? hiddenFile.data : message;

      if (isSecure) {
        setProcessingStep('AES-256 Key Derivation');
        setProcessingProgress(25);
        await new Promise(r => setTimeout(r, 500));
        
        setProcessingStep('Payload Encryption');
        setProcessingProgress(40);
        payload = await encryptData(dataToHide, password || undefined, useCompression);
        await new Promise(r => setTimeout(r, 500));
      } else {
        payload = typeof dataToHide === 'string' ? stringToUint8(dataToHide) : dataToHide;
      }

      if (selectedImage) {
        setProcessingStep('Carrier Image Analysis');
        setProcessingProgress(55);
        const img = new Image();
        img.src = selectedImage;
        await img.decode();
        await new Promise(r => setTimeout(r, 400));

        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        setProcessingStep('Chaotic Bit Mapping');
        setProcessingProgress(75);
        await new Promise(r => setTimeout(r, 600));

        const encodedData = seed ? encodeMessage(imageData, payload, seed) : encodeMessage(imageData, payload, isSecure ? undefined : '');
        if (!encodedData) {
          throw new Error('Payload too large for this image');
        }

        ctx.putImageData(encodedData, 0, 0);
        setResultImage(canvas.toDataURL('image/png'));
        
        // Generate Histogram for Comparison
        const resultHist = calculateHistogram(encodedData);
        const originalHist = calculateHistogram(imageData);
        setHistograms({ original: originalHist, result: resultHist });
      } else if (audioBuffer) {
        setProcessingStep('Audio Stream Analysis');
        setProcessingProgress(55);
        await new Promise(r => setTimeout(r, 600));

        setProcessingStep('Chaotic Bit Mapping');
        setProcessingProgress(75);
        await new Promise(r => setTimeout(r, 600));

        const encodedBuffer = seed ? encodeAudioMessage(audioBuffer, payload, seed) : encodeAudioMessage(audioBuffer, payload, isSecure ? undefined : '');
        if (!encodedBuffer) {
          throw new Error('Payload too large for this audio file');
        }

        const wavBlob = audioBufferToWav(encodedBuffer);
        setResultAudio(URL.createObjectURL(wavBlob));
      }

      setProcessingProgress(100);
      setProcessingStep('Encryption Complete');
      addActivity('encode');
      await new Promise(r => setTimeout(r, 500));
      setIsProcessing(false);
    } catch (err: any) {
      setError(err.message || 'Processing failed');
      setIsProcessing(false);
    }
  };

  const handleDecode = async () => {
    if (!selectedImage && !audioBuffer) return;
    setIsProcessing(true);
    setProcessingProgress(0);
    setError(null);

    try {
      let payload: Uint8Array | null = null;

      if (selectedImage) {
        setProcessingStep('Image Analysis');
        setProcessingProgress(20);
        const img = new Image();
        img.src = selectedImage;
        await img.decode();

        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        setProcessingStep('Chaotic Bit Extraction');
        setProcessingProgress(50);
        await new Promise(r => setTimeout(r, 600));

        payload = seed ? decodeMessage(imageData, seed) : decodeMessage(imageData, isSecure ? undefined : '');
      } else if (audioBuffer) {
        setProcessingStep('Audio Stream Analysis');
        setProcessingProgress(20);
        await new Promise(r => setTimeout(r, 600));

        setProcessingStep('Chaotic Bit Extraction');
        setProcessingProgress(50);
        await new Promise(r => setTimeout(r, 600));

        payload = seed ? decodeAudioMessage(audioBuffer, seed) : decodeAudioMessage(audioBuffer, isSecure ? undefined : '');
      }

      if (!payload) {
        throw new Error('No hidden message found or invalid security key');
      }

      if (isSecure) {
        setProcessingStep('AES-256 Decryption');
        setProcessingProgress(80);
        await new Promise(r => setTimeout(r, 500));
        const { data, isText } = await decryptData(payload, password || undefined);
        if (isText) {
          setDecodedMessage(uint8ToString(data));
        } else {
          // It's a file
          const blob = new Blob([data], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'hidden_file_decrypted';
          link.click();
          setDecodedMessage('Binary file detected and downloaded successfully.');
        }
      } else {
        setDecodedMessage(uint8ToString(payload));
      }

      setProcessingProgress(100);
      setProcessingStep('Decryption Complete');
      addActivity('decode');
      await new Promise(r => setTimeout(r, 500));
      setIsProcessing(false);
    } catch (err: any) {
      setError('Failed to decode. The file might not contain a message or it was encrypted with a different protocol.');
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    setProcessingStep('Analyzing Bit Planes...');
    setProcessingProgress(20);

    const img = new Image();
    img.src = selectedImage;
    await img.decode();

    const canvas = canvasRef.current!;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const generatePlane = (channel: 'all' | 'red' | 'green' | 'blue') => {
      ctx.drawImage(img, 0, 0);
      const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = currentImageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (channel === 'all') {
          for (let j = 0; j < 3; j++) {
            const bit = (data[i + j] >> bitPlane) & 1;
            data[i + j] = bit ? 255 : 0;
          }
        } else {
          const channelIdx = channel === 'red' ? 0 : channel === 'green' ? 1 : 2;
          const bit = (data[i + channelIdx] >> bitPlane) & 1;
          const val = bit ? 255 : 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }
        data[i + 3] = 255;
      }
      ctx.putImageData(currentImageData, 0, 0);
      return canvas.toDataURL();
    };

    const generateHeatmap = () => {
      ctx.drawImage(img, 0, 0);
      const heatmapImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = heatmapImageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Calculate local contrast as capacity
        const lum = (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114);
        // High frequency regions have more capacity
        data[i] = lum; // Intensity
        data[i+1] = 0;
        data[i+2] = 255 - lum; // Blue for cold, red for hot
        data[i+3] = 200; // Semi-transparent
      }
      ctx.putImageData(heatmapImageData, 0, 0);
      return canvas.toDataURL();
    };

    const results = {
      all: generatePlane('all'),
      red: generatePlane('red'),
      green: generatePlane('green'),
      blue: generatePlane('blue'),
      heatmap: generateHeatmap()
    };

    setAnalysisResult(results.all);
    setAnalysisResults(results);
    
    // Perform Chi-Square Analysis
    const prob = calculateChiSquare(imageData);
    setChiSquareScore(prob);

    setProcessingProgress(100);
    setIsProcessing(false);
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'stegano_secure.png';
    link.click();
  };

  const downloadAudio = () => {
    if (!resultAudio) return;
    const link = document.createElement('a');
    link.href = resultAudio;
    link.download = 'stegano_secure.wav';
    link.click();
  };

  const copyDecoded = () => {
    if (!decodedMessage) return;
    navigator.clipboard.writeText(decodedMessage);
  };

  const saveDecoded = () => {
    if (!decodedMessage) return;
    const blob = new Blob([decodedMessage], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'decoded_message.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 bg-[#0A0A0F] text-white selection:bg-red-500/30`}>
      <canvas ref={canvasRef} className="hidden" />
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Modern Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setMode('home'); reset(); }}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform duration-300">
            <Shield size={22} className="group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter">STEGANO<span className="text-red-500">PRO</span></h1>
            <p className="text-[9px] font-black tracking-[0.3em] text-white/40 uppercase">Elite Cyber Defense</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {['Encode', 'Decode', 'Analyze'].map((item) => (
            <button 
              key={item}
              onClick={() => setMode(item.toLowerCase() as any)}
              className={`text-xs font-black uppercase tracking-widest transition-all ${mode === item.toLowerCase() ? 'text-red-500' : 'text-white/50 hover:text-white'}`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(v => !v)}
            className={`p-2 rounded-xl transition-all flex items-center justify-center ${isDark ? 'bg-white/5 text-amber-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden md:block">
                <p className="text-xs font-black tracking-tight">{user.name}</p>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Operator Level 1</p>
                </div>
              </div>
              <button 
                onClick={() => setUser(null)}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-white/60 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMode('signin')}
                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => setMode('signup')}
                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-red-600 text-white rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-700 hover:scale-105 transition-all"
              >
                Join Unit
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {mode === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] border border-white/5 p-12 lg:p-20 text-center space-y-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[100px] rounded-full -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full -ml-48 -mb-48" />
                
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-4"
                >
                  <Zap size={12} className="animate-pulse" />
                  V2.5.0 Deployment Live
                </motion.div>
                
                <h2 className="text-5xl lg:text-8xl font-black tracking-tighter leading-tight max-w-4xl mx-auto uppercase">
                  Secure Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-indigo-600">Intellectual Data</span>
                </h2>
                
                <p className="text-lg text-white/50 max-w-2xl mx-auto font-medium leading-relaxed">
                  Advanced cryptographic steganography for elite data hiding. Inject encrypted payloads into image and audio carriers with zero visual footprint.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button 
                    onClick={() => setMode('encode')}
                    className="w-full sm:w-auto px-10 py-5 rounded-[2rem] bg-red-600 text-white font-black text-lg shadow-2xl shadow-red-600/30 hover:bg-red-700 hover:scale-105 transition-all flex items-center justify-center gap-3 group"
                  >
                    Start Mission <Lock size={20} className="group-hover:rotate-12 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setMode('analyze')}
                    className="w-full sm:w-auto px-10 py-5 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                  >
                    Forensic Scan <Activity size={20} />
                  </button>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Secure Encode', desc: 'Hide encrypted data in carriers', icon: Lock, color: 'from-red-600 to-rose-400', mode: 'encode' },
                  { title: 'Secure Decode', desc: 'Extract hidden intelligence', icon: Unlock, color: 'from-emerald-600 to-teal-400', mode: 'decode' },
                  { title: 'Neural Scan', desc: 'Bit-plane forensic analysis', icon: Activity, color: 'from-indigo-600 to-blue-400', mode: 'analyze' }
                ].map((feat, i) => (
                  <motion.button
                    key={feat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    onClick={() => setMode(feat.mode as any)}
                    className="group relative p-8 rounded-[2.5rem] bg-[#1A1A2E] border border-white/5 hover:border-white/20 transition-all text-left overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500 text-white`}>
                      <feat.icon size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-300`}>
                        <feat.icon size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black">{feat.title}</h3>
                        <p className="text-white/40 mt-1 font-medium">{feat.desc}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Stats & Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="text-xl font-black uppercase tracking-tighter">Mission History</h3>
                    <button 
                      onClick={() => {
                        setRecentActivity([]);
                        localStorage.removeItem('stegano_activity');
                      }}
                      className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                    >
                      Purge Logs
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? recentActivity.slice(0, 4).map((activity) => (
                      <motion.div 
                        key={activity.id}
                        layout
                        className="glass p-5 rounded-[2rem] flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.type === 'encode' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {activity.imageName.includes('Audio') ? <Music size={20} /> : (activity.type === 'encode' ? <Lock size={20} /> : <Unlock size={20} />)}
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight">{activity.imageName}</p>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                              {new Date(activity.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white group-hover:bg-red-500 transition-all">
                          {activity.type === 'encode' ? 'Encrypted' : 'Extracted'}
                        </div>
                      </motion.div>
                    )) : (
                      <div className="glass p-12 rounded-[2.5rem] flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                          <RefreshCw size={32} />
                        </div>
                        <p className="text-white/30 font-bold uppercase tracking-widest text-xs">No active intelligence recorded</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tighter px-4">System Status</h3>
                  <div className="glass p-8 rounded-[2.5rem] space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Neural Load</span>
                        <span className="text-[10px] font-black text-red-500">OPTIMIZED</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-red-600" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Core Status</span>
                        <span className="text-[10px] font-black text-red-500">ENCRYPTED</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-red-600" />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={16} className="text-red-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption Active</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Zap size={16} className="text-red-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Chaotic Bit Mapping Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(mode === 'encode' || mode === 'decode' || mode === 'analyze') && (
            <motion.div
              key="action"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <motion.button 
                  whileHover={{ x: -5 }}
                  onClick={() => { setMode('home'); reset(); setAnalysisResult(null); }}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-950 transition-colors font-bold uppercase text-xs tracking-widest"
                >
                  <ArrowLeft size={18} />
                  Back
                </motion.button>

                {mode !== 'analyze' && (
                  <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-2xl">
                    <button 
                      onClick={() => setIsSecure(true)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isSecure ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                    >
                      <Shield size={14} /> Secure
                    </button>
                    <button 
                      onClick={() => setIsSecure(false)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${!isSecure ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500'}`}
                    >
                      <Zap size={14} /> Basic
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[3rem] border-2 border-slate-100 p-10 shadow-sm space-y-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${mode === 'encode' ? 'bg-indigo-600' : mode === 'decode' ? 'bg-emerald-600' : 'bg-purple-600'}`}>
                    {mode === 'encode' ? <Lock size={24} /> : mode === 'decode' ? <Unlock size={24} /> : <Activity size={24} />}
                  </div>
                  <h2 className="text-3xl font-black">{mode === 'encode' ? 'Encode' : mode === 'decode' ? 'Decode' : 'Analyze'} Data</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">1. Carrier File</label>
                      <motion.div 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`relative aspect-video rounded-[2rem] border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden
                          ${(selectedImage || selectedAudio) ? 'border-indigo-100 bg-indigo-50/20' : 'border-slate-100 hover:border-indigo-200 bg-slate-50'}`}
                      >
                        <AnimatePresence mode="wait">
                          {isImageLoading ? (
                            <motion.div 
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col items-center gap-3"
                            >
                              <RefreshCw className="text-indigo-600 animate-spin" size={32} />
                              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Optimizing File...</span>
                            </motion.div>
                          ) : selectedImage ? (
                            <motion.div key="preview" className="relative w-full h-full">
                              <motion.img 
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={selectedImage} 
                                className="w-full h-full object-contain bg-slate-900/5" 
                                alt="Selected" 
                              />
                              {imageMetadata && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="absolute bottom-4 left-4 right-4 flex gap-2"
                                >
                                  <div className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/50 flex items-center gap-2">
                                    <ImageIcon size={12} className="text-indigo-600" />
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">
                                      {imageMetadata.width} × {imageMetadata.height}
                                    </span>
                                  </div>
                                  <div className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/50 flex items-center gap-2">
                                    <FileText size={12} className="text-indigo-600" />
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">
                                      {imageMetadata.size}
                                    </span>
                                  </div>
                                  <div className="ml-auto px-3 py-1.5 rounded-lg bg-emerald-500 text-white shadow-sm flex items-center gap-2">
                                    <CheckCircle2 size={12} />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Ready</span>
                                  </div>
                                </motion.div>
                              )}
                            </motion.div>
                          ) : selectedAudio ? (
                            <motion.div key="audio-preview" className="flex flex-col items-center gap-4 p-8 w-full">
                              <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                                <Music size={40} />
                              </div>
                              <div className="text-center space-y-1">
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Audio Carrier Loaded</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ready for Bitstream Injection</p>
                              </div>
                              <audio controls src={selectedAudio} className="w-full max-w-[240px] h-8" onClick={(e) => e.stopPropagation()} />
                              {audioMetadata && (
                                <div className="flex gap-2">
                                  <div className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/50 flex items-center gap-2">
                                    <Volume2 size={12} className="text-indigo-600" />
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">
                                      {audioMetadata.duration}
                                    </span>
                                  </div>
                                  <div className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/50 flex items-center gap-2">
                                    <FileText size={12} className="text-indigo-600" />
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">
                                      {audioMetadata.size}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="placeholder"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col items-center"
                            >
                              <div className="flex gap-4 mb-3">
                                <ImageIcon size={40} className="text-slate-200" />
                                <Music size={40} className="text-slate-200" />
                              </div>
                              <span className="text-sm text-slate-500 font-bold">Drop Image or Audio Here</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,audio/*" className="hidden" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {mode === 'encode' ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">2. Secret Data</label>
                          {(imageMetadata || audioMetadata) && (
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${message.length > (imageMetadata?.capacity || audioMetadata?.capacity || 0) ? 'text-red-500' : 'text-slate-400'}`}>
                              {message.length.toLocaleString()} / {(imageMetadata?.capacity || audioMetadata?.capacity || 0).toLocaleString()} chars
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mb-2">
                          <button 
                            onClick={() => setHiddenFile(null)}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!hiddenFile ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                          >
                            Text Message
                          </button>
                          <button 
                            onClick={() => hiddenFileInputRef.current?.click()}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${hiddenFile ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                          >
                            {hiddenFile ? `File: ${hiddenFile.name}` : 'Hide File'}
                          </button>
                          <input 
                            type="file" 
                            ref={hiddenFileInputRef} 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setHiddenFile({ name: file.name, data: new Uint8Array(ev.target?.result as ArrayBuffer) });
                                };
                                reader.readAsArrayBuffer(file);
                              }
                            }}
                          />
                        </div>
                        {!hiddenFile ? (
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your secret message..."
                            className="w-full h-[120px] p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all resize-none font-medium"
                          />
                        ) : (
                          <div className="w-full h-[120px] rounded-2xl bg-slate-50 border-2 border-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-2">
                            <FileUp className="text-indigo-600" size={32} />
                            <p className="text-sm font-black text-slate-900">{hiddenFile.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{(hiddenFile.data.length / 1024).toFixed(2)} KB Ready to hide</p>
                          </div>
                        )}
                        {(imageMetadata || audioMetadata) && (
                          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              animate={{ 
                                width: `${Math.min(100, ((hiddenFile ? hiddenFile.data.length : message.length) / (imageMetadata?.capacity || audioMetadata?.capacity || 1)) * 100)}%`,
                                backgroundColor: (hiddenFile ? hiddenFile.data.length : message.length) > (imageMetadata?.capacity || audioMetadata?.capacity || 0) ? '#ef4444' : '#4f46e5'
                              }}
                              className="h-full transition-colors"
                            />
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                              <button 
                                onClick={() => setUseCompression(!useCompression)}
                                className={`text-[10px] font-black uppercase tracking-widest ${useCompression ? 'text-indigo-600' : 'text-slate-400'}`}
                              >
                                {useCompression ? 'Gzip ON' : 'Gzip OFF'}
                              </button>
                            </div>
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Optional; AES-256"
                              className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all"
                            />
                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                animate={{ width: `${passwordStrength}%`, backgroundColor: passwordStrength > 70 ? '#10b981' : passwordStrength > 40 ? '#f59e0b' : '#ef4444' }}
                                className="h-full transition-colors"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chaotic Seed</label>
                            <input
                              type="text"
                              value={seed}
                              onChange={(e) => setSeed(e.target.value)}
                              placeholder="Optional; shuffle seed"
                              className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    ) : mode === 'decode' ? (
                      decodedMessage && (
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Decoded Output</label>
                          <div className="w-full p-6 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-lg break-all shadow-inner min-h-[160px]">
                            {decodedMessage}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={copyDecoded}
                              className="py-3 rounded-2xl bg-slate-100 text-slate-700 font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                            >
                              <Clipboard size={18} /> Copy
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={saveDecoded}
                              className="py-3 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                            >
                              <Save size={18} /> Save
                            </motion.button>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Analysis Controls</label>
                          <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-600">Statistical Analysis</span>
                              <div className="flex items-center gap-1">
                                <Activity size={12} className="text-indigo-600" />
                                <span className="text-[10px] font-black uppercase text-indigo-600">Real-time</span>
                              </div>
                            </div>
                            {chiSquareScore !== null && (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Detection Probability</span>
                                  <span className={`text-sm font-black ${chiSquareScore > 70 ? 'text-red-500' : chiSquareScore > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {chiSquareScore.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${chiSquareScore}%` }}
                                    className={`h-full ${chiSquareScore > 70 ? 'bg-red-500' : chiSquareScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                  />
                                </div>
                                <p className="text-[9px] font-medium text-slate-400 italic">
                                  * Based on Chi-Square statistical noise variance in the primary bit planes.
                                </p>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-600">Select Bit Plane</span>
                              <span className="text-xs font-black text-indigo-600">Plane {bitPlane}</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="7" 
                              value={bitPlane} 
                              onChange={(e) => setBitPlane(parseInt(e.target.value))}
                              className="w-full accent-indigo-600"
                            />
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                              <span>LSB (0)</span>
                              <span>MSB (7)</span>
                            </div>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                            LSB bit-plane visualization helps detect steganography. Hidden data often appears as statistical noise or patterns in the lowest bit planes.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 text-red-600 border-2 border-red-100 font-bold text-sm">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}

                {/* Processing Overlay */}
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
                    >
                      <div className="max-w-md w-full px-8 space-y-8 text-center relative">
                        {/* HUD Elements */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 border-t-2 border-l-2 border-indigo-500/30 rounded-tl-3xl pointer-events-none" />
                        <div className="absolute -top-20 -right-20 w-40 h-40 border-t-2 border-r-2 border-indigo-500/30 rounded-tr-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 border-b-2 border-l-2 border-indigo-500/30 rounded-bl-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 border-b-2 border-r-2 border-indigo-500/30 rounded-br-3xl pointer-events-none" />
                        
                        <div className="relative mx-auto w-32 h-32">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-dashed border-indigo-600/30 rounded-full"
                          />
                          <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-2 border border-emerald-500/20 rounded-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              animate={{ 
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Shield className="text-indigo-600" size={40} />
                            </motion.div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <motion.h3 
                              key={processingStep}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-2xl font-black tracking-tighter text-slate-900 uppercase"
                            >
                              {processingStep}
                            </motion.h3>
                            <div className="flex items-center justify-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                {mode === 'encode' ? 'System.Security.Protocol_Active' : mode === 'decode' ? 'System.Decryption.Sequence' : 'System.Heuristic.Analysis'}
                              </p>
                            </div>
                          </div>

                          <div className="relative h-12 w-full bg-slate-100 rounded-xl border border-slate-200/50 overflow-hidden group">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${processingProgress}%` }}
                              className="h-full bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)] relative"
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                            </motion.div>
                            <div className="absolute inset-0 flex items-center justify-center mix-blend-difference">
                              <span className="text-xs font-black text-white tabular-nums">{processingProgress}% COMPLETE</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  animate={{ 
                                    opacity: processingProgress > (i * 33) ? 1 : 0.2,
                                    x: processingProgress > (i * 33) ? 0 : -100
                                  }}
                                  className="h-full bg-indigo-400"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 flex flex-col items-center gap-1">
                          <p className="text-[8px] font-mono text-slate-300 uppercase">Memory_Addr: 0x{Math.random().toString(16).substr(2, 8).toUpperCase()}</p>
                          <p className="text-[8px] font-mono text-slate-300 uppercase">Buffer_Status: Optimized</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {mode === 'encode' ? (
                  (!resultImage && !resultAudio) ? (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={(!selectedImage && !audioBuffer) || (!message && !hiddenFile) || isProcessing}
                      onClick={handleEncode}
                      className="w-full py-6 rounded-2xl bg-indigo-600 text-white font-black text-xl shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                    >
                      {isProcessing ? <RefreshCw className="animate-spin" /> : <Lock size={24} />}
                      {isProcessing ? 'Processing...' : 'Secure Encode'}
                    </motion.button>
                  ) : (
                    <div className="space-y-6">
                      {resultAudio && (
                        <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-100 flex flex-col items-center gap-4">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                               <Volume2 size={20} />
                             </div>
                             <span className="font-black text-emerald-900 uppercase tracking-tight">Encoded Audio Ready</span>
                           </div>
                           <audio controls src={resultAudio} className="w-full" />
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-4">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { reset(); }} 
                          className="py-6 rounded-2xl bg-slate-100 text-slate-700 font-black hover:bg-slate-200 transition-all"
                        >
                          Reset
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowCompare(true)} 
                          disabled={!resultImage}
                          className="py-6 rounded-2xl bg-emerald-50 text-emerald-600 font-black hover:bg-emerald-100 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                        >
                          <RefreshCw size={20} /> Compare
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={resultImage ? downloadImage : downloadAudio} 
                          className="py-6 rounded-2xl bg-indigo-600 text-white font-black shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                        >
                          <Download size={24} /> Download
                        </motion.button>
                      </div>
                    </div>
                  )
                ) : mode === 'decode' ? (
                  !decodedMessage && (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={(!selectedImage && !audioBuffer) || isProcessing}
                      onClick={handleDecode}
                      className="w-full py-6 rounded-2xl bg-emerald-600 text-white font-black text-xl shadow-2xl shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                    >
                      {isProcessing ? <RefreshCw className="animate-spin" /> : <Unlock size={24} />}
                      {isProcessing ? 'Decoding...' : 'Secure Extract'}
                    </motion.button>
                  )
                ) : (
                  <div className="space-y-6">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!selectedImage || isProcessing}
                      onClick={handleAnalyze}
                      className="w-full py-6 rounded-2xl bg-indigo-600 text-white font-black text-xl shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                    >
                      {isProcessing ? <RefreshCw className="animate-spin" /> : <Maximize2 size={24} />}
                      {isProcessing ? 'Analyzing...' : 'Generate Visualization'}
                    </motion.button>

                    {analysisResult && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <div className="flex gap-2 mb-4">
                          {['all', 'red', 'green', 'blue', 'heatmap'].map((ch) => (
                            <button
                              key={ch}
                              onClick={() => {
                                setAnalysisChannel(ch as any);
                                setAnalysisResult(ch === 'all' ? analysisResult : (analysisResults as any)[ch]);
                              }}
                              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${analysisChannel === ch ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                            >
                              {ch}
                            </button>
                          ))}
                        </div>
                        <div className="aspect-video rounded-3xl overflow-hidden bg-slate-900 border-2 border-indigo-500/30 shadow-2xl">
                          <img src={analysisChannel === 'all' ? analysisResult : (analysisResults as any)[analysisChannel]} className="w-full h-full object-contain" alt="Bit Plane Visualization" />
                        </div>
                        <div className="flex gap-4">
                           <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = analysisChannel === 'all' ? analysisResult : (analysisResults as any)[analysisChannel];
                                link.download = `bit_plane_${bitPlane}_${analysisChannel}.png`;
                                link.click();
                              }}
                              className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                           >
                              <Download size={20} /> Save Visualization
                           </motion.button>
                           <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => { setAnalysisResult(null); setAnalysisResults(null); }}
                              className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-700 font-black hover:bg-slate-200 transition-all"
                           >
                              Clear
                           </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Image Comparison Modal */}
              <AnimatePresence>
                {(mode === 'signin' || mode === 'signup') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-md p-6"
                  >
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="max-w-md w-full glass rounded-[3rem] border border-white/5 p-10 shadow-2xl space-y-8 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[40px] rounded-full -mr-16 -mt-16" />
                      
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                            <Shield size={24} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black tracking-tight">{mode === 'signin' ? 'Operator Login' : 'New Assignment'}</h2>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Secure Gateway v2.5</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setMode('home')}
                          className="w-10 h-10 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                        >
                          <ArrowLeft size={20} />
                        </button>
                      </div>

                      <div className="space-y-5 relative z-10">
                        {mode === 'signup' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Codename</label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-500 transition-colors" size={18} />
                              <input 
                                type="text" 
                                placeholder="Enter your alias"
                                value={authForm.name}
                                onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-red-500/50 outline-none transition-all font-medium text-sm placeholder:text-white/20"
                              />
                            </div>
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Digital Identity</label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-500 transition-colors" size={18} />
                            <input 
                              type="email" 
                              placeholder="operator@steganopro.io"
                              value={authForm.email}
                              onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-red-500/50 outline-none transition-all font-medium text-sm placeholder:text-white/20"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Security Key</label>
                          <div className="relative group">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-500 transition-colors" size={18} />
                            <input 
                              type="password" 
                              placeholder="••••••••"
                              value={authForm.password}
                              onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-red-500/50 outline-none transition-all font-medium text-sm placeholder:text-white/20"
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setUser({ id: '1', email: authForm.email, name: authForm.name || 'Operator' });
                          setMode('home');
                        }}
                        className="w-full py-5 rounded-[2rem] bg-red-600 text-white font-black text-lg shadow-2xl shadow-red-600/20 hover:bg-red-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 relative z-10"
                      >
                        {mode === 'signin' ? <Unlock size={20} /> : <CheckCircle2 size={20} />}
                        {mode === 'signin' ? 'Authorize' : 'Initialize'}
                      </button>

                      <p className="text-center text-sm font-bold text-white/30 relative z-10">
                        {mode === 'signin' ? "Need clearance?" : "Already registered?"}
                        <button 
                          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                          className="ml-2 text-red-500 hover:underline"
                        >
                          {mode === 'signin' ? 'Create Profile' : 'Access Unit'}
                        </button>
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {showCompare && resultImage && selectedImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-md p-6"
                  >
                    <div className="max-w-5xl w-full bg-white rounded-[3rem] border-2 border-slate-100 p-10 shadow-2xl space-y-8">
                      <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black">Visual Comparison</h2>
                        <button 
                          onClick={() => setShowCompare(false)}
                          className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
                        >
                          <ArrowLeft size={20} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Original Carrier</p>
                          <div className="aspect-video rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
                            <img src={selectedImage} className="w-full h-full object-contain" alt="Original" />
                          </div>
                          {histograms && (
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase">Histogram Distribution</p>
                              <HistogramView data={histograms.original.r} color="#ef4444" />
                              <HistogramView data={histograms.original.g} color="#10b981" />
                              <HistogramView data={histograms.original.b} color="#4f46e5" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Encoded Result</p>
                          <div className="aspect-video rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
                            <img src={resultImage} className="w-full h-full object-contain" alt="Encoded" />
                          </div>
                          {histograms && (
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase">Histogram Distribution</p>
                              <HistogramView data={histograms.result.r} color="#ef4444" />
                              <HistogramView data={histograms.result.g} color="#10b981" />
                              <HistogramView data={histograms.result.b} color="#4f46e5" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 text-center">
                        <p className="text-sm font-bold text-indigo-900">
                          Notice any difference? Our chaotic mapping ensures that even with high-capacity data, 
                          the visual integrity of your image remains indistinguishable to the human eye.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-200/50 h-8 flex items-center px-6">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> System Ready</span>
            <span className="hidden md:inline">AES-256-GCM Active</span>
          </div>
          <div className="flex items-center gap-4">
            <span>v2.0.0 Pro</span>
            <span className="hidden md:inline text-indigo-600">Developed by Kunal</span>
            <span className="hidden md:inline">© 2026 SteganoPro</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
