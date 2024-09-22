import React, {useState} from "react";
import { Parallax, useParallaxController } from "react-scroll-parallax";
import bg from '../public/coffee.webp';
import { motion } from "framer-motion";

export default function Hero() {
  const colors = ["#F59E0B", "#84CC16", "#10B981", "#3B82F6"];
  const skills = ["Agilist", "Creative Writer","Technology & Team Development","Developer", "Delivery Manager", "Digital Producer"];
  const parallaxController = useParallaxController();

  // updates cached values after image dimensions have loaded
  const handleLoad = () => parallaxController.update();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  const videoLoaded = () => {
    setIsVideoLoaded(true);
  };
  
  return (
    <section>
    <div className="relative flex flex-row justify-center items-start overflow-hidden h-screen">
      <div className="abosolute xsm:invisible sm:invisible lg:visible">
        <Parallax speed={-40} onLoad={handleLoad} easing='easeInOut'>
            <video autoPlay muted loop playsInline onCanPlayThrough={videoLoaded} className={`${isVideoLoaded ? "relative w-screen show" : "w-screen hide"}`}>
            <source src="BlackCoffee.mp4" type="video/mp4"/>
            </video>
              <div
                style={{
                backgroundImage: `url(${bg.src})`,
                }}
                className={`fallback ${isVideoLoaded ? "w-screen hide" : "relative w-screen show"}`}
              />
        </Parallax>
      </div>
      {/* Text container */}
      <div className="absolute">
      <Parallax speed={10} onLoad={handleLoad} easing='easeInOut'>
      <div className="relative flex flex-col items-center justify-center h-screen space-y-10">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            className="w-full flex justify-center"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ delay: index * 0.4, duration: 1 }}
          >
            <motion.div
              className="xsm:text-2xl sm:text-4xl md:text-8xl font-bold text-gray-700 dark:text-gray-200"
              style={{ color: colors[index] }}
            >
              {skill}
            </motion.div>
          </motion.div>
        ))}
        <p className="text-center">
                  Scroll down for more 
                  <motion.span
                    className="inline-block ml-4"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                     &#9660;
                  </motion.span>
                </p>
      </div>
        </Parallax>
        </div>
      </div>
      </section>
  );
}
