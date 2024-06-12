import { useEffect, useRef, createContext, RefObject, useContext } from "react";
import { getEpisode } from "../utils/api";

import { ISource } from "@consumet/extensions";

import styles from '../styles/player/player.module.css';

import { MediaPlayer, MediaProvider, MediaPlayerInstance } from '@vidstack/react';

import { VideoLayout } from './Player/videoLayout';
import '@vidstack/react/player/styles/base.css';

import { throttle } from "lodash-es";
import { WatchContext, PreloadedEpisode } from "../contexts/WatchProvider";
import { useErrorBoundary } from "react-error-boundary";
import LoadingAnimation from "./LoadingAnimation";
import { useParams } from "react-router-dom";
import { isAxiosError } from "axios";

type PlayerContextType = {
  playerRef: RefObject<MediaPlayerInstance> | undefined
}

export const PlayerContext = createContext<PlayerContextType>({
  playerRef: { current: null }
});

export default function Player() {
  const {
    animeInfo,
    qualities,
    setSources,
    setQualities,
    selectedQuality,
    setSelectedQuality,
    currentTime,
    sources,
    episodeNoState,
    setIsLoadingEpisode
  } = useContext(WatchContext);
  const { animeId } = useParams();

  const source = sources?.find(src => src.quality === selectedQuality)?.url;
  const playerRef = useRef<MediaPlayerInstance>(null);
  const isPreloadThreshold = useRef(false);

  const qualityContextValues: PlayerContextType = { playerRef }

  const { showBoundary } = useErrorBoundary();

  const abortControllerRef = useRef<AbortController | null>(null);
  const getEpisodeWithAbortSignal = async (episodeId: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const newAbortController = new AbortController();
    abortControllerRef.current = newAbortController;
    try {
      const episode: ISource = await getEpisode(episodeId, newAbortController.signal);
      setIsLoadingEpisode(false);
      return episode;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    const episodeId = animeInfo?.episodes?.[Number(episodeNoState) - 1].id as string;

    if (episodeId) {
      const setEpisode = async () => {
        const preloaded = sessionStorage.getItem(episodeId);
        if (preloaded) {
          const parsed: PreloadedEpisode = JSON.parse(preloaded);
          setSources(parsed.sources);
          setQualities(parsed.qualities);
          setIsLoadingEpisode(false);
          return;
        }

        try {
          const episode: ISource = await getEpisodeWithAbortSignal(episodeId);
          const sources = episode.sources;
          const qualities = episode.sources
            .map(src => src.quality)
            .filter(src => /\d/.test(src ?? ""))

          setSources(sources);
          setQualities(qualities);

          const episodeCache: PreloadedEpisode = {
            sources: sources,
            qualities: qualities
          }
          sessionStorage.setItem(episodeId, JSON.stringify(episodeCache));
        } catch (error) {
          if (isAxiosError(error) && error.code === "ERR_CANCELED") {
            return;
          }
          showBoundary(error);
        }
      }

      setEpisode();
    }
  }, [episodeNoState, animeInfo]);

  useEffect(() => {
    setSources([]);
    setQualities([]);
  }, [animeId])

  useEffect(() => {
    if (qualities) {
      const storedQuality = localStorage.getItem("preferredVideoQuality");
      if (storedQuality && qualities.includes(storedQuality)) {
        setSelectedQuality(storedQuality);
      } else {
        setSelectedQuality(qualities[qualities.length - 1] || "default");
      }
    }
  }, [qualities]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handlePreload = async () => {
    if (
      !playerRef.current ||
      isPreloadThreshold.current ||
      !animeInfo?.episodes?.hasOwnProperty(Number(episodeNoState))
    ) {
      return;
    }

    const duration = playerRef.current.duration;
    const currentTime = playerRef.current.currentTime;
    const progressPercent = currentTime / duration;

    if (progressPercent >= 0.75) {
      const episodeId = animeInfo.episodes?.[Number(episodeNoState)].id

      try {
        const episode: ISource = await getEpisodeWithAbortSignal(episodeId);

        const episodeCache: PreloadedEpisode = {
          sources: episode.sources,
          qualities: episode.sources
            .map(src => src.quality)
            .filter(src => /\d/.test(src ?? ""))
        }

        sessionStorage.setItem(episodeId, JSON.stringify(episodeCache));
      } catch (error) {
        return;
      } finally {
        isPreloadThreshold.current = true;
      }
    }
  }

  return (
    <div id="player-container">
      <div id="player-ratio">
        <div id="player-wrapper">
          <MediaPlayer
            className={`${styles.player} player`}
            src={source}
            playsInline
            autoPlay
            ref={playerRef}
            onTimeUpdate={throttle(() => handlePreload(), 1000)}
          >
            <MediaProvider />
            {source ? (
              <PlayerContext.Provider value={qualityContextValues}>
                <VideoLayout />
              </PlayerContext.Provider>
            ) : (
              <span className="abs-center w-100 h-100 flex fl-a-center fl-j-center pointer-none">
                <LoadingAnimation />
              </span>
            )}
          </MediaPlayer>
        </div>
      </div>
    </div >
  );
}