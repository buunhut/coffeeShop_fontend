import React, { useEffect, useRef, useState } from "react";
import "./musicplayer.scss";
import { capitalizeFirstLetter } from "../../SellPage";

const MusicPlayer = ({ listSong }) => {
  const audioRef = useRef();
  const timeSliderRef = useRef();

  //listSong
  // const [listSong, setListSong] = useState([
  //   {
  //     songId: 1,
  //     songName: "khi người đàn ông khóc - lý hải - first",
  //     songLink: "tet_binh_an_2.mp3",
  //   },
  //   {
  //     songId: 2,
  //     songName: "mùa xuân ơi - lý hải",
  //     songLink: "mua_xuan_oi.mp3",
  //   },
  //   {
  //     songId: 3,
  //     songName: "tết bình an - lý hải",
  //     songLink: "tet_binh_an.mp3",
  //   },
  //   {
  //     songId: 4,
  //     songName: "tết bình an_2 - lý hải ",
  //     songLink: "long_phung_sum_vay.mp3",
  //   },
  //   {
  //     songId: 5,
  //     songName: "khi người đàn ông khóc - lý hải - first",
  //     songLink: "tet_binh_an_2.mp3",
  //   },
  //   {
  //     songId: 6,
  //     songName: "mùa xuân ơi - lý hải",
  //     songLink: "mua_xuan_oi.mp3",
  //   },
  //   {
  //     songId: 7,
  //     songName: "tết bình an - lý hải",
  //     songLink: "tet_binh_an.mp3",
  //   },
  //   {
  //     songId: 8,
  //     songName: "tết bình an_2 - lý hải ",
  //     songLink: "long_phung_sum_vay.mp3",
  //   },
  //   {
  //     songId: 9,
  //     songName: "khi người đàn ông khóc - lý hải - first",
  //     songLink: "tet_binh_an_2.mp3",
  //   },
  //   {
  //     songId: 10,
  //     songName: "mùa xuân ơi - lý hải",
  //     songLink: "mua_xuan_oi.mp3",
  //   },
  //   {
  //     songId: 11,
  //     songName: "tết bình an - lý hải",
  //     songLink: "tet_binh_an.mp3",
  //   },
  //   {
  //     songId: 12,
  //     songName: "tết bình an_2 - lý hải ",
  //     songLink: "long_phung_sum_vay.mp3",
  //   },
  //   {
  //     songId: 13,
  //     songName: "khi người đàn ông khóc - lý hải - first",
  //     songLink: "tet_binh_an_2.mp3",
  //   },
  //   {
  //     songId: 14,
  //     songName: "mùa xuân ơi - lý hải",
  //     songLink: "mua_xuan_oi.mp3",
  //   },
  //   {
  //     songId: 15,
  //     songName: "tết bình an - lý hải",
  //     songLink: "tet_binh_an.mp3",
  //   },
  //   {
  //     songId: 16,
  //     songName: "tết bình an_2 - lý hải ",
  //     songLink: "long_phung_sum_vay.mp3",
  //   },
  // ]);

  //list
  const [showList, setShowList] = useState(false);

  //playingSong
  const [playingSong, setPlayingSong] = useState(listSong ? listSong[0] : []);

  //trạng thái play
  const [play, setPlay] = useState(false);

  //trạng thái pause
  const [pause, setPause] = useState(false);

  //trạng thái repeat
  const [repeat, setRepeat] = useState(false);

  //trạng thái phát ngẫu nhiên
  const [shuffle, setShuffle] = useState(false);

  //tráng thái mute
  const [muted, setMuted] = useState(true);

  //loaded file

  //chức năng controller
  const [autoPlayNext, setAutoPlayNext] = useState(false);
  //play hát
  const handlePlay = () => {
    if (playingSong && autoPlayNext) {
      setPlay(true);
      audioRef.current.play();
    }
  };

  const handleSongEnded = () => {
    // setPlay(false);
    audioRef.current.currentTime = 0;

    if (repeat) {
      setPlay(play);
      return;
    }
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * listSong.length);
      setPlayingSong(listSong[randomIndex]);
      setPlay(play);
      return;
    }

    const currentIndex = listSong?.findIndex(
      (item) => item.songId === playingSong.songId
    );
    if (currentIndex !== -1 && currentIndex < listSong.length - 1) {
      setPlayingSong(listSong[currentIndex + 1]);
      setPlay(play);
    } else {
      setPlayingSong(listSong[0]);
      setPlay(play);
    }
  };

  //pause dừng
  const handlePause = () => {
    if (playingSong) {
      setPlay(false);
      audioRef.current.pause();
    }
  };

  //next qua bài
  const handleNext = () => {
    handleSongEnded();
  };

  //prev trở lại bài trước
  const handlePrev = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      setPlay(play);
      return;
    }
    const curentIndex = listSong.findIndex(
      (item) => item.songId === playingSong.songId
    );
    if (curentIndex !== -1) {
      if (curentIndex === 0) {
        audioRef.current.currentTime = 0;
        setPlay(play);

        return;
      }
      setPlayingSong(listSong[curentIndex - 1]);
      setPlay(play);
    }
  };

  //repeat hát lặp 1 bài
  const handleRepeat = () => {
    setShuffle(false);
    setRepeat(!repeat);
  };

  //shuffle hát ngẫu nhiên
  const handleShuffle = () => {
    setRepeat(false);
    setShuffle(!shuffle);
  };

  //tắt loa
  const handleMute = () => {
    setMuted(!muted);
  };

  //timeSlide
  const [currentTime, setCurrentTime] = useState(0);
  const updateCurrentTime = () => {
    if (timeSliderRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      timeSliderRef.current.value = audioRef.current.currentTime;
    }
  };

  const [durationTime, setDurationTime] = useState(0);
  const updateDurationTime = () => {
    if (timeSliderRef.current) {
      setDurationTime(audioRef.current.duration);
      timeSliderRef.current.max = audioRef.current.duration;
    }
  };

  const updateSliderTime = () => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateCurrentTime);
      audioRef.current.addEventListener("loadedmetadata", updateDurationTime);
    }
  };

  const handleSliderChange = (event) => {
    if (audioRef.current) {
      audioRef.current.currentTime = event.target.value;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleAudioLoaded = () => {
    setAutoPlayNext(true);
    // console.log("đã load file");
  };

  //style

  useEffect(() => {
    updateSliderTime();
  }, [playingSong]);
  useEffect(() => {
    setShowList(true);
    setPlayingSong(listSong[0]);
    audioRef.current.pause();
    setPlay(false);
  }, [listSong]);

  const musicListHeight = showList ? `calc(100vh - 260px)` : "auto";

  const handleClickSongItem = (item) => {
    console.log(item);
    if (item.songId === playingSong.songId) {
      if (play) {
        audioRef.current.pause();
        setPlay(false);
      } else {
        audioRef.current.play();
        setPlay(true);
      }
    } else {
      setPlayingSong(item);
      setPlay(true);
    }
  };

  return (
    <>
      <div
        className="musicList"
        style={{
          // transform: showList ? "translateY(0)" : "",
          height: showList ? musicListHeight : "",
          padding: showList ? "20px" : "",
          marginBottom: showList ? "" : "0px",
        }}
      >
        <h3>PlayList</h3>
        {listSong.map((item, index) => {
          return (
            <p
              key={index}
              style={{
                marginTop: index === 0 ? "5px" : "",
                backgroundColor:
                  item.songId === playingSong?.songId ? "orangered" : "",
                color: item.songId === playingSong?.songId ? "white" : "",
              }}
              onClick={() => handleClickSongItem(item)}
            >
              <span>{index + 1}.</span> {capitalizeFirstLetter(item.songName)}
            </p>
          );
        })}
      </div>
      <div className="mucsicPlayer">
        <div className="mucsicPlayerContent">
          <audio
            ref={audioRef}
            controls={false}
            muted={muted}
            autoPlay={play} // Không autoPlay ở đây
            loop={repeat}
            onEnded={handleSongEnded}
            onLoadedMetadata={handleAudioLoaded}
            src={`http://localhost:8080/${playingSong?.songLink}`}
          />
          <div className="playingSong">
            <p>{capitalizeFirstLetter(playingSong?.songName)}</p>
          </div>
          <div
            className="listSongLength"
            onClick={() => setShowList(!showList)}
          >
            <i className="fa-solid fa-book"></i>
          </div>
          <div className="timer">
            <div className="timerContent">
              <input
                className="timeSlider"
                ref={timeSliderRef}
                type="range"
                min={0}
                step={1}
                defaultValue={currentTime}
                onChange={handleSliderChange}
              />
              <p>
                {formatTime(currentTime)} / {formatTime(durationTime)}
              </p>
            </div>
            <div className="speaker">
              <button onClick={handleMute}>
                {muted ? (
                  <i className="fa-solid fa-volume-xmark"></i>
                ) : (
                  <i className="fa-solid fa-volume-high"></i>
                )}
              </button>
            </div>
          </div>
          <div className="controller">
            <button
              style={{
                backgroundColor: repeat ? "#009900" : "",
              }}
              onClick={handleRepeat}
            >
              <i className="fa-solid fa-repeat"></i>
            </button>
            <button onClick={handlePrev}>
              <i className="fa-solid fa-backward"></i>
            </button>
            {play ? (
              <button className="play" onClick={handlePause}>
                <i className="fa-solid fa-pause"></i>
              </button>
            ) : (
              <button className="play" onClick={handlePlay}>
                <i className="fa-solid fa-play"></i>
              </button>
            )}

            <button onClick={handleNext}>
              <i className="fa-solid fa-forward"></i>
            </button>

            <button
              style={{
                backgroundColor: shuffle ? "#009900" : "",
              }}
              onClick={handleShuffle}
            >
              <i className="fa-solid fa-shuffle"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
