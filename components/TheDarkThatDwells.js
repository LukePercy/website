import React from 'react'
import Head from 'next/head';
import userData from "../constants/data";
import { useRouter } from 'next/router';
import ReactStars from 'react-stars';

if (typeof window !== 'undefined') {
  //here `window` is available, so `window.document` (or simply `document`) is available too
    const track = document.getElementById('track');
    const controlBtn = document.getElementById('play-pause');

function playPause() {
  if (track.paused) {
      track.play();
      //controlBtn.textContent = "Pause";
      controlBtn.className = "pause";
  } else { 
      track.pause();
       //controlBtn.textContent = "Play";
      controlBtn.className = "play";
  }
}

controlBtn.addEventListener("click", playPause);
track.addEventListener("ended", function() {
  controlBtn.className = "play";
});

}

export default function TheDarkThatDwells({...customMeta}){
  const router = useRouter();
  const meta = {
    title: "The Dark that Dwells Beneath Te Aro",
    description: `First time author L.J. Percy brings a story of a dark threat lurking beneath the Te Aro Valley, a bustling Wellington suburb. Available now on Amazon.com`,
    type: "website",
    image: '/public/book.png',
    // image: userData.avatarUrl,
    ...customMeta,
  };
  
  return (
    <>
    <Head>
    <title>{meta.title}</title>
    <meta name="robots" content="follow, index" />
    <meta name="description" content={meta.description} />
    <meta name="color-scheme" content="dark light"/>
    <meta
      property="og:url"
      content={`${userData.domain}${router.asPath}`}
    />
    <link
      rel="canonical"
      href={`${userData.domain}${router.asPath}`}
    />
    <meta property="og:type" content={meta.type} />
    <meta property="og:site_name" content="Luke Percy" />
    <meta property="og:description" content={meta.description} />
    <meta property="og:title" content={meta.title} />
    <meta property="og:image" content={meta.image} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@agilecreep" />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:description" content={meta.description} />
    <meta name="twitter:image" content={meta.image} />
    {meta.date && (
      <meta property="article:published_time" content={meta.date} />
    )}
  </Head>
    <main className='w-screen'>
      <div className='overflow-hidden'>
        <video autoPlay muted loop id='backgroundVideo' className='w-screen'>
          <source src="thedarkthatdwellsbackground.mp4" type="video/mp4"/>
        </video>
        <audio id="track" autoPlay loop>
          <source src="TheDarkThatDwellsSounds.mp3" type="audio/mpeg" />
            Your browser does not support audio
          </audio>
      <div className='bookPageContent'>
        <div id="player-container">
          <div id="play-pause" className="play">Play</div>
        </div>
          <div className='book-page-container'>
            <div className='Image-area '>
              <img src='book.png' width="600" alt="Book Cover for The Dark That Dwells Beneath Te Aro"/>
            </div>
              <div className='Text-area'>
                <p className='reviewText sm:text-xl md:text-2xl lg:text-4xl'>
                <ReactStars count={5} value={4.5} edit={false} size={50} color2={'#ffd700'}/>&#8220; A cleverly written book that does a skilful job of building up a sense of mystery...<br/>&ndash; <span>Amazon Review</span></p>
                  <p className='btnContainer'>
                    <a href='https://www.amazon.com/dp/B09JVFJKFX' target={'_blank'}>
                      <span className='amazonButton'>
                        <i className='iconAmazon'></i>
                          Available Now
                      </span>
                    </a>
                  </p>
              </div>
          </div>
        </div>
      </div>
    </main> 
  </>
)}
