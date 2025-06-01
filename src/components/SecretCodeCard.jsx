import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react';

export default function SecretCodeCard({ onCorrect }) {
    const [code, setCode] = useState('')
    const [error, setError] = useState("")
    const [chances, setChances] = useState(3)
    const [totalPunches, setTotalPunches] = useState(0)
    const [showPunishment, setShowPunishment] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const emojiAnimationVariants = {
        animate: {
            y: [0, -7, 0],
            scale: [1, 1.1, 1],
            rotate: [-5, 5, -5],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (code.toLowerCase() === 'pookie') {
            onCorrect(totalPunches)
        } else {
            const newChances = chances - 1
            if (newChances === 0) {
                setTotalPunches(prev => prev + 1)
                setShowPunishment(true)
                setTimeout(() => setShowPunishment(false), 4000)
                setChances(3)
                setError("Oops! That's not the right code. 3 chances left!")
            } else {
                setChances(newChances)
                setError(`Oops! That's not the right code. ${newChances} chances left!`)
            }
            setTimeout(() => setError(''), 4000)
        }
    }

    if (!isMounted) {
        return null
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: .400 }}
                exit={{ opacity: 0, scale: 0 }}
                className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative">
                <div className="absolute top-0 z-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        className="text-[33px]"
                        variants={emojiAnimationVariants}
                        animate="animate">
                        🔒
                    </motion.div>
                </div>
                <h2 className="text-xl font-medium text-gradient mb-4 text-center relative z-10">A little secret between us! Enter the code to unlock more love.</h2>
                <div className="text-center text-pink-500 mb-4">
                    Chances left: {chances}
                </div>
                {totalPunches > 0 && (
                    <div className="text-center text-red-500 mb-4">
                        Total Extra Punches: {totalPunches} 👊
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-4 py-2 text-center bg-pink-50 border-2 border-pink-300 rounded-full focus:outline-none focus:border-purple-400 transition-colors duration-300"
                            placeholder="Enter secret code"
                            maxLength={6}
                            required
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span>🩷</span>
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span>🩷</span>
                        </div>
                    </div>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-3 rounded-md shadow-sm"
                        >
                            {error}
                        </motion.p>
                    )}
                    {showPunishment && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm text-center font-bold"
                        >
                            Punishment: +1 punch 👊
                        </motion.p>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 shadow-btn rounded-full hover:bg-[#995db1]"
                    >
                        Unlock
                    </motion.button>
                </form>
            </motion.div>
        </AnimatePresence>
    )
}