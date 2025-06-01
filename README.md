# A Special Journey

## Overview

Welcome to A Special Journey! This project is a personalized gift website that creates an interactive and engaging experience through a series of beautifully designed cards, animations, and a treasure hunt of gifts. Built using Next.js, React, Tailwind CSS, and Framer Motion, this project provides a unique way to share special moments and gifts.

## ✨ Features

- **Interactive Story Cards**: A series of beautifully designed cards that display your special journey
- **Secret Code Entry**: A hidden card that unlocks with a special code
- **Treasure Hunt**: 13 unique gifts with their own secret codes
- **Punch Counter**: Tracks extra punches when wrong codes are entered
- **Beautiful Animations**:
  - Confetti celebrations
  - Floating hearts
  - Smooth page transitions
  - Animated emojis and icons
- **Responsive Design**: Works seamlessly on all devices
- **Image Gallery**: View and interact with special moments
- **Time Counter**: Shows how long you've been together
- **Achievement Page**: Displays your punch count with sarcastic messages
- **Customizable Content**: Easy to personalize with your own content

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [React Confetti](https://www.npmjs.com/package/react-confetti) - Celebration effects

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/personalized-gift-website.git
   ```

2. Navigate to the project directory:
   ```bash
   cd personalized-gift-website
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_BASE_URL=your_base_url
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📁 Project Structure

```
personalized-gift-website/
├── public/
│   ├── gifts/         # Gift images
│   ├── gifs/          # Animated GIFs
│   └── images/        # Gallery images
├── src/
│   ├── components/    # React components
│   ├── styles/        # Global styles
│   └── pages/         # Next.js pages
└── ...
```

## 🎨 Customization

### Content Customization

1. **Text and Messages**:
   - Edit text content in `src/components/MainContent.jsx`
   - Modify messages in the letter page
   - Update achievement messages based on punch count

2. **Images**:
   - Replace images in `/public/gifts/` with your own gift images
   - Update gallery images in `/public/images/`
   - Add your own GIFs in `/public/gifs/`

3. **Colors and Styling**:
   - Modify gradient backgrounds in each page
   - Update color schemes in Tailwind classes
   - Customize animations in Framer Motion components

4. **Gift Codes**:
   - Update gift codes in the `giftCodes` array
   - Modify the secret code for the initial card

### Adding New Features

1. **New Gift Pages**:
   - Add new gift codes to the `giftCodes` array
   - Create corresponding gift pages following the existing pattern
   - Update the treasure stage range in the code

2. **Custom Animations**:
   - Add new Framer Motion animations
   - Create custom celebration effects
   - Implement new interactive elements

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## 📝 Notes

- Ensure all images are optimized for web use
- Keep gift codes secure and memorable
- Test thoroughly on different devices and browsers
- Regular backups of your content are recommended

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Ayush Bansal - Initial work

## 🙏 Acknowledgments

- Thanks to all the open-source libraries used in this project
- Special thanks to the Next.js and React communities
- Inspired by the need to create meaningful digital experiences

---

Made with ❤️ for someone special
