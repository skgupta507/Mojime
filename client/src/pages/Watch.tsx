import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import { useEffect, useRef, useState, ChangeEvent } from "react";

import { IAnimeInfo } from "@consumet/extensions";
import { getAnime } from "../utils/api";

import Player from "../components/Player";
import LoadingAnimation from "../components/LoadingAnimation";

export default function Watch() {
  const location = useLocation();
  const { animeState, kaoIndexState } = location.state || {};

  const { animeId, episodeNo } = useParams();
  const episodeNumber = Number(episodeNo);

  const [animeInfo, setAnimeInfo] = useState<IAnimeInfo>(animeState);
  const [episodeInput, setEpisodeInput] = useState<string>(episodeNo ?? "");

  const episodeInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const { showBoundary } = useErrorBoundary();

  const handleEpisodeNavigate = (ep: number | string) => {
    if (!ep || !animeInfo.episodes?.hasOwnProperty(Number(ep) - 1)) {
      return;
    }
    navigate(`/${animeId}/${ep}`, {
      state: {
        animeState: animeInfo,
        kaoIndexState: kaoIndexState || randomKaoIndex
      }
    });
  }

  const handleEpInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue.length > String(animeInfo.episodes?.length).length) {
      return;
    }
    if (newValue === '' || /^[0-9]*$/.test(newValue)) {
      setEpisodeInput(newValue);
    }
  }

  useEffect(() => {
    if (!animeId || animeInfo) { return };

    const fetchAnime = async () => {
      try {
        const data = await getAnime(animeId);
        setAnimeInfo(data);
      } catch (error) {
        showBoundary(error);
      }
    }

    fetchAnime();
  }, [animeId, animeInfo])

  useEffect(() => {
    if (animeInfo && !animeInfo.episodes?.hasOwnProperty(episodeNumber - 1)) {
      throw new Response(
        "Error: Not Found",
        {
          status: 404,
          statusText: `Anime/Episode not found`
        }
      );
    }
  }, [animeInfo])

  const episodeInputStyle = {
    width: episodeInput.length + 'ch', // Set width based on the length of the value
  };

  return (animeInfo && animeInfo.episodes?.hasOwnProperty(episodeNumber - 1) && episodeNo ? (
    <>
      <Player episodeId={animeInfo.episodes[episodeNumber - 1].id} />
      <p>{animeInfo.title as string}</p>
      <div className="flex gap fl-a-center pb-1p5r">
        <button
          onClick={() => handleEpisodeNavigate(episodeNumber - 1)}
          disabled={episodeNumber === 1}
        >
          &lt; Prev
        </button>
        <div
          className="flex fl-a-center ul-hover"
          onClick={() => episodeInputRef.current?.focus()}
        >
          <form onSubmit={(e) => (
            e.preventDefault(),
            handleEpisodeNavigate(episodeInput)
          )}
          >
            <input
              className="ul-hover"
              ref={episodeInputRef}
              type="number"
              value={episodeInput}
              onKeyDown={(e) => [',', '.', '+', '-'].includes(e.key) && e.preventDefault()}
              onChange={(e) => handleEpInputChange(e)}
              onBlur={() => setEpisodeInput(episodeNo)}
              style={episodeInputStyle}
              min={1}
              max={animeInfo.episodes.length}
            />
          </form>
          <p className="m-0">&nbsp;/ {animeInfo.episodes.length ?? "?"}</p>
        </div>
        <button
          onClick={() => handleEpisodeNavigate(episodeNumber + 1)}
          disabled={episodeNumber >= (animeInfo.totalEpisodes ?? episodeNumber + 1)}
        >
          Next &gt;
        </button>
      </div>
      <Link to="/" className="mt-auto m-0 txt-dec-none">{watchKaomojis[kaoIndexState || randomKaoIndex]}</Link>
    </>
  ) : (
    <div className="abs-center flex fl-a-center fl-j-center">
      <LoadingAnimation />
    </div>
  ));
}

const watchKaomojis = [
  "(* ^ ω ^)",
  "(´ ∀ ` *)",
  "٩(◕‿◕｡)۶",
  "o(≧▽≦)/",
  "(o^▽^o)",
  "(⌒▽⌒)☆",
  "ヽ(・∀・)ﾉ",
  "(´｡• ω •｡`)",
  "(￣ω￣)",
  "(o･ω･o)",
  "(＠＾◡＾)",
  "ヽ(*・ω・)ﾉ",
  "(o_ _)ﾉ彡☆",
  "(o´▽`o)",
  "(*´▽`*)",
  "｡ﾟ( ﾟ^∀^ﾟ)ﾟ｡",
  "( ´ ω ` )",
  "o(*°▽°*)b",
  "(≧◡≦)",
  "(o´∀`o)",
  "(´• ω •`)",
  "(＾▽＾)",
  "(⌒ω⌒)",
  "∑d(°∀°d)",
  "╰(▔∀▔)╯",
  "(─‿‿─)",
  "(*^‿^*)",
  "ヽ(o^ ^o)ﾉ",
  "(✯◡✯)",
  "(◕‿◕)",
  "(*≧ω≦*)",
  "(☆▽☆)",
  "(⌒‿⌒)",
  "＼(≧▽≦)／",
  "ヽ(o＾▽＾o)ノ",
  "☆ ～('▽^人)",
  "(*°▽°*)",
  "٩(｡•́‿•̀｡)۶",
  "(✧ω✧)",
  "ヽ(*⌒▽⌒*)ﾉ",
  "(´｡• ᵕ •｡`)",
  "( ´ ▽ ` )",
  "(￣▽￣)",
  "╰(*´︶`*)╯",
  "ヽ(>∀<☆)ノ",
  "o(≧▽≦)o",
  "(☆ω☆)",
  "(っ˘ω˘ς )",
  "＼(￣▽￣)／",
  "(*¯︶¯*)",
  "＼(＾▽＾)／",
  "٩(◕‿◕)۶",
  "(o˘◡˘o)",
  "\\(★ω★)/",
  "\\(^ヮ^)/",
  "(〃＾▽＾〃)",
  "(╯✧▽✧)╯",
  "o(>ω<)o",
  "o( ❛ᴗ❛ )o",
  "( ‾́ ◡ ‾́ )",
  "(ﾉ´ヮ`)ﾉ*: ･ﾟ",
  "(b ᵔ▽ᵔ)b",
  "(๑˃ᴗ˂)ﻭ",
  "(๑˘︶˘๑)",
  "( ˙꒳​˙ )",
  "(´･ᴗ･ ` )",
  "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
  "(„• ֊ •„)",
  "(.❛ ᴗ ❛.)",
  "(⁀ᗢ⁀)",
  "(￢‿￢ )",
  "(¬‿¬ )",
  "(*￣▽￣)b",
  "( ˙▿˙ )",
  "(¯▿¯)",
  "( ◕▿◕ )",
  "＼(٥⁀▽⁀ )／",
  "(„• ᴗ •„)",
  "(ᵔ◡ᵔ)",
  "( ´ ▿ ` )",
  "(๑>◡<๑)",
  "( = ⩊ = )",
  "( ´ ꒳ ` )",
  "⸜( ´ ꒳ ` )⸝",
  "⸜(⸝⸝⸝´꒳`⸝⸝⸝)⸝",
  "⸜(*ˊᗜˋ*)⸝",
  "⸜( *ˊᵕˋ* )⸝"
];

const randomKaoIndex = Math.floor(Math.random() * watchKaomojis.length);