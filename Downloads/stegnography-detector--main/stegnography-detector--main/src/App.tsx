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

type Mode = 'home' | 'encode' | 'decode' | 'compare' | 'analyze';

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
  const [isDark, setIsDark] = useState(false);
  const [hiddenFile, setHiddenFile] = useState<{ name: string, data: Uint8Array } | null>(null);
  const [useCompression, setUseCompression] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{ red: string; green: string; blue: string } | null>(null);
  const [bitPlane, setBitPlane] = useState(0);
  const [analysisChannel, setAnalysisChannel] = useState<'all' | 'red' | 'green' | 'blue'>('all');

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

    const generatePlane = (channel: 'all' | 'red' | 'green' | 'blue') => {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

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
      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    };

    const results = {
      all: generatePlane('all'),
      red: generatePlane('red'),
      green: generatePlane('green'),
      blue: generatePlane('blue')
    };

    setAnalysisResult(results.all);
    setAnalysisResults({ red: results.red, green: results.green, blue: results.blue });
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
    <div className={`min-h-screen ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'} font-sans selection:bg-indigo-100 transition-colors duration-500 bg-grid`}>
      <canvas ref={canvasRef} className="hidden" />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => { setMode('home'); reset(); }}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Shield size={18} />
            </div>
            <span className="font-black text-xl tracking-tighter">SteganoPro</span>
          </motion.div>
          <button
            onClick={() => setIsDark(v => !v)}
            className="px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white shadow-sm text-slate-600"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />} Theme
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <AnimatePresence mode="wait">
          {mode === 'home' && (
            <motion.div
              key="home"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
                exit: { opacity: 0, y: -20 }
              }}
              className="space-y-12"
            >
              <motion.div 
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="space-y-6 text-center md:text-left"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20 cursor-default"
                >
                  <ShieldCheck size={14} />
                  AES-256 + Chaotic Map
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-950 leading-none">
                  Stegano<span className="text-indigo-600">Pro</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium mx-auto md:mx-0">
                  The most secure way to hide data. Encrypt your message with AES-256 and scatter bits chaotically across your image or audio files.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.button
                    variants={{
                      initial: { opacity: 0, scale: 0.9 },
                      animate: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('encode')}
                    className="group relative p-10 bg-white rounded-[2.5rem] border-2 border-slate-100 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all text-left overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-slate-900">
                      <Lock size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
                        <Lock size={32} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-slate-900">Secure Encode</h3>
                        <p className="text-slate-500 mt-2 font-medium">Encrypt and hide data</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    variants={{
                      initial: { opacity: 0, scale: 0.9 },
                      animate: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('decode')}
                    className="group relative p-10 bg-white rounded-[2.5rem] border-2 border-slate-100 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all text-left overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-slate-900">
                      <Unlock size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="w-16 h-16 rounded-3xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 group-hover:-rotate-12 transition-transform duration-300">
                        <Unlock size={32} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-slate-900">Secure Decode</h3>
                        <p className="text-slate-500 mt-2 font-medium">Extract and decrypt data</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    variants={{
                      initial: { opacity: 0, scale: 0.9 },
                      animate: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('analyze')}
                    className="group relative p-10 bg-white rounded-[2.5rem] border-2 border-slate-100 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all text-left overflow-hidden md:col-span-2"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-slate-900">
                      <Activity size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
                        <Activity size={32} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-slate-900">Steganography Analysis</h3>
                        <p className="text-slate-500 mt-2 font-medium">Statistical bit-plane visualization & detection</p>
                      </div>
                    </div>
                  </motion.button>
                </div>

                <motion.div
                  variants={{
                    initial: { opacity: 0, x: 20 },
                    animate: { opacity: 1, x: 0 }
                  }}
                  className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black uppercase tracking-tighter">Recent Activity</h3>
                    <button 
                      onClick={() => {
                        setRecentActivity([]);
                        localStorage.removeItem('stegano_activity');
                      }}
                      className="text-[10px] font-black text-slate-300 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.type === 'encode' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {activity.imageName.includes('Audio') ? <Music size={18} /> : (activity.type === 'encode' ? <Lock size={18} /> : <Unlock size={18} />)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black truncate">{activity.imageName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                          </div>
                          <div className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${activity.type === 'encode' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
                            {activity.type}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                          <FileText size={24} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No recent activity</p>
                      </div>
                    )}
                  </div>
                </motion.div>
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
                      <div className="max-w-sm w-full px-8 space-y-8 text-center">
                        <div className="relative mx-auto w-24 h-24">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-24 h-24 border-4 border-slate-100 border-t-indigo-600 rounded-full"
                          />
                          <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 w-24 h-24 border-4 border-transparent border-b-emerald-500 rounded-full scale-75"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Shield className="text-indigo-600" size={28} />
                            </motion.div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <motion.h3 
                            key={processingStep}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-lg font-black tracking-tight text-slate-900"
                          >
                            {processingStep}
                          </motion.h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {mode === 'encode' ? 'Security Protocol Active' : mode === 'decode' ? 'Decryption Sequence' : 'Scanning Pixels'}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${processingProgress}%` }}
                              className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                            />
                          </div>
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
                          {['all', 'red', 'green', 'blue'].map((ch) => (
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
                        </div>
                        <div className="space-y-4">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Encoded Result</p>
                          <div className="aspect-video rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
                            <img src={resultImage} className="w-full h-full object-contain" alt="Encoded" />
                          </div>
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
