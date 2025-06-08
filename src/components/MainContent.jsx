'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, HeartIcon, X } from 'lucide-react'
import StoryPage from './StoryPage'
import { TimeCounter } from './TimeCounter'
import { FlipWords } from './ui/flip-words'
import Confetti from 'react-confetti'

// Add this CSS at the top of the file after the existing styles
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(216, 180, 254, 0.3);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(147, 51, 234, 0.5);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(147, 51, 234, 0.7);
  }
`;

export default function MainContent({ initialPunches = 0 }) {
  // State Management
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [chances, setChances] = useState(3)
  const [totalPunches, setTotalPunches] = useState(initialPunches)
  const [showPunishment, setShowPunishment] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiOpacity, setConfettiOpacity] = useState(1)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined') {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)
    return () => window.removeEventListener('resize', updateWindowSize)
    }
  }, [])

  // Treasure Hunt: define gift codes for each gift stage.
  const giftCodes = ["Santosh Stationery Shop", "Classroom", "kamal", "Creative Food", "staff room", "GD room", "Ayush", "Disha", "Quality tuck", "Satyam"]

  // Updated: Determine if we are within treasure hunt sequence (pages 5 to 24)
  const treasureStart = 5;
  const treasureEnd = 24; // inclusive, last gift page
  const isTreasureStage = currentPage >= treasureStart && currentPage <= treasureEnd;
  const isCodePage = isTreasureStage && (currentPage - treasureStart) % 2 === 0;
  const isGiftPage = isTreasureStage && (currentPage - treasureStart) % 2 === 1;

  // Handling code submission on Code pages
  const handleSubmit = (e) => {
    e.preventDefault()
    // For code page at index 5, gift index = 0; at 7, gift index = 1; etc.
    let giftIndex = (currentPage - 5) / 2
    if (code.toLowerCase() === giftCodes[giftIndex].toLowerCase()) {
      // Show confetti animation
      setShowConfetti(true)
      setConfettiOpacity(1)
      
      // Start fading out after 2 seconds
      setTimeout(() => {
        setConfettiOpacity(0)
        // Remove confetti from DOM after fade out completes
        setTimeout(() => setShowConfetti(false), 2000)
      }, 2000)

      // Correct code: navigate to corresponding gift page
      setCurrentPage(currentPage + 1)
      setCode('')
      setError("🎉 Gift Unlocked!")
      setTimeout(() => setError(''), 3000)
      // Reset chances for next gift
      setChances(3)
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
    // Only render a loading spinner or nothing until mounted
    return null
  }

  // Pages array
  const pages = [
    // 0: Cover Page
    <StoryPage key="cover" backgroundColor="bg-gradient-to-br from-rose-200 to-purple-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-44 h-44 mb-8 rounded-full overflow-hidden shadow-md"
        >
          <Image
            src="https://images.pexels.com/photos/371285/pexels-photo-371285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Heart icon"
            priority={true}
            width={176}
            height={176}
            className="object-cover w-full h-full"
          />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4 relative z-10">
          Our Special Story
        </h1>
        <div className="text-2xl md:text-3xl text-purple-700 mb-8 relative z-10">
          Hey Cutieee, you are<br />
          my <FlipWords words={['Sister', 'Best Friend', 'Supporter', 'Mother', 'World']} className="text-nowrap" />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-pink-500 text-white px-6 py-3 rounded-full text-lg shadow-btn hover:bg-pink-600 transition-colors duration-300"
          onClick={() => setCurrentPage(1)}
        >
          Open Our Story
        </motion.button>
      </div>
    </StoryPage>,

    // 1: Journey Page
    <StoryPage key="journey" backgroundColor="bg-gradient-to-br from-blue-200 to-green-200">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 relative z-10">Our Journey</h2>
      <div className="space-y-4 flex-1 overflow-y-auto overflow-x-hidden rounded-xl custom-scrollbar">
        {[
          { date: '17 Septemper, 2024', event: 'Our Journey Began', emoji: '❤️' },
          { date: '24 September, 2024', event: 'First Message', emoji: '💬' },
          { date: '28 September, 2024', event: 'You sent Instagram Request', emoji: '📱' },
          { date: '04 October, 2024', event: 'First Fight & Patch-up', emoji: '🥷' },
          { date: '05 October, 2024', event: 'First Secret Revealed', emoji: '🤫' },
          { date: '18 Feburary, 2025', event: 'First Trip Together', emoji: '✈️' },
          { date: '06 March, 2025', event: 'Your First Bite', emoji: '😁' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-md"
          >
            <span className="text-3xl">{item.emoji}</span>
            <div className="relative z-10">
              <p className="font-medium text-gray-800">{item.event}</p>
              <p className="text-sm text-gray-500">{item.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </StoryPage>,

    // 2: Time Together Page
    <StoryPage key="time" backgroundColor="bg-gradient-to-br from-pink-200 to-purple-200">
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6 relative z-10">Our Time Together</h2>
        <div className="w-full max-w-md space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <TimeCounter startDate="2024-09-17" label="As Friends" />
          </motion.div>
        </div>
        <motion.div className="mt-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <HeartIcon className="w-16 h-16 text-rose-500 mx-auto" />
        </motion.div>
        <motion.p className="text-lg md:text-xl text-blue-600 mt-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          Every moment with you is a treasure!
        </motion.p>
      </div>
    </StoryPage>,

    // 3: Gallery Page
    <StoryPage key="gallery" backgroundColor="bg-gradient-to-br from-blue-50 to-cyan-100">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">Memorable Moments</h2>
      <div className="flex-1 rounded-2xl overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-2xl">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-md cursor-pointer"
              onClick={() => setSelectedImage(i)}
            >
              <Image
                src={`/images/${i}.jpg`}
                alt={`Gallery image ${i}`}
                width={300}
                height={200}
                className="rounded-2xl object-cover h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </StoryPage>,

    // 4: Letter Page
    <StoryPage key="letter" backgroundColor="bg-gradient-to-br from-blue-200 to-gray-200">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">A Special Message</h2>
      <div className="bg-white rounded-xl p-6 shadow-md overflow-y-auto flex-1 custom-scrollbar">
        <div className="text-gray-700 text-lg leading-relaxed mb-4">
            <p>Humari dosti ko bohot Kam time hua hai, lekin humne kafi jaldi ek dusre ki VIBE match kr li hai. Jab tum nahi hoti na, toh kuch bhi accha nahi lagta. Tujhe kisi ka bhi thoda bhi khush hona, bohot saari Khushi deta hai, aur kisi ka bhi Zara sa bhi rooth jana, Toh turant sorry ka pahad lekar pohoch jati hai aur saath mai extra pyar bhi dikhati hai, Tu na sabki baatein sunti hai, sabki pareshaniya bhi sunti hai, lekin kisi ko bhi apni pareshaniya nahi batati. But you are an inspiration for ME, mujhe tere jaisa independent bnna hai. Jese tune saari mushkilo mai bhi bina hile khadi reheti hai, bss I feel yehi baat mujhe tere baare mai sabse jayada inspire krti hai. <br />
            "Even if you forget me someday after the collage, I want to see you as the world's successful person." <br /><br />

            You are my bestie, aur dil se yaar tujhe mai bohot bohot bohot jayada vala pyar krta hun(as a sister), har baar bayan nahi kar pata mai tujhe, mere ghar pe mera chota bhai hai, lekin yha tu meri badi bhn bhi hai aur chota bhai bhi hai, meri best friend bhi hai, kyuki hum log sab family se itna Durr hai, toh tu abhi meri sab kuch ho gyi hai mujhe esa lgta hai, aur mai chahata hun ki duniya ke har ek shaks ko aisi dost mile. <br /><br />

            Chand kahu toh chup jaoge,<br />
            Gulab kahu toh bikhar jaoge,<br />
            Khwab kahu toh Tut jaoge,<br />
            Chalo apka name zindagi rakh dun,<br />
            Maut se pehele chor toh nahi paoge. <br /><br />

            You were: <br />
            1. A person who makes me laugh in my bad as well as good times. <br />
            2. A person who slaps me, if I do something wrong but can't tolerate the tears in my eyes. <br />
            3. A person who was just a one call away.<br />
            4. A person who says 'I hate you" but  loves me more than you hates me.<br />
            5. A person who supports my dreams, who respects my parents and makes me strong enough to love myself.<br />
            6.Someone to whom 'I' matters a lot, to whom my presence is much more important and the one who will never ever replace me.<br /><br />

            Words cannot define how important you are to me and how much I like being with you. Your presence makes me feel so calm and relaxed ki mai apni life ke saare dukh dard tensions pta nhi kese bhul jata hun, jab tu saath ho pta nhi tab kuch aur ku nhi kr pata hu. Saari baate tujhse he krne ka dil krta h, gussa bhi tujhi pe aata h, pyaar bhi. Ab esa ho gya hai ki tere bina life imagine krte hue bhi drr sa lgta h. I still remember that day when we first talked, became good friends then formed the unbreakable bond of brother and sister and after that life has been totally different ever since. I wish this bond between us never breaks and keeps growing over time. <br />
            Meri life ki sabse mtlb sabseeeee badi achievement h TUJHSE MILNA AUR YEH BOND FORM KRNA, aur jimmedari iss BOND KO TUTNE NHI DENA. 🥰💖❤💗💓💞❣💝<br /><br />

            ek bahan hai meri jisse mera khoon ka rishta nahin hai par sage se jyada dil ka rishta hai vo mere ek parivaar ka hissa hai vo meri dost, bahan, hamadard sab kuchh hai vo mujhe sagee bahan se jyada pyaar karati hai main bhi usko apne parivaar jaisa maanta hun har ek chhoti baaton ko use batata hoo vo meri har ek baat ko samajh jati hai. Mere dukhon me kadam se kadam milati hai, gale lagaakar sab samajhti hai uske saath apna sa lagata hai ek pal baat na ho man bechain sa ho jaata hai vo mere lie apni har ek khushi kurbaan karati hai dosti me ameeri gareebi dikhaava se jayada dil se nibhate hai har samay madad karane ko taiyaar rahati hai. Apni kamyabi se jyada meri kamyabi chahati hai vo khud se jayada mera khayaal rakhati hai aisee bahan mujhe har janm mile khoon ka rishta nahin par dil ka rishta bahut gahara hai sabaka yahi kahana hai ek hajaaron me meree bahana hai. Uski ek smile se pta nhi mere man ko kitni Khushi milti h, uske ek hug se pura din acha ho jata h, use nhi pta ki uske saath time bitana l, masti Krna yeh sab meri saari purani tension bhi Durr krta h. Bs abb yeh iccha h ki kabhi yeh bond nhi tute.<br /><br />

            Mai tujhe keheta moon hu but you are my sun 🌞, <br />
            Because moon is overrated. You are not cold like moon but have the warmth of sun. You don't have possess scars, <br />but lighten up my world. I find myself in your presence what else could I desire. I am blessed to have you in my life,<br /> My mini mother and a mean monster.<br /><br />

            Aankho ki chamak, Palkon ki shaan ho tum<br />
            Chehre ki hasi, lamho ki muskaan ho tum<br />
            Dhadakta hai dil bas tumhari arzoo mai<br />
            Fir kaise na kahu meri jaan ho tum.<br /><br />

            Meri behen tu mere dil ka tukda hai, tu meri jaan, shaan, baan, himmat, sahara hai tu, meri dost bhai sab hai tuu. Tujhe duniya ki saari khushiyan mile, tujhe meri bhi umar lag jaye. Tu mere liye bohot khaas h, tu Mere dil ke sabse pass hai. Tumhare saath rehekar bachpan yaad aa jata hai, masti mazak sab sab bda he maza aata hai. Lagna jhagadna sab yaadgaar ban jata hai. Meri behen tu humesha mere saath rehena, tujhe koi takleef ho toh sabse pehele mujhe kehena, tere liye mai kuch bhi kar sakta hun. Tu meri maa, baccha, bhai duniya, jahan, sab hai. Tumse he mere saare rishtey hai, mai humesha duaa krta hun ki tu mujhse aage badhe, tujhe bohot kaamyaabi safalta mile, tujhe jaisi behen mujhe humesha mile, itna aapna pyar sirf tujhe hai meri behen.<br /><br />

            Tujhe kabhi btaya nhi par tu himmat hai meri, har kamzori se ladne ki takat hai tu meri, tere saath sabkuch aasan sa lgta h tere bina zindagi ko sochna bhi mushkil lgta h<br /><br />

            Teri dosti ki chahat pe naaz h mujhe,<br />
            Teri har ek baat pe etbaar h mujhe,<br />
            Rahe teri muskurahat humesha chere par,<br />
            Kyuki Teri muskurahat se pyar hai mujhe.<br /><br />

            Tum meri life mai bohot unexpectedly aaye aur meri life ke most precious person ban gye, mujhe koi idea nhi tha ki aap itne important ban jaoge mere liye, words kam pad jayenge tumhari importance explain krne mai,
            Bas tum humesha mere saath rehena 🥹❤😉<br /><br />

            I am an overthinker, I overthink everything, if you are close to me then please remember it won't be easy to deal with me. If you don't talk to me I will overthink, if you behave differently with me rather like you normally behave, I will overthink, if you don't talk to me I will just overthink that I have done something wrong or you are angry with me or you don't care about me. I know it's not easy to deal with me & I have lost people who said they will be with forever, I love too much, I care too much, I cry too much, I give too much to people because I overthink like what if I am not perfect or someone replaces me, I have fear of losing and being left alone even after giving my best, so if you know me & if I ask you alot of questions, it's not because I doubt you, its because I just can't stop Overthinking little things, just deal with it when you say " You are my best friend or you love me, I am counting on you" 🙃🩷<br /><br />

            I got attached to you so easily. Attracted to you in ways I cant explain .I care about you more than you realize.I appreciated you more than you will ever know. No words are powerful enough to describe how you make me feel. You are the first and the last thing on my mind every day.<br /><br />

            I love you so much baccha ji  ❤, and I am always there for you.</p>
        </div>
        <p className="text-right text-rose-600 font-semibold">
          Forever yours Bhai,<br />
          Ayush (Gadha)❤️
        </p>
      </div>
    </StoryPage>,

    // Treasure Hunt Sequence Starts Here

    // 5: Code Page for Gift 1
    <StoryPage key="code-1" backgroundColor="bg-gray-50">
      <div className="text-center text-pink-500 mb-4" suppressHydrationWarning>
        Chances left: {chances}
      </div>
      {totalPunches > 0 && (
        <div className="text-center text-red-500 mb-4" suppressHydrationWarning>
          Total Extra Punches: {totalPunches} 👊
        </div>
      )}
      {showPunishment && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm text-center font-bold"
          suppressHydrationWarning
        >
          Punishment: +1 punch 👊
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative mx-auto"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="text-[33px]"
            animate={{ y: [0, -7, 0], scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🔒
          </motion.div>
        </div>
        <h2 className="text-xl font-medium text-gradient mb-4 text-center">Enter the code for Gift 1</h2>
        <div className="mb-6 p-4 bg-pink-50 rounded-xl border-2 border-pink-200">
          <h3 className="text-lg font-semibold text-pink-700 mb-2">Puzzle Time! 🧩</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            <p className="text-gray-700 text-sm leading-relaxed">
            Where books and pens are in a row, <br />
            And all your study needs will show. <br />
            A name that means peace and joy so sweet, <br />
            That's where your gift and you shall meet. <br />
            Where is it?
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="w-full pl-12 pr-12 py-2 text-lg border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 bg-white/80 backdrop-blur-sm"
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-3 rounded-md shadow-sm"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 rounded-full shadow-btn hover:bg-[#995db1]"
          >
            Unlock Gift 1
          </motion.button>
        </form>
      </motion.div>
    </StoryPage>,

    // 6: Gift 1 Page
    <StoryPage key="gift-1" backgroundColor="bg-gradient-to-br from-purple-200 to-pink-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-purple-600 mb-6">Gift 1 Unlocked! 🎁</h2>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-64 h-64 relative mb-8">
          <Image
            src="/gifts/gift-1.jpg"
            alt="Gift 1"
            width={256}
            height={256}
            className="rounded-xl shadow-xl object-cover"
          />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -right-4 text-4xl">
            🎉
          </motion.div>
        </motion.div>
      </div>
    </StoryPage>,

    // 7: Code Page for Gift 2
    <StoryPage key="code-2" backgroundColor="bg-gray-50">
      <div className="text-center text-pink-500 mb-4" suppressHydrationWarning>
        Chances left: {chances}
      </div>
      {totalPunches > 0 && (
        <div className="text-center text-red-500 mb-4" suppressHydrationWarning>
          Total Extra Punches: {totalPunches} 👊
        </div>
      )}
      {showPunishment && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm text-center font-bold"
          suppressHydrationWarning
        >
          Punishment: +1 punch 👊
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative mx-auto"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="text-[33px]"
            animate={{ y: [0, -7, 0], scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🔒
          </motion.div>
        </div>
        <h2 className="text-xl font-medium text-gradient mb-4 text-center">Enter the code for Gift 2</h2>
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Puzzle Time! 🧩</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            <p className="text-gray-700 text-sm leading-relaxed">
              मैं ऐसी जगह हूँ जहाँ लोग चुपचाप बैठते हैं,<br />
              पर मन ही मन शतरंज की बिसात बिछाते हैं।<br />
              मैं ना मंदिर हूँ, ना जेल,<br />
              फिर भी हर रोज़ घंटी से मेरा खेल।<br />
              कुछ आते हैं टाइम पे, कुछ भागते हुए,<br />
              फिर भी कहते हैं — "Sir, बस आज ही लेट हो गया हूँ!" 😅<br />
              अब बताओ मेरा नाम —<br />
              मैं वो जगह हूँ जहाँ दिमाग कम और बहाने ज़्यादा चलते हैं!
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="w-full pl-12 pr-12 py-2 text-lg border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 bg-white/80 backdrop-blur-sm"
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-3 rounded-md shadow-sm"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 rounded-full shadow-btn hover:bg-[#995db1]"
          >
            Unlock Gift 2
          </motion.button>
        </form>
      </motion.div>
    </StoryPage>,

    // 8: Gift 2 Page
    <StoryPage key="gift-2" backgroundColor="bg-gradient-to-br from-green-200 to-blue-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-green-600 mb-6">Gift 2 Unlocked! 🎁</h2>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-64 h-64 relative mb-8">
          <Image
            src="/gifts/gift-2.jpg"
            alt="Gift 2"
            width={256}
            height={256}
            className="rounded-xl shadow-xl object-cover"
          />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -right-4 text-4xl">
            🎊
          </motion.div>
        </motion.div>
      </div>
    </StoryPage>,

    // 9: Code Page for Gift 3
    <StoryPage key="code-3" backgroundColor="bg-gray-50">
      <div className="text-center text-pink-500 mb-4" suppressHydrationWarning>
        Chances left: {chances}
      </div>
      {totalPunches > 0 && (
        <div className="text-center text-red-500 mb-4" suppressHydrationWarning>
          Total Extra Punches: {totalPunches} 👊
        </div>
      )}
      {showPunishment && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm text-center font-bold"
          suppressHydrationWarning
        >
          Punishment: +1 punch 👊
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative mx-auto"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="text-[33px]"
            animate={{ y: [0, -7, 0], scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🔒
          </motion.div>
        </div>
        <h2 className="text-xl font-medium text-gradient mb-4 text-center">Enter the code for Gift 3</h2>
        <div className="mb-6 p-4 bg-green-50 rounded-xl border-2 border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Puzzle Time! 🧩</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            <p className="text-gray-700 text-sm leading-relaxed">
            apne bholepan se sbka dil jitu,<br />
            Apni shanti se sab jeet jaaun.<br />
            Thoda sa funny, thoda normal,<br />
            Phir bhi sab bolein "yeh hai ___!"<br />
            Kaun hai yeh banda laajawaab?
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="w-full pl-12 pr-12 py-2 text-lg border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 bg-white/80 backdrop-blur-sm"
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-3 rounded-md shadow-sm"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 rounded-full shadow-btn hover:bg-[#995db1]"
          >
            Unlock Gift 3
          </motion.button>
        </form>
      </motion.div>
    </StoryPage>,

    // 10: Gift 3 Page
    <StoryPage key="gift-3" backgroundColor="bg-gradient-to-br from-orange-200 to-red-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-orange-600 mb-6">Gift 3 Unlocked! 🎁 <br /> --By Nali ka Keeda</h2>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-64 h-64 relative mb-8">
          <Image
            src="/gifts/gift-3.jpg"
            alt="Gift 3"
            width={256}
            height={256}
            className="rounded-xl shadow-xl object-cover"
          />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -right-4 text-4xl">
            🎈
          </motion.div>
        </motion.div>
      </div>
    </StoryPage>,

    // 11: Code Page for Gift 4
    <StoryPage key="code-4" backgroundColor="bg-gray-50">
      <div className="text-center text-pink-500 mb-4" suppressHydrationWarning>
        Chances left: {chances}
      </div>
      {totalPunches > 0 && (
        <div className="text-center text-red-500 mb-4" suppressHydrationWarning>
          Total Extra Punches: {totalPunches} 👊
        </div>
      )}
      {showPunishment && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm text-center font-bold"
          suppressHydrationWarning
        >
          Punishment: +1 punch 👊
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative mx-auto"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="text-[33px]"
            animate={{ y: [0, -7, 0], scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🔒
          </motion.div>
        </div>
        <h2 className="text-xl font-medium text-gradient mb-4 text-center">Enter the code for Gift 4</h2>
        <div className="mb-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">Puzzle Time! 🧩</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            <p className="text-gray-700 text-sm leading-relaxed">
              Some say "yum!" with a happy cheer,<br />
              But she walks off — won't come near.<br />
              Where cheesy bullets take the lead,<br />
              But not the snack she wants or needs...<br />
              There lies your gift — go take a peek,<br />
              At the shop that's savory, not sweet!
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="w-full pl-12 pr-12 py-2 text-lg border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 bg-white/80 backdrop-blur-sm"
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-3 rounded-md shadow-sm"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 rounded-full shadow-btn hover:bg-[#995db1]"
          >
            Unlock Gift 4
          </motion.button>
        </form>
      </motion.div>
    </StoryPage>,

    // 12: Gift 4 Page
    <StoryPage key="gift-4" backgroundColor="bg-gradient-to-br from-teal-200 to-cyan-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-teal-600 mb-6">Gift 4 Unlocked! 🎁</h2>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-64 h-64 relative mb-8">
          <Image
            src="/gifts/gift-4.jpg"
            alt="Gift 4"
            width={256}
            height={256}
            className="rounded-xl shadow-xl object-cover"
          />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -right-4 text-4xl">
            💝
          </motion.div>
        </motion.div>
      </div>
    </StoryPage>,

    // 13: Code Page for Gift 5
    <StoryPage key="code-5" backgroundColor="bg-gray-50">
      <div className="text-center text-pink-500 mb-4" suppressHydrationWarning>
        Chances left: {chances}
      </div>
      {totalPunches > 0 && (
        <div className="text-center text-red-500 mb-4" suppressHydrationWarning>
          Total Extra Punches: {totalPunches} 👊
        </div>
      )}
      {showPunishment && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm text-center font-bold"
          suppressHydrationWarning
        >
          Punishment: +1 punch 👊
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative mx-auto"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="text-[33px]"
            animate={{ y: [0, -7, 0], scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🔒
          </motion.div>
        </div>
        <h2 className="text-xl font-medium text-gradient mb-4 text-center">Enter the code for Gift 5</h2>
        <div className="mb-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Puzzle Time! 🧩</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            <p className="text-gray-700 text-sm leading-relaxed">
            ना घंटी बजती है,<br />
            ना कोई खड़ा होता है।<br />
            ना Roll Number से पुकारा जाता है,<br />
            ना कोई Answer देता है।<br />
            पर अंदर हलचल बहुत होती है,<br />
            कभी चाय, कभी कॉपी-किताबों की बात होती है।<br />
            अब बताओ उस जगह का नाम,<br />
            जहाँ बच्चों का जाना होता है "Exams के बाद का इनाम"?
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="w-full pl-12 pr-12 py-2 text-lg border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 bg-white/80 backdrop-blur-sm"
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-3 rounded-md shadow-sm"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 rounded-full shadow-btn hover:bg-[#995db1]"
          >
            Unlock Gift 5
          </motion.button>
        </form>
      </motion.div>
    </StoryPage>,

    // 14: Gift 5 Page
    <StoryPage key="gift-5" backgroundColor="bg-gradient-to-br from-indigo-200 to-violet-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-indigo-600 mb-6">Gift 5 Unlocked! 🎁</h2>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-64 h-64 relative mb-8">
          <Image
            src="/gifts/gift-5.jpg"
            alt="Gift 5"
            width={256}
            height={256}
            className="rounded-xl shadow-xl object-cover"
          />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -right-4 text-4xl">
            🌟
          </motion.div>
        </motion.div>
      </div>
    </StoryPage>,

    // 15: Code Page for Gift 6
    <StoryPage key="code-6" backgroundColor="bg-gray-50">
      <div className="text-center text-pink-500 mb-4" suppressHydrationWarning>
        Chances left: {chances}
      </div>
      {totalPunches > 0 && (
        <div className="text-center text-red-500 mb-4" suppressHydrationWarning>
          Total Extra Punches: {totalPunches} 👊
        </div>
      )}
      {showPunishment && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm text-center font-bold"
          suppressHydrationWarning
        >
          Punishment: +1 punch 👊
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative mx-auto"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="text-[33px]"
            animate={{ y: [0, -7, 0], scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🔒
          </motion.div>
        </div>
        <h2 className="text-xl font-medium text-gradient mb-4 text-center">Enter the code for Gift 6</h2>
        <div className="mb-6 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">Puzzle Time! 🧩</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            <p className="text-gray-700 text-sm leading-relaxed">
            मैं ना अदालत हूँ, ना संसद का भवन, <br />
            फिर भी यहाँ हर कोई देता है अपने विचारों का व्याख्यान। <br />
            माइक नहीं होता, पर आवाज़ें गूंजती हैं, <br />
            कभी लॉजिक, कभी इंग्लिश की तलवारें चलती हैं। <br />
            मुझे जीतने नहीं, समझाने आता है कोई, <br />
            फिर भी सबका मकसद — "Impress करो भाई!" 😎 <br />
            कभी "May I add a point?" की बौछार, <br />
            कभी "I respectfully disagree" का प्रहार। <br />
            ना कोई किताब, ना कोई बोर्ड, <br />
            फिर भी दिमाग की सबसे बड़ी होती है यहाँ होड़। <br />
            अब बताओ — मैं कौन हूँ? <br />
            जहाँ Silence एक कमजोरी और Point बनाना एक Strategy होती है!
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="w-full pl-12 pr-12 py-2 text-lg border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 bg-white/80 backdrop-blur-sm"
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-3 rounded-md shadow-sm"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 rounded-full shadow-btn hover:bg-[#995db1]"
          >
            Unlock Gift 6
          </motion.button>
        </form>
      </motion.div>
    </StoryPage>,

    // 16: Gift 6 Page
    <StoryPage key="gift-6" backgroundColor="bg-gradient-to-br from-yellow-200 to-orange-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-yellow-600 mb-6">Gift 6 Unlocked! 🎁</h2>
        </motion.div>
        <div className="w-full max-w-md h-80 bg-white/60 rounded-2xl overflow-y-auto custom-scrollbar p-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3].map((num) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * num }}
                className="relative aspect-square rounded-xl overflow-hidden shadow-md mx-auto"
              >
                <Image
                  src={`/gifts/gift-6-${num}.jpg`}
                  alt={`Gift 6-${num}`}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-4 -right-4 text-3xl"
                >
                  {num === 1 ? "🎀" : num === 2 ? "🎉" : "🎊"}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </StoryPage>,

    // 17: Code Page for Gift 7
    <StoryPage key="code-7" backgroundColor="bg-gray-50">
      <div className="text-center text-pink-500 mb-4" suppressHydrationWarning>
        Chances left: {chances}
      </div>
      {totalPunches > 0 && (
        <div className="text-center text-red-500 mb-4" suppressHydrationWarning>
          Total Extra Punches: {totalPunches} 👊
        </div>
      )}
      {showPunishment && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm text-center font-bold"
          suppressHydrationWarning
        >
          Punishment: +1 punch 👊
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative mx-auto"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="text-[33px]"
            animate={{ y: [0, -7, 0], scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🔒
          </motion.div>
        </div>
        <h2 className="text-xl font-medium text-gradient mb-4 text-center">Enter the code for Gift 7</h2>
        <div className="mb-6 p-4 bg-rose-50 rounded-xl border-2 border-rose-200">
          <h3 className="text-lg font-semibold text-rose-700 mb-2">Puzzle Time! 🧩</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            <p className="text-gray-700 text-sm leading-relaxed">
            Zindagi full energetic mode mein chalti hai is bande ke saath. <br />
            Jab bored ho jao toh isko dhoondo, ekdum power bank jaise charge kar deta hai sabko! <br />
            Naam bhi life se bhara hai. Guess karo?
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="w-full pl-12 pr-12 py-2 text-lg border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 bg-white/80 backdrop-blur-sm"
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-3 rounded-md shadow-sm"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 rounded-full shadow-btn hover:bg-[#995db1]"
          >
            Unlock Gift 7
          </motion.button>
        </form>
      </motion.div>
    </StoryPage>,

    // 18: Gift 7 Page
    <StoryPage key="gift-7" backgroundColor="bg-gradient-to-br from-purple-200 to-pink-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-purple-600 mb-6">Gift 7 Unlocked! 🎁</h2>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-64 h-64 relative mb-8">
          <Image
            src="/gifts/gift-7.avif"
            alt="Gift 7"
            width={256}
            height={256}
            className="rounded-xl shadow-xl object-cover"
          />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -right-4 text-4xl">
            💝
          </motion.div>
        </motion.div>
      </div>
    </StoryPage>,

    // 19: Code Page for Gift 8
    <StoryPage key="code-8" backgroundColor="bg-gray-50">
      <div className="text-center text-pink-500 mb-4" suppressHydrationWarning>
        Chances left: {chances}
      </div>
      {totalPunches > 0 && (
        <div className="text-center text-red-500 mb-4" suppressHydrationWarning>
          Total Extra Punches: {totalPunches} 👊
        </div>
      )}
      {showPunishment && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm text-center font-bold"
          suppressHydrationWarning
        >
          Punishment: +1 punch 👊
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative mx-auto"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="text-[33px]"
            animate={{ y: [0, -7, 0], scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🔒
          </motion.div>
        </div>
        <h2 className="text-xl font-medium text-gradient mb-4 text-center">Enter the code for Gift 8</h2>
        <div className="mb-6 p-4 bg-cyan-50 rounded-xl border-2 border-cyan-200">
          <h3 className="text-lg font-semibold text-cyan-700 mb-2">Puzzle Time! 🧩</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            <p className="text-gray-700 text-sm leading-relaxed">
            Na hoon main map, na hoon main guide, <br />
            Par fir bhi dikhau sahi side. <br />
            Raste pe ho ya zindagi ka mod, <br />
            Naam se hi milta hai proper code. <br />
            Kaun hoon main?
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="w-full pl-12 pr-12 py-2 text-lg border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 bg-white/80 backdrop-blur-sm"
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-3 rounded-md shadow-sm"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 rounded-full shadow-btn hover:bg-[#995db1]"
          >
            Unlock Gift 8
          </motion.button>
        </form>
      </motion.div>
    </StoryPage>,

    // 20: Gift 8 Page
    <StoryPage key="gift-8" backgroundColor="bg-gradient-to-br from-blue-200 to-purple-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-blue-600 mb-6">Gift 8 Unlocked! 🎁</h2>
        </motion.div>
        <div className="w-full max-w-md h-80 bg-white/60 rounded-2xl overflow-y-auto custom-scrollbar p-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * num }}
                className="relative aspect-square rounded-xl overflow-hidden shadow-md mx-auto"
              >
                <Image
                  src={`/gifts/gift-8-${num}.jpg`}
                  alt={`Gift 8-${num}`}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-4 -right-4 text-3xl"
                >
                  {num === 1 ? "🌟" : num === 2 ? "✨" : num === 3 ? "💫" : num === 4 ? "⭐" : num === 5 ? "🌠" : "💫"}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </StoryPage>,

    // 21: Code Page for Gift 9
    <StoryPage key="code-9" backgroundColor="bg-gray-50">
      <div className="text-center text-pink-500 mb-4" suppressHydrationWarning>
        Chances left: {chances}
      </div>
      {totalPunches > 0 && (
        <div className="text-center text-red-500 mb-4" suppressHydrationWarning>
          Total Extra Punches: {totalPunches} 👊
        </div>
      )}
      {showPunishment && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm text-center font-bold"
          suppressHydrationWarning
        >
          Punishment: +1 punch 👊
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative mx-auto"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="text-[33px]"
            animate={{ y: [0, -7, 0], scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🔒
          </motion.div>
        </div>
        <h2 className="text-xl font-medium text-gradient mb-4 text-center">Enter the code for Gift 9</h2>
        <div className="mb-6 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
          <h3 className="text-lg font-semibold text-emerald-700 mb-2">Puzzle Time! 🧩</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            <p className="text-gray-700 text-sm leading-relaxed">
            Chocolate teri muskaan jaisi sweet, <br />
            Aur chips jaise moment – crispy treat. <br />
            Wahi jagah jahan gifting ki thi baat, <br />
            Wahan chhupi hai ek chhoti si saugaat. <br />
            Kaun hai yeh apno wali feel?
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="w-full pl-12 pr-12 py-2 text-lg border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 bg-white/80 backdrop-blur-sm"
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-3 rounded-md shadow-sm"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 rounded-full shadow-btn hover:bg-[#995db1]"
          >
            Unlock Gift 9
          </motion.button>
        </form>
      </motion.div>
    </StoryPage>,

    // 22: Gift 9 Page
    <StoryPage key="gift-9" backgroundColor="bg-gradient-to-br from-emerald-200 to-teal-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-emerald-600 mb-6">Gift 9 Unlocked! 🎁</h2>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-64 h-64 relative mb-8">
          <Image
            src="/gifts/gift-9.jpg"
            alt="Gift 9"
            width={256}
            height={256}
            className="rounded-xl shadow-xl object-cover"
          />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -right-4 text-4xl">
            🎁
          </motion.div>
        </motion.div>
      </div>
    </StoryPage>,

    // 23: Code Page for Gift 10
    <StoryPage key="code-10" backgroundColor="bg-gray-50">
      <div className="text-center text-pink-500 mb-4" suppressHydrationWarning>
        Chances left: {chances}
      </div>
      {totalPunches > 0 && (
        <div className="text-center text-red-500 mb-4" suppressHydrationWarning>
          Total Extra Punches: {totalPunches} 👊
        </div>
      )}
      {showPunishment && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md shadow-sm text-center font-bold"
          suppressHydrationWarning
        >
          Punishment: +1 punch 👊
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 py-8 rounded-2xl shadow-question-card min-w-48 w-full max-w-[350px] relative mx-auto"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="text-[33px]"
            animate={{ y: [0, -7, 0], scale: [1, 1.1, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🔒
          </motion.div>
        </div>
        <h2 className="text-xl font-medium text-gradient mb-4 text-center">Enter the code for Gift 10</h2>
        <div className="mb-6 p-4 bg-violet-50 rounded-xl border-2 border-violet-200">
          <h3 className="text-lg font-semibold text-violet-700 mb-2">Puzzle Time! 🧩</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            <p className="text-gray-700 text-sm leading-relaxed">
            Naam hai sach, kaam hai fake,<br />
              Jhoot pe jhoot no retake!<br />
              Sab samjhein seedha, hai yeh tedha,<br />
              Is bande pe kabhi mat lena edha.<br />
              Kaun hai jiska sach pe kabza hai?
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="w-full pl-12 pr-12 py-2 text-lg border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 bg-white/80 backdrop-blur-sm"
              style={{
                fontFamily: "'Comic Sans MS', cursive",
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-pink-500"><span>🩷</span></div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-3 rounded-md shadow-sm"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-[#A569BD] w-full font-medium text-white px-6 py-2 rounded-full shadow-btn hover:bg-[#995db1]"
          >
            Unlock Gift 10
          </motion.button>
        </form>
      </motion.div>
    </StoryPage>,

    // 24: Gift 10 Page (Video)
    <StoryPage key="gift-10" backgroundColor="bg-gradient-to-br from-rose-200 to-pink-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-rose-600 mb-6">Gift 10 Unlocked! 🎁 <br /> -- by Satyam and Ayush</h2>
        </motion.div>
        <div className="w-full max-w-2xl mx-auto">
          {showVideo ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-xl overflow-hidden shadow-xl"
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/videos/special-message.mp4"
                autoPlay
                onEnded={() => setShowVideo(false)}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                disableRemotePlayback
                onContextMenu={(e) => e.preventDefault()}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-xl overflow-hidden shadow-xl cursor-pointer"
              onClick={() => setShowVideo(true)}
            >
              <Image
                src="/videos/thumbnail.jpg"
                alt="Video Thumbnail"
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl"
                >
                  ▶️
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </StoryPage>,

    // 25: Punches Summary Page
    <StoryPage key="punches-summary" backgroundColor="bg-gradient-to-br from-red-100 to-pink-200">
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 flex flex-col items-center"
        >
          <h2 className="text-4xl font-bold text-red-600 mb-6">Your Achievement! 🏆</h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-64 h-64 flex items-center justify-center mx-auto"
          >
            <Image
              src={totalPunches === 0 ? "/gifs/achievement0.gif" : "/gifs/achievement.gif"}
              alt="Achievement GIF"
              width={256}
              height={256}
              className="object-contain"
            />
          </motion.div>
          <div className="space-y-4 w-full">
            <p className="text-2xl text-red-700 font-semibold">
              Total Extra Punches: {totalPunches}
            </p>
            <p className="text-xl text-red-600 italic">
              {totalPunches === 0 ? (
                "Wow! You're actually good at this! 😮"
              ) : totalPunches <= 3 ? (
                "Not bad... but could be better! 😏"
              ) : totalPunches <= 6 ? (
                "Someone's getting a bit too many punches! 😅"
              ) : totalPunches <= 9 ? (
                "Are you trying to set a record or something? 😂"
              ) : (
                "At this point, you're just collecting punches! 🥊"
              )}
            </p>
            <p className="text-lg text-red-500 mt-4">
              {totalPunches === 0 ? (
                "Perfect score! You're officially a code-cracking genius! 🌟"
              ) : totalPunches <= 3 ? (
                "A few extra punches never hurt anyone... much! 😉"
              ) : totalPunches <= 6 ? (
                "Your arm must be getting tired from all these punches! 💪"
              ) : totalPunches <= 9 ? (
                "You're really testing my patience here! 😤"
              ) : (
                "I hope you're proud of your punch collection! 🏆"
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </StoryPage>,

    // 26: Final Page (Our Story Continues)
    <StoryPage key="final" backgroundColor="bg-gradient-to-br from-pink-100 to-blue-200">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-4xl font-bold text-pink-600 mb-6">Our Story Continues...</h2>
        <p className="text-xl text-blue-700 mb-8">Every moment we share is another step in our unforgettable story.</p>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl mb-8">
          ❤️
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-rose-500 text-white px-6 py-3 rounded-full text-lg shadow-btn hover:bg-rose-600"
          onClick={() => setCurrentPage(0)}
        >
          Start Over
        </motion.button>
      </div>
    </StoryPage>,
  ]

  // Functions for regular pages (non-treasure pages) navigation
  const regularNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1))
  }
  const regularPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="relative w-full h-screen">
      {isMounted && showConfetti && (
        <div 
          style={{ 
            opacity: confettiOpacity,
            transition: 'opacity 2s ease-in-out',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999
          }}
        >
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
          />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[78vh] bg-white rounded-3xl shadow-question-card overflow-hidden relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute"
          >
            <HeartIcon size={200} className="fill-pink-100 stroke-none" />
          </motion.div>
          <AnimatePresence mode="wait">
            {pages[currentPage]}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      {isTreasureStage ? (
        // Only show right arrow on gift pages, never on code pages, for the full treasure hunt sequence
        isGiftPage && currentPage < pages.length - 1 && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/50 rounded-full shadow-md hover:bg-white transition-colors duration-300 z-40"
          >
            <ChevronRight className="text-pink-600" />
          </button>
        )
      ) : (
        // Regular pages: show both left and right arrows (if within bounds)
        <>
          {currentPage > 0 && (
            <button
              onClick={regularPrevPage}
              className="fixed left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/50 rounded-full shadow-md hover:bg-white transition-colors duration-300 z-40"
            >
              <ChevronLeft className="text-pink-600" />
            </button>
          )}
          {currentPage < pages.length - 1 && (
            <button
              onClick={regularNextPage}
              className="fixed right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/50 rounded-full shadow-md hover:bg-white transition-colors duration-300 z-40"
            >
              <ChevronRight className="text-pink-600" />
            </button>
          )}
        </>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="fixed left-1/2 top-4 transform -translate-x-1/2 p-3 bg-white/50 rounded-full shadow-md hover:bg-white transition-colors duration-300 z-40"
            >
              <X className="text-pink-500" />
            </button>
            <motion.div
              initial={{ scale: 0.2 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-pink-50 p-4 rounded-3xl shadow-2xl max-w-fit w-full h-max overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={`/images/${selectedImage}.jpg`}
                alt={`Gallery image ${selectedImage}`}
                width={300}
                height={250}
                className="rounded-2xl w-auto h-auto"
              />
              <p className="mt-4 text-center text-gray-700">Moment {selectedImage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{customScrollbarStyles}</style>
    </div>
  )
}