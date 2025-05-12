"use client"
// No longer need Image import for this simplified version
// import Image from "next/image";
// import GeometricBackground from "@/components/GeometricBackground"; // Remove old import
import dynamic from 'next/dynamic'; // Import next/dynamic
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useEffect } from 'react'; // Added import
import Image from 'next/image'; // Added import
import localFont from 'next/font/local'; // Added import for localFont

// Load Aharoni font
// IMPORTANT: Adjust the path to 'aharoni.ttf' if it's not in project_root/fonts/
const aharoni = localFont({ 
  src: '../../public/fonts/Aharoni.ttf', // Path relative to src/app. If your fonts dir is at project_root/fonts
  display: 'swap',
  // variable: '--font-aharoni' // Optional: if you want to use it as a CSS variable elsewhere
});

// Dynamically import the background component with SSR disabled
// const FlowingLinesBackground = dynamic(
//   () => import('@/components/FlowingLinesBackground'),
//   { ssr: false }
// );
const GeometricBackground = dynamic(
  () => import('@/components/GeometricBackground'), // Import the reverted component
  { ssr: false } // Keep SSR disabled
);

// Removing old animations, new background styling will be inline or via Tailwind
// const animations = `...`;

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState('dark'); // Default to dark, matching ThemeToggle

  // State for Contact Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState(''); // To show success/error messages

  useEffect(() => {
    const updateCurrentTheme = () => {
      const themeAttribute = document.documentElement.getAttribute('data-theme');
      if (themeAttribute) {
        setCurrentTheme(themeAttribute);
      } else {
        // If data-theme is not set, default to dark and set the attribute
        // This ensures consistency if this component renders before ThemeToggle's effect
        document.documentElement.setAttribute('data-theme', 'dark');
        setCurrentTheme('dark');
      }
    };

    updateCurrentTheme(); // Set initial theme

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          updateCurrentTheme();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus('Submitting...');

    // This console.log is fine for frontend debugging before the fetch
    console.log('Attempting to submit form data:', { name, email, message }); 

    try {
      const response = await fetch('/api/contact', { // Sending to our API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }), // Send form data as JSON
      });

      const result = await response.json(); // Get the JSON response from the API

      if (response.ok) {
        // Successfully submitted to the API
        console.log('API Response from /api/contact:', result); // Log the server's response
        setName('');
        setEmail('');
        setMessage('');
        setFormStatus('Message sent successfully!');
      } else {
        // API returned an error
        console.error('API Error from /api/contact:', result);
        setFormStatus(result.message || 'An error occurred while sending.');
      }
    } catch (error) {
      // Network error or other issue with the fetch call
      console.error('Fetch submission error to /api/contact:', error);
      setFormStatus('Failed to send message. Please check your connection and try again.');
    }

    // Clear the status message after 5 seconds
    setTimeout(() => setFormStatus(''), 5000);
  };

  // Alignment Mark component - Larger Size
  const AlignmentMark = ({ positionClasses }: { positionClasses: string }) => (
    <div
      // Increased size and font size
      className={`absolute ${positionClasses} w-16 h-16 z-40 pointer-events-none flex items-center justify-center`}
    >
      {/* Base Black Plus - Larger */}
      <span className="absolute text-7xl font-thin text-black">+</span>
      {/* Offset CMY Pluses (Larger Offsets) */}
      <span
        className="absolute text-7xl font-thin"
        style={{ color: 'rgba(170, 220, 230, 0.7)', transform: 'translate(-4px, -3px)', mixBlendMode: 'multiply' }}
      >
        +
      </span>
      <span
        className="absolute text-7xl font-thin"
        style={{ color: 'rgba(230, 180, 210, 0.7)', transform: 'translate(4px, -1px)', mixBlendMode: 'multiply' }}
      >
        +
      </span>
      <span
        className="absolute text-7xl font-thin"
        style={{ color: 'rgba(240, 230, 170, 0.7)', transform: 'translate(0px, 4px)', mixBlendMode: 'multiply' }}
      >
        +
      </span>
    </div>
  );

  return (
    <>
      {/* Remove old style tag */}
      {/* <style jsx global>{animations}</style> */}

      {/* Main container: Light theme, Inter font */}
      <div className="flex flex-col min-h-screen bg-white text-gray-800 font-[family-name:var(--font-inter)] relative overflow-x-hidden">

        {/* Remove the simple gradient */}
        {/* <div className="absolute inset-0 z-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(220, 220, 220, 0.1), transparent 60%)'
        }}></div> */}

        {/* Alignment Marks - More instances */}
        <AlignmentMark positionClasses="top-8 left-8 md:left-12" />         {/* Top Left */}
        <AlignmentMark positionClasses="top-1/4 left-8 md:left-12 -translate-y-1/2" /> {/* Mid-Top Left */}
        <AlignmentMark positionClasses="top-1/2 left-8 md:left-12 -translate-y-1/2" /> {/* Middle Left */}
        <AlignmentMark positionClasses="top-3/4 left-8 md:left-12 -translate-y-1/2" /> {/* Mid-Bottom Left */}
        <AlignmentMark positionClasses="bottom-8 left-8 md:left-12" />      {/* Bottom Left */}

        <AlignmentMark positionClasses="top-8 right-8 md:right-12" />        {/* Top Right */}
        <AlignmentMark positionClasses="top-1/4 right-8 md:right-12 -translate-y-1/2" />{/* Mid-Top Right */}
        <AlignmentMark positionClasses="top-1/2 right-8 md:right-12 -translate-y-1/2" />{/* Middle Right */}
        <AlignmentMark positionClasses="top-3/4 right-8 md:right-12 -translate-y-1/2" />{/* Mid-Bottom Right */}
        <AlignmentMark positionClasses="bottom-8 right-8 md:right-12" />     {/* Bottom Right */}

        {/* Geometric Background - Still behind */}
        <div className="absolute inset-0 z-0">
           <GeometricBackground />
        </div>

        {/* Header: Even More Vivid CMYK Gradient */}
        <header
          className="relative sticky top-0 z-20 w-full px-6 sm:px-10 py-4 backdrop-blur-md border-b border-gray-200"
          style={{
            // Maxed out alpha for vivid gradient
            background: `linear-gradient(to right, rgba(124, 227, 248, 0.77), rgba(250, 142, 207, 0.69), rgba(247, 229, 132, 0.7))`
          }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
             {/* Logo Placeholder - Increased size & added text */}
            <div className="flex items-center space-x-0.5"> {/* Container for logo and text, reduced space-x-2 to space-x-0.5 */}
              <Image
                src={currentTheme === 'dark' ? '/nilicon_white.png' : '/nilicon_black.png'}
                alt="Neolithic Logo"
                width={54} // Increased size
                height={54} // Increased size
                priority 
              />
              <span className={`${aharoni.className} text-4xl`}>neolithic</span> {/* Changed text-2xl to text-4xl */}
            </div>
            {/* Navigation Placeholder */}
            <nav className="flex items-center space-x-4">
              <a href="#capabilities" className="text-xl text-gray-600 hover:text-black">Capabilities</a> {/* Changed text-sm to text-xl */}
              <a href="#contact" className="text-xl text-gray-600 hover:text-black">Contact</a> {/* Changed text-sm to text-xl */}
              <ThemeToggle />
            </nav>
          </div>
        </header>

        {/* Main content area - Still z-10 */}
        <main className="flex-grow flex flex-col items-center justify-center relative z-10">

          {/* Intro Hero Section: Valora-inspired - Content is above the background */}
          <section id="intro" className="min-h-[calc(60vh)] w-full flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="max-w-4xl">
              {/* Optional: "Backed by" section like Valora */}
              {/* <p className="mb-4 text-gray-500">Backed by <span className="font-semibold">Your Investors</span></p> */}

              {/* Main Headline - Stronger CMYK Glow */}
              <h1
                className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
                style={{
                  // Maxed out alpha values and blur for strong glow
                  textShadow: `
                    0 0 15px rgba(170, 220, 230, 0.7),
                    0 0 15px rgba(230, 180, 210, 0.65),
                    0 0 15px rgba(240, 230, 170, 0.6)
                  `
                }}
              >
                <span className="text-gray-500 block mb-2">Revolutionizing</span>
                <span className="text-black">Lithography</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Neolithic is developing state-of-the-art hardware for semiconductor fabrication. Unparalleled precision at 10^3× lower cost.
              </p>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We are on a warpath to 2nm.
              </p>
              <div className="flex gap-4 justify-center">
                <a 
                  href="#contact"
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 font-semibold py-3 px-8 rounded-full transition duration-300"
                >
                  Get Updates
                </a>
              </div>
            </div>
          </section>

          {/* Capabilities Section: Simplified */}
          <section id="capabilities" className="relative z-10 w-full py-16 px-4 bg-gray-50 mb-8 -mt-4">
             <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 text-black">Capabilities</h2>
                <p className="text-lg text-gray-600 mb-8">Cutting-edge integrated circuit fabrication is constrained by enormous, expensive EUV lithography. We have a technology to blow past the resolution limits of EUV lithography. We are making small-batch 20nm resolution desktop 
                  lithography as accessible as 3D printing, with a plan to scale up for ultra cheap high-throughput nanopatterning. </p>
             </div>
          </section>

          {/* GIF insertion point */}
          <div className="w-full flex justify-center py-8"> {/* Centering container with some padding */}
            <Image 
              src="/transparent.gif"
              alt="decorative gif"
              width={100} // Placeholder: Adjust to your GIF's natural width
              height={100} // Placeholder: Adjust to your GIF's natural height
              style={{ transform: 'scale(2.5)' }} // Zoom effect changed to 3x
              unoptimized // Recommended for GIFs
            />
          </div>

          {/* Contact Us Section: Simplified */}
          <section id="contact" className="w-full py-16 px-4 bg-gray-50 relative z-10">
             <div className="max-w-3xl mx-auto text-center">
               <h2 className="text-4xl font-bold mb-4 text-black">Contact Us</h2>
               <p className="text-lg text-gray-600 mb-8">Get in touch to learn more.</p>
               {/* Basic Form Placeholder */}
               <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 items-center">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full max-w-md p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full max-w-md p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <textarea 
                    placeholder="Your Message" 
                    rows={4} 
                    className="w-full max-w-md p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                  <button 
                    type="submit" 
                    className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-full transition duration-300 mt-4"
                  >
                    Send Message
                  </button>
               </form>
               {formStatus && <p className="mt-4 text-sm text-gray-600">{formStatus}</p>}
             </div>
          </section>
        </main>

        {/* Footer: Minimalist - Ensure it has a higher z-index or background */}
        <footer className="w-full text-center p-6 text-gray-500 text-sm border-t border-gray-200 relative z-10 bg-white">
          © {new Date().getFullYear()} Neolithic Technologies. All rights reserved.
        </footer>
      </div>
    </>
  );
}
