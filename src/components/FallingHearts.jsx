import React, { useRef, useEffect } from "react";

export default function FallingHearts() {
    const canvasRef = useRef(null); // Reference to the canvas element

    useEffect(() => {
        const canvas = canvasRef.current; // Get the canvas element from the ref
        const ctx = canvas.getContext("2d"); // Get the 2d context for drawing
        const hearts = []; // Array to store heart objects
        const colors = ["#FFCCE5", "#F2C9D4", "#E0B0FF", "#F8D1DC", "#FAD0C7"];// Lovely colors for hearts
        const maxHearts = 20; // Total number of hearts

        // Function to set the initial canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;  // Set canvas width to window width
            canvas.height = window.innerHeight; // Set canvas height to window height
        };

        // Initialize the hearts
        const initializeHearts = () => {
            hearts.length = 0; // Reset the hearts array
            for (let i = 0; i < maxHearts; i++) {
                hearts.push({
                    x: Math.random() * canvas.width, // Random starting x position
                    y: Math.random() * canvas.height, // Random starting y position
                    size: Math.random() * 6 + 4, // Random size between 4 and 10
                    color: colors[Math.floor(Math.random() * colors.length)], // Random color from colors array
                    speedX: (Math.random() - 0.5) * 0.3, // Random horizontal drift speed
                    speedY: Math.random() * 0.01 + 0.05, // Random vertical drift speed
                    angle: Math.random() * Math.PI * 2, // Random starting rotation angle
                    angleSpeed: Math.random() * 0.02 - 0.01, // Random speed of rotation
                });
            }
        };

        // Resize canvas and initialize hearts
        resizeCanvas();
        initializeHearts();

        // Event listener to handle window resize
        window.addEventListener("resize", () => {
            resizeCanvas(); // Adjust canvas size
            initializeHearts(); // Reinitialize hearts on resize
        });

        // Function to draw a heart shape on the canvas
        const drawHeart = (ctx, x, y, size, color) => {
            ctx.fillStyle = color; // Set heart color
            ctx.beginPath();
            ctx.moveTo(x, y); // Start path at the center
            ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size); // Left curve
            ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y); // Right curve
            ctx.closePath();
            ctx.fill(); // Fill the heart with the chosen color
        };

        // Animation loop for continuous movement of hearts
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas at the start of each frame

            hearts.forEach((heart) => {
                // Update heart position based on speed and direction
                heart.x += heart.speedX;
                heart.y += heart.speedY;
                heart.angle += heart.angleSpeed; // Update heart's rotation angle

                // Wrap around the edges of the canvas (hearts reappear from opposite side)
                if (heart.y > canvas.height) heart.y = -heart.size;
                if (heart.x > canvas.width) heart.x = -heart.size;
                if (heart.x < -heart.size) heart.x = canvas.width;

                // Draw the heart at its new position
                ctx.save(); // Save the current drawing context
                ctx.translate(heart.x, heart.y); // Move the canvas origin to the heart's position
                ctx.rotate(heart.angle); // Rotate the canvas to the heart's current angle
                drawHeart(ctx, 0, 0, heart.size, heart.color); // Draw the heart shape
                ctx.restore(); // Restore the drawing context to its original state
            });

            requestAnimationFrame(animate);  // Keep looping the animation
        };

        animate();  // Start the animation

        return () => {
            window.removeEventListener("resize", resizeCanvas); // Cleanup event listener on unmount
        };
    }, []); // Empty dependency array to run the effect only once after mount

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none" />; // Canvas with full viewport size
}
