import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

type Video = {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
};

const videos: Video[] = [
  {
    id: "car1",
    title: "Company Work Culture",
    url: "https://idcard-media-prod.s3.us-east-1.amazonaws.com/media/carousel-vids/car1.mp4",
  },
  {
    id: "car2",
    title: "Team Collaboration",
    url: "https://idcard-media-prod.s3.us-east-1.amazonaws.com/media/carousel-vids/car2.mp4",
  },
];

export function VideoCarousel() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [muteStates, setMuteStates] = useState<Record<string, boolean>>({});

  const togglePlay = (videoId: string, videoElement: HTMLVideoElement) => {
    if (playingId === videoId) {
      videoElement.pause();
      setPlayingId(null);
    } else {
      // Pause all other videos
      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((v) => v.pause());
      videoElement.play();
      setPlayingId(videoId);
    }
  };

  const toggleMute = (videoId: string, videoElement: HTMLVideoElement) => {
    videoElement.muted = !videoElement.muted;
    setMuteStates((prev) => ({
      ...prev,
      [videoId]: videoElement.muted,
    }));
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-up">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Our Work</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            See Our <span className="gradient-text">Company in Action</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our vibrant work culture and see how we bring innovation to life every day.
          </p>
        </div>

        {/* Video Carousel */}
        <div className="relative">
          <Carousel className="w-full" opts={{ loop: true, align: "center" }}>
            <CarouselContent className="-ml-4">
              {videos.map((video) => (
                <CarouselItem key={video.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/1">
                  <div className="group relative aspect-video rounded-2xl overflow-hidden bg-black/80 shadow-xl hover:shadow-2xl transition-all duration-300">
                    {/* Video Player */}
                    <video
                      id={`video-${video.id}`}
                      className="w-full h-full object-cover"
                      src={video.url}
                      controlsList="nodownload"
                      onEnded={() => setPlayingId(null)}
                    />

                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
                        playingId === video.id ? "opacity-0" : "opacity-0 group-hover:opacity-30"
                      }`}
                    />

                    {/* Play/Pause Button Center */}
                    {playingId !== video.id && (
                      <button
                        onClick={() => {
                          const videoElement = document.getElementById(
                            `video-${video.id}`
                          ) as HTMLVideoElement;
                          if (videoElement) togglePlay(video.id, videoElement);
                        }}
                        className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
                      >
                        <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center backdrop-blur-sm shadow-lg group-hover/play:bg-white group-hover/play:scale-110 transition-all duration-300">
                          <Play size={28} className="text-primary fill-primary ml-1" />
                        </div>
                      </button>
                    )}

                    {/* Video Controls - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                            {video.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => {
                            const videoElement = document.getElementById(
                              `video-${video.id}`
                            ) as HTMLVideoElement;
                            if (videoElement) toggleMute(video.id, videoElement);
                          }}
                          className="ml-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                          {muteStates[video.id] ? (
                            <VolumeX size={18} className="text-white" />
                          ) : (
                            <Volume2 size={18} className="text-white" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Playing Indicator */}
                    {playingId === video.id && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                        <div className="flex gap-1">
                          <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                          <span className="w-1 h-3 bg-white rounded-full animate-pulse animation-delay-100" />
                          <span className="w-1 h-3 bg-white rounded-full animate-pulse animation-delay-200" />
                        </div>
                        <span className="text-xs font-semibold text-white ml-1">Playing</span>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-3 mt-8">
              <CarouselPrevious className="h-12 w-12 border-2 border-border hover:bg-primary hover:border-primary hover:text-white" />
              <CarouselNext className="h-12 w-12 border-2 border-border hover:bg-primary hover:border-primary hover:text-white" />
            </div>
          </Carousel>
        </div>

        {/* Info Cards */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: "🎬",
              title: "Professional Content",
              description: "High-quality videos showcasing our company culture and work environment",
            },
            {
              icon: "🤝",
              title: "Team Spirit",
              description: "See how our dedicated team collaborates to achieve excellence",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
