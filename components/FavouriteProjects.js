import React from "react";
import Slider from "react-slick";
import { customLoader } from "../loader";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FavouriteProjects() {
  const sliderSettings = {
    infinite: false,
    slidesToShow: 2,
    speed: 500,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <section aria-label="my latest projects" className="relative -mt-20">
      <div className="bg-[#F1F1F1] dark:bg-gray-900">
        <div className="max-w-7xl mx-auto reveal">
          <header className="flex flex-col md:flex-row justify-between items-center xsm:pt-5 md:my-10 lg:my-10">
            <h2 className="text-6xl lg:text-9xl max-w-lg font-bold text-gray-500 my-20 md:my-10 md:text-gray-500 dark:text-gray-300 text-left">
              Create.
            </h2>
          </header>
          <Slider {...sliderSettings} className="pb-40 md:pb-20 sm:pb-5">
            <div className="relative overflow-hidden">
              <a
                href="/wip/gettingdiceytc"
                target="_blank"
              >
                <Image
                  loader={customLoader}
                  src="/GDTC.webp"
                  alt="Getting Dicey Trading Cards Extension project"
                  width={400}
                  height={400}
                  quality={75}
                  className="block transform hover:scale-125 transition duration-1000 ease-out"
                />
                <h3 className="absolute top-10 left-10 text-gray-50 font-bold text-xl bg-autumn-orange rounded-md px-2">
                  Getting Dicey Trading Cards
                </h3>
              </a>
            </div>
            <div className="relative overflow-hidden">
              <a
                href="https://www.amazon.com/dp/B09JVFJKFX"
                target="_blank"
              >
                <Image
                  loader={customLoader}
                  src="/TheDarkThatDwells.webp"
                  alt="The Dark That Dwells Beneath Te Aro rated 4 stars on Amazon books"
                  width={400}
                  height={300}
                  quality={75}
                  className="block transform hover:scale-125 transition duration-1000 ease-out"
                />
                <h3 className="absolute top-10 left-10 text-gray-50 font-bold text-xl bg-autumn-orange rounded-md px-2">
                  The Dark that Dwells Beneath Te Aro
                </h3>
              </a>
            </div>
            <div className="relative overflow-hidden">
              <a
                href="https://promocards.byspotify.com/api/share/a7bfb402-4e1d-4166-9150-ff12bad55e14"
                target="_blank"
              >
                <Image
                  loader={customLoader}
                  src="/spotifyAudiobook.webp"
                  alt="The Dark That Dwells Beneath Te Aro on Spotify"
                  width={500}
                  height={500}
                  quality={75}
                  className="block transform hover:scale-125 transition duration-1000 ease-out"
                />
              </a>
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
}
