"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";
import Cards from "@/components/Cards";
import FallingHearts from "@/components/FallingHearts";
import BackgroundMusic from "@/components/BackgroundMusic";
import MainContent from "@/components/MainContent";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [showMainContent, setShowMainContent] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false);

  const handleShowMainContent = () => {
    setShowOverlay(true); // Start showing the overlay
    setTimeout(() => {
      setShowMainContent(true); // Switch to main content after overlay
      setShowOverlay(false); // Hide the overlay after transition
    }, 2000); // Match duration of overlay animation
  };

  if (loading) return <Loader key="loader" onFinish={() => setLoading(false)} />;

  return (
    <AnimatePresence>
      <FallingHearts key='falling-stars' />
      {/* You can use a background song if you want, just uncomment this component and and update the BackgroundMusic Component with any other other song */}
      {/* <BackgroundMusic key='bg-music' isMusicPlaying={isMusicPlaying} setIsMusicPlaying={setIsMusicPlaying} /> */}
      {showMainContent ?
        <MainContent /> :
        <Cards setMusicPlaying={setIsMusicPlaying} handleShowMainContent={handleShowMainContent} />
      }

      {/* Black overlay for transition */}
      {showOverlay && (
        <motion.div
          key="black-overlay"
          className="fixed inset-0 bg-black z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  );
}
