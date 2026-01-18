import React, { useRef, useEffect, useState } from 'react';

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (imageSrc: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => {
            stopCamera();
        };
    }, [isOpen]);

    const startCamera = async () => {
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err: any) {
            console.error("Camera access error:", err);
            setError("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw current frame
            const context = canvas.getContext('2d');
            if (context) {
                // Flip horizontally if it's the user facing camera (mirror effect)
                // context.translate(canvas.width, 0);
                // context.scale(-1, 1);
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageSrc = canvas.toDataURL('image/png');
                onCapture(imageSrc);
                onClose();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl overflow-hidden w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 bg-black text-white flex justify-between items-center shrink-0">
                    <h3 className="font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">photo_camera</span>
                        Camera Capture
                    </h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="relative bg-black flex-1 flex items-center justify-center overflow-hidden">
                    {error ? (
                        <div className="text-center p-8 text-red-400">
                            <span className="material-symbols-outlined text-4xl mb-2">videocam_off</span>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    )}

                    {/* Hidden canvas for capture */}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="p-6 bg-gray-900 border-t border-gray-800 shrink-0 flex justify-center pb-8">
                    <button
                        onClick={handleCapture}
                        disabled={!!error}
                        className="h-16 w-16 rounded-full border-4 border-white flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
                    >
                        <div className="h-12 w-12 bg-white rounded-full group-hover:scale-90 transition-transform"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};
