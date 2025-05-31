import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function QuestionCard({ emoji, question, onAnswer, showButtons = true, btnText }) {

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
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: .400 }}
                exit={{ opacity: 0, scale: 0 }}
                className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative"
            >
                <div className="absolute top-0 z-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        className="text-[33px]"
                        variants={emojiAnimationVariants}
                        animate="animate"
                    >
                        {emoji}
                    </motion.div>
                </div>
                <h2 className="text-xl font-medium text-gradient mb-4 text-center relative z-10">{question}</h2>
                <div className="flex justify-center space-x-4
            ">
                    {showButtons ? (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onAnswer(true)}
                                className="bg-[#A569BD] font-medium text-white px-6 py-2 shadow-btn rounded-full hover:bg-[#995db1]"
                            >
                                Yesss
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onAnswer(false)}
                                className="bg-[#957DAD] font-medium text-white px-6 py-2 rounded-full hover:bg-[#9c88b1]"
                            >
                                Nooo
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onAnswer}
                            className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 shadow-btn rounded-full hover:bg-[#995db1]"
                        >
                            {btnText}
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}