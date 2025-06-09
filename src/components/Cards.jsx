import React, { useEffect, useState, useRef, useCallback } from 'react'
import QuestionCard from './QuestionCard';
import Confetti from 'react-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import SecretCodeCard from './SecretCodeCard';

import BirthdayLoader from './BirthdayLoader.jsx'
import Countdown from './countdown.jsx'
import BirthdayCelebration from './birthday-celebration.jsx'
import FloatingHearts from './floating-hearts.jsx'
import ConfettiComponent from './confetti.jsx'
import MainContent from './MainContent.jsx'

export default function Cards({ setMusicPlaying, handleShowMainContent }) {
    const [cardState, setCardState] = useState("initial");
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const [showConfetti, setShowConfetti] = useState(false)
    const [countdownEnded, setCountdownEnded] = useState(false)
    const [showBirthdayLoader, setShowBirthdayLoader] = useState(true)
    const countdownEndedRef = useRef(false)
    const [totalPunches, setTotalPunches] = useState(0)
    const [isMounted, setIsMounted] = useState(false)

    // Function to go back to "Can you be mine forever" card
    const goToMainQuestion = () => setCardState("mainQuestion");

    // Handler when countdown ends
    const handleCountdownEnd = useCallback(() => {
        if (!countdownEndedRef.current) {
            countdownEndedRef.current = true
            setCountdownEnded(true)
        }
    }, [])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (countdownEnded) {
            setCardState("secretCode")
        }
    }, [countdownEnded])

    // Reset showBirthdayLoader and countdownEnded when entering birthdayCelebration state
    useEffect(() => {
        if (cardState === "birthdayCelebration") {
            setCountdownEnded(false)
            countdownEndedRef.current = false
            setShowBirthdayLoader(true)
        }
    }, [cardState])

    useEffect(() => {
        if (!isMounted) return;

        const updateWindowSize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }
        updateWindowSize()
        window.addEventListener('resize', updateWindowSize)
        return () => window.removeEventListener('resize', updateWindowSize)
    }, [isMounted])

    // Handler when birthday loader finishes
    const handleLoaderFinish = () => {
        console.log("Loader finished");
        setShowBirthdayLoader(false)
    }

    const handleSecretCodeCorrect = (totalPunches) => {
        setCardState("mainContent")
        setTotalPunches(totalPunches)
    }

    if (!isMounted) {
        return null; // Return null on server-side and first render
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="min-h-screen flex items-center justify-center p-4"
                suppressHydrationWarning>
                {/* Conditionally render cards based on the state */}
                {cardState === "initial" && (
                    <QuestionCard
                        key="initial-card"
                        emoji="💖"
                        question="At first, I want to ask you something before we go ahead..."
                        showButtons={false}
                        btnText="Click here to know"
                        onAnswer={() => {
                            setCardState("mainQuestion")
                            setMusicPlaying(true)
                        }}
                    />
                )}

                {cardState === "mainQuestion" && (
                    <QuestionCard
                        key="main-question"
                        emoji="🥰"
                        question="Will you be my Sister forever?"
                        onAnswer={(answer) => {
                            if (answer) {
                                setCardState("birthdayCelebration")
                                setShowConfetti(true)
                            }
                            else setCardState("areYouSure");
                        }}
                    />
                )}

                {cardState === "birthdayCelebration" && (
                    <>
                        {showBirthdayLoader ? (
                            <BirthdayLoader onFinish={handleLoaderFinish} />
                        ) : !countdownEnded ? (
                            <>
                                <Countdown targetDate={new Date('2024-06-09T03:30:00.000Z')} onCountdownEnd={handleCountdownEnd} />
                                <BirthdayCelebration />
                                <FloatingHearts />
                                <ConfettiComponent />
                            </>
                        ) : null}
                    </>
                )}

                {cardState === "yesResponse" && (
                    <QuestionCard
                        key="yes-response"
                        emoji="🩷"
                        question="Yesss! You always make my heart smile! I'm so lucky to have you in my life."
                        showButtons={false}
                        btnText="More love ahead"
                        onAnswer={() => setCardState("secretCode")}
                    />
                )}

                {cardState === "secretCode" && <SecretCodeCard onCorrect={handleSecretCodeCorrect} />}

                {cardState === "areYouSure" && (
                    <QuestionCard
                        key="are-you-sure"
                        emoji="🙃"
                        question="Are you sure?"
                        onAnswer={(answer) => {
                            if (answer) setCardState("finalNoResponse");
                            else goToMainQuestion();
                        }}
                    />
                )}

                {cardState === "finalNoResponse" && (
                    <QuestionCard
                        key="final-no-response"
                        emoji="🥺"
                        question="Oh no! You can't really say no to this! You're already mine. Go back and make the right choice!"
                        showButtons={false}
                        btnText="Go back"
                        onAnswer={goToMainQuestion}
                    />
                )}

                {cardState === "mainContent" && <MainContent initialPunches={totalPunches} />}

                {showConfetti && isMounted &&
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        numberOfPieces={500}
                        recycle={false}
                        colors={['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493', '#DB7093', '#C71585']}
                        confettiSource={{
                            x: windowSize.width / 2,
                            y: windowSize.height / 2,
                            w: 0,
                            h: 0
                        }}
                        initialVelocityX={{ min: -7, max: 7 }}
                        initialVelocityY={{ min: -7, max: 7 }}
                        gravity={0.015}
                        tweenDuration={4000}
                    />}
            </motion.div>
        </AnimatePresence>
    )
}
