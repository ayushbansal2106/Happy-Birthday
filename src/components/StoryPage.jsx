import { motion } from 'framer-motion'

const StoryPage = ({ children, backgroundColor }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className={`w-full h-full p-8 rounded-3xl flex flex-col shadow-question-card ${backgroundColor} relative overflow-hidden`}
    >
        {children}
    </motion.div>
)

export default StoryPage

