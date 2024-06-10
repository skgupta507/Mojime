import buttonStyles from '../../styles/player/button.module.css';

import {
  FullscreenButton,
  Menu,
  RadioGroup,
  PlayButton,
  SeekButton,
  useMediaState,
} from '@vidstack/react';
import {
  FullscreenExitIcon,
  FullscreenIcon,
  PauseIcon,
  PlayIcon,
  NextIcon
} from '@vidstack/react/icons';
import { QualityContext } from '../Player';
import { useContext } from 'react';
import { WatchContext } from '../../Root';
import { useParams, useNavigate } from 'react-router-dom';

export function Play() {
  const isPaused = useMediaState('paused');
  return (
    <PlayButton className={`play-button ${buttonStyles.button} ${buttonStyles.mobile}`}>
      {isPaused ? <PlayIcon /> : <PauseIcon />}
    </PlayButton>
  );
}

export function Fullscreen() {
  const isActive = useMediaState('fullscreen');

  return (
    <FullscreenButton className={`fullscreen-button ${buttonStyles.button}`}>
      {isActive ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </FullscreenButton>
  );
}

interface SeekProps {
  seconds?: number;
}

export function Seek(props: SeekProps) {
  return (
    <SeekButton
      seconds={props.seconds}
      className={buttonStyles.seek}
    >
      +{props.seconds}s
    </SeekButton>
  );
}

export function Quality() {
  const {
    qualities,
    selectedQuality,
    setSelectedQuality,
    setCurrentTime,
    playerRef
  } = useContext(QualityContext);

  const handleSelect = (p: string | undefined) => {
    if (!p) { return; }

    setSelectedQuality(p);
    localStorage.setItem("preferredVideoQuality", p);

    if (playerRef && playerRef.current) {
      setCurrentTime(playerRef.current.currentTime);
    }
  }

  return (
    <Menu.Root>
      <Menu.Button className={`${buttonStyles.button} ${buttonStyles.quality}`}>
        {selectedQuality}
      </Menu.Button>
      <Menu.Items
        placement="top"
        className={buttonStyles.radioWrapper}
      >
        <RadioGroup.Root>
          {qualities?.map(p => (
            <RadioGroup.Item
              key={p}
              value={p}
              className={`${buttonStyles.radioChild} ${p === selectedQuality ? buttonStyles.radioChildSelected : ""}`}
              onSelect={() => handleSelect(p)}
            >
              {p}
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </Menu.Items>
    </Menu.Root>
  )
}

export function Next() {
  const { animeInfo, isFullscreen, isAutoFullscreen } = useContext(WatchContext);
  const { episodeNo } = useParams();
  const navigate = useNavigate();

  const handleNavigate = () => {
    isAutoFullscreen.current = isFullscreen.current === true;
    navigate(`/${animeInfo?.id}/${Number(episodeNo) + 1}`);
  }

  return (animeInfo?.episodes?.hasOwnProperty(Number(episodeNo)) && (
    <button
      onClick={() => handleNavigate()}
      className={`${buttonStyles.button}`}
    >
      <NextIcon />
    </button>
  ));
}
