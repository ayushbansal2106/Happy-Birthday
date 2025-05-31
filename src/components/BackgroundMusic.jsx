import { Volume2, VolumeX } from "lucide-react";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function BackgroundMusic({ isMusicPlaying, setIsMusicPlaying }) {
    const audioRef = useRef(null);

    useEffect(() => {
        // Set default volume and autoplay on load
        if (audioRef.current) {
            audioRef.current.volume = .5; // Set volume
        }
        if (isMusicPlaying) {
            audioRef.current.play()
        }
    }, [isMusicPlaying]);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsMusicPlaying(!isMusicPlaying);
        }
    };

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: .400 }}
            className="fixed top-4 right-4 z-50">
            {/* If you want to add background song then place the song in /public/audio folder and change the audio src accordingly */}
            <audio ref={audioRef} loop preload="auto">
                <source src="/audio/instrumental.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <button
                onClick={toggleMusic}
                className="bg-pink-400 text-white p-3 rounded-full shadow-lg focus:outline-none hover:bg-pink-500 transition-all"
            >
                {isMusicPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
        </motion.div>
    );
}
