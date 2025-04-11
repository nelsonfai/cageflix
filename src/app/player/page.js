"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import { ChevronLeft } from "lucide-react";

export default function Player() {
  const router = useRouter();

  const playerRef = useRef(null);

  const videoSrc = "/cageflix.mp4";

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
      }
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="relative w-full h-screen bg-black">
        <ReactPlayer
          ref={playerRef}
          url={videoSrc}
          width="100%"
          height="100%"
          className="!absolute top-0 left-0"
          controls={true}  
          playing={true}   
          config={{
            file: {
              forceAudio: false,
              attributes: {
                controlsList: "nodownload"
              }
            }
          }}
        />

        <div className="absolute top-0 left-0 p-6 z-10">
          <button
            onClick={handleBack}
            className="text-white hover:text-gray-300 bg-black/30 rounded-full p-2"
          >
            <ChevronLeft size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}