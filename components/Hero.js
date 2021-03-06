import React, {useState} from "react";
import { RoughNotationGroup } from "react-rough-notation";
import { RainbowHighlight } from "./RainbowHighlight";
import { Parallax, useParallaxController } from "react-scroll-parallax";
import bg from '../public/mixkit-cup-full-of-coffee-209_Moment.jpg'

export default function Hero() {
  const colors = ["#F59E0B", "#84CC16", "#10B981", "#3B82F6"];
  const parallaxController = useParallaxController();

  // updates cached values after image dimensions have loaded
  const handleLoad = () => parallaxController.update();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  const videoLoaded = () => {
    setIsVideoLoaded(true);
  };
  
  return (
    <>
    <div className="relative flex flex-row justify-center items-start overflow-hidden md:pb-20 h-screen">
      <div className="absolute xsm:invisible sm:invisible lg:visible">
        <Parallax speed={-40} onLoad={handleLoad} easing='easeInOut'>
            <video autoPlay muted loop playsInline onCanPlayThrough={videoLoaded} className={`${isVideoLoaded ? "w-screen show" : "w-screen hide"}`}>
            <source src="BlackCoffee.mp4" type="video/mp4"/>
            </video>
              <div
                style={{
                backgroundImage: `url(${bg.src})`,
                }}
                className={`fallback ${isVideoLoaded ? "w-screen hide" : "w-screen show"}`}
              />
        </Parallax>
      </div>
      {/* Text container */}
      <div className="w-7/12 text-center md:text-left lg:pt-20 md:pt-20 xsm:pt-10 xsm:pb-10 sm:pt-15">
      <Parallax speed={10}>
        <RoughNotationGroup show={true}>
        <RainbowHighlight color={colors[1]}>
            <h1 className="text-4xl md:text-8xl xsm:text-2xl font-bold text-gray-700 dark:text-gray-200 my-2">
              Agilist.
            </h1>
          </RainbowHighlight>
          <RainbowHighlight color={colors[3]}>
            <h1 className="text-4xl md:text-8xl xsm:text-2xl font-bold text-gray-700 dark:text-gray-200 my-2">
              Writer.
            </h1>
          </RainbowHighlight>
          <RainbowHighlight color={colors[2]}>
            <h1 className="text-4xl md:text-8xl xsm:text-2xl font-bold text-gray-700 dark:text-gray-200 my-2">
              Developer.
            </h1>
          </RainbowHighlight>
        </RoughNotationGroup>
        <div><p className="text-center">Scroll<span> &#9660;</span></p></div>
        </Parallax>
      </div>
    </div>
    </>
  );
}
