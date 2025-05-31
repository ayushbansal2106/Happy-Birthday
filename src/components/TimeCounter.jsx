import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const calculateTimeDifference = (startDate) => {
    const now = new Date()
    const start = new Date(startDate)

    let years = now.getFullYear() - start.getFullYear()
    let months = now.getMonth() - start.getMonth()
    let days = now.getDate() - start.getDate()

    if (days < 0) {
        months--
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
    }
    if (months < 0) {
        years--
        months += 12
    }

    return { years, months, days }
}

const TimeUnit = ({ value, unit }) => (
    <motion.div
        className="flex flex-col items-center bg-white bg-opacity-70 rounded-lg p-2 shadow-md w-20"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <span className="text-2xl font-bold text-pink-600 relative z-10">{value}</span>
        <span className="text-xs text-purple-600 relative z-10">{unit}</span>
    </motion.div>
)

export const TimeCounter = ({ startDate, label }) => {
    const [time, setTime] = useState(calculateTimeDifference(startDate))

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(calculateTimeDifference(startDate))
        }, 1000)

        return () => clearInterval(timer)
    }, [startDate])

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">{label}</h3>
            <div className="flex justify-center space-x-2">
                <TimeUnit value={time.years} unit={time.years === 1 ? "Year" : "Years"} />
                <TimeUnit value={time.months} unit={time.months === 1 ? "Month" : "Months"} />
                <TimeUnit value={time.days} unit={time.days === 1 ? "Day" : "Days"} />
            </div>
        </div>
    )
}

