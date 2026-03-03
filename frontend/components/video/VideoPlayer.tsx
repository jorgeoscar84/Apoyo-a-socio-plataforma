/**
 * Componente VideoPlayer
 * Reproductor de video con soporte para múltiples fuentes (YouTube, Vimeo, HTML5)
 * Incluye tracking de progreso automático
 */

'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from 'lucide-react';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

// Tipos
export type VideoPlatform = 'youtube' | 'vimeo' | 'appwrite' | 'html5';

export interface VideoPlayerProps {
  videoId: string;
  platform: VideoPlatform;
  videoUrl?: string;
  duration: number;
  title: string;
  startTime?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number, progress: number) => void;
  onEnded?: () => void;
  onProgressSave?: (currentTime: number, progress: number) => void;
  autoSaveInterval?: number; // en segundos
  className?: string;
}

// Hook para tracking de progreso
function useProgressTracking(
  videoId: string,
  duration: number,
  onProgressSave?: (currentTime: number, progress: number) => void,
  autoSaveInterval: number = 10
) {
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const lastSaveTime = React.useRef(0);

  const progress = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;

  const handleTimeUpdate = React.useCallback(
    (time: number) => {
      setCurrentTime(time);

      // Guardar progreso cada autoSaveInterval segundos
      if (
        onProgressSave &&
        time - lastSaveTime.current >= autoSaveInterval
      ) {
        const newProgress = Math.round((time / duration) * 100);
        onProgressSave(time, newProgress);
        lastSaveTime.current = time;
      }
    },
    [duration, onProgressSave, autoSaveInterval]
  );

  const handlePlay = React.useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = React.useCallback(() => {
    setIsPlaying(false);
    // Guardar progreso al pausar
    if (onProgressSave && currentTime > lastSaveTime.current) {
      onProgressSave(currentTime, progress);
      lastSaveTime.current = currentTime;
    }
  }, [currentTime, progress, onProgressSave]);

  const handleEnded = React.useCallback(() => {
    setIsPlaying(false);
    if (onProgressSave) {
      onProgressSave(duration, 100);
    }
  }, [duration, onProgressSave]);

  return {
    currentTime,
    progress,
    isPlaying,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
    setCurrentTime,
  };
}

// Componente para YouTube
interface YouTubePlayerProps {
  videoId: string;
  startTime?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
}

function YouTubePlayer({
  videoId,
  startTime = 0,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
}: YouTubePlayerProps) {
  const playerRef = React.useRef<any>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const timeUpdateInterval = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Cargar API de YouTube
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Configurar el player cuando la API esté lista
    (window as any).onYouTubeIframeAPIReady = () => {
      if (!containerRef.current) return;

      playerRef.current = new (window as any).YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          start: startTime,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            // Iniciar intervalo para actualizar tiempo
            timeUpdateInterval.current = setInterval(() => {
              if (playerRef.current?.getCurrentTime) {
                const time = playerRef.current.getCurrentTime();
                onTimeUpdate?.(Math.floor(time));
              }
            }, 1000);
          },
          onStateChange: (event: any) => {
            const state = event.data;
            if (state === (window as any).YT.PlayerState.PLAYING) {
              onPlay?.();
            } else if (state === (window as any).YT.PlayerState.PAUSED) {
              onPause?.();
            } else if (state === (window as any).YT.PlayerState.ENDED) {
              onEnded?.();
            }
          },
        },
      });
    };

    return () => {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, startTime, onPlay, onPause, onTimeUpdate, onEnded]);

  return <div ref={containerRef} className="w-full h-full" />;
}

// Componente para Vimeo
interface VimeoPlayerProps {
  videoId: string;
  startTime?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
}

function VimeoPlayer({
  videoId,
  startTime = 0,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
}: VimeoPlayerProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const playerRef = React.useRef<any>(null);

  React.useEffect(() => {
    // Cargar SDK de Vimeo
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!iframeRef.current) return;

      playerRef.current = new (window as any).Vimeo.Player(iframeRef.current);

      playerRef.current.on('play', () => {
        onPlay?.();
      });

      playerRef.current.on('pause', () => {
        onPause?.();
      });

      playerRef.current.on('timeupdate', (event: any) => {
        onTimeUpdate?.(Math.floor(event.seconds));
      });

      playerRef.current.on('ended', () => {
        onEnded?.();
      });

      if (startTime > 0) {
        playerRef.current.setCurrentTime(startTime);
      }
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.off('play');
        playerRef.current.off('pause');
        playerRef.current.off('timeupdate');
        playerRef.current.off('ended');
      }
    };
  }, [videoId, startTime, onPlay, onPause, onTimeUpdate, onEnded]);

  return (
    <iframe
      ref={iframeRef}
      src={`https://player.vimeo.com/video/${videoId}?h=1&title=0&byline=0&portrait=0`}
      className="w-full h-full"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}

// Componente para HTML5 Video
interface HTML5PlayerProps {
  videoUrl: string;
  startTime?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
}

function HTML5Player({
  videoUrl,
  startTime = 0,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
}: HTML5PlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(false);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlayEvent = () => onPlay?.();
    const handlePauseEvent = () => onPause?.();
    const handleTimeUpdateEvent = () => {
      onTimeUpdate?.(Math.floor(video.currentTime));
    };
    const handleEndedEvent = () => onEnded?.();

    video.addEventListener('play', handlePlayEvent);
    video.addEventListener('pause', handlePauseEvent);
    video.addEventListener('timeupdate', handleTimeUpdateEvent);
    video.addEventListener('ended', handleEndedEvent);

    if (startTime > 0) {
      video.currentTime = startTime;
    }

    return () => {
      video.removeEventListener('play', handlePlayEvent);
      video.removeEventListener('pause', handlePauseEvent);
      video.removeEventListener('timeupdate', handleTimeUpdateEvent);
      video.removeEventListener('ended', handleEndedEvent);
    };
  }, [startTime, onPlay, onPause, onTimeUpdate, onEnded]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative w-full h-full group">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain bg-black"
        controls
        playsInline
      >
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  );
}

// Componente para Appwrite Storage
interface AppwritePlayerProps extends HTML5PlayerProps {
  // Mismo comportamiento que HTML5
}

function AppwritePlayer(props: AppwritePlayerProps) {
  return <HTML5Player {...props} />;
}

// Componente principal VideoPlayer
export const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(
  (
    {
      videoId,
      platform,
      videoUrl,
      duration,
      title,
      startTime = 0,
      onPlay,
      onPause,
      onTimeUpdate,
      onEnded,
      onProgressSave,
      autoSaveInterval = 10,
      className,
    },
    ref
  ) => {
    const progressTracking = useProgressTracking(
      videoId,
      duration,
      onProgressSave,
      autoSaveInterval
    );

    const handlePlay = React.useCallback(() => {
      progressTracking.handlePlay();
      onPlay?.();
    }, [progressTracking, onPlay]);

    const handlePause = React.useCallback(() => {
      progressTracking.handlePause();
      onPause?.();
    }, [progressTracking, onPause]);

    const handleTimeUpdate = React.useCallback(
      (time: number) => {
        progressTracking.handleTimeUpdate(time);
        onTimeUpdate?.(time, progressTracking.progress);
      },
      [progressTracking, onTimeUpdate]
    );

    const handleEnded = React.useCallback(() => {
      progressTracking.handleEnded();
      onEnded?.();
    }, [progressTracking, onEnded]);

    // Renderizar según la plataforma
    const renderPlayer = () => {
      switch (platform) {
        case 'youtube':
          return (
            <YouTubePlayer
              videoId={videoId}
              startTime={startTime || progressTracking.currentTime}
              onPlay={handlePlay}
              onPause={handlePause}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />
          );
        case 'vimeo':
          return (
            <VimeoPlayer
              videoId={videoId}
              startTime={startTime || progressTracking.currentTime}
              onPlay={handlePlay}
              onPause={handlePause}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />
          );
        case 'appwrite':
        case 'html5':
        default:
          return (
            <HTML5Player
              videoUrl={videoUrl || ''}
              startTime={startTime || progressTracking.currentTime}
              onPlay={handlePlay}
              onPause={handlePause}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />
          );
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full aspect-video bg-black rounded-lg overflow-hidden',
          className
        )}
      >
        {/* Loading State */}
        {!progressTracking.isPlaying && progressTracking.currentTime === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        )}

        {/* Video Player */}
        {renderPlayer()}

        {/* Progress Bar Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50 z-20">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressTracking.progress}%` }}
          />
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

// Skeleton loader
export function VideoPlayerSkeleton() {
  return (
    <div className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
        <Play className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );
}

export default VideoPlayer;
