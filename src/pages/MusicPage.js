import React, { useEffect, useRef, useState } from "react";
import "./musicpage.scss";
import NavigateButton from "./components/usually/NavigateButton";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "./SellPage";
import MusicPlayer from "./components/music/MusicPlayer";

const MusicPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const audioRef = useRef();
  const timeSliderRef = useRef();

  let { user, headers } = useSelector((state) => state.userSlice);

  const [theLoai, setTheLoai] = useState([
    {
      theLoaiId: 1,
      theLoaiName: "nhạc demo",
      singer: [
        {
          singerId: 1,
          singerName: "lý hải",
          singerImage: "",
          album: [
            {
              albumId: 1,
              albumName: "trọn đời bên em",
              albumImage: "albumPhoto",
              listSong: [
                {
                  songId: 1,
                  songName: "khi người đàn ông khóc - lý hải - first",
                  songLink: "tet_binh_an_2.mp3",
                },
                {
                  songId: 2,
                  songName: "mùa xuân ơi - lý hải",
                  songLink: "mua_xuan_oi.mp3",
                },
                {
                  songId: 3,
                  songName: "tết bình an - lý hải",
                  songLink: "tet_binh_an.mp3",
                },
                {
                  songId: 4,
                  songName: "tết bình an_2 - lý hải ",
                  songLink: "long_phung_sum_vay.mp3",
                },
              ],
            },
            {
              albumId: 2,
              albumName: "trọn đời bên em 2",
              albumImage: "albumPhoto",
              listSong: [
                {
                  songId: 5,
                  songName: "liều thuốc cho trái tim - lý hải",
                  songLink: "long_phung_sum_vay.mp3",
                },
                {
                  songId: 6,
                  songName: "mùa xuân ơi",
                  songLink: "mua_xuan_oi.mp3",
                },
              ],
            },
          ],
        },
        {
          singerId: 2,
          singerName: "đan trường",
          singerImage: "",
          album: [
            {
              albumId: 3,
              albumName: "tình khúc vàng",
              albumImage: "albumPhoto",
              listSong: [
                {
                  songId: 9,
                  songName: "tình khúc vàng - đan trường",
                  songLink: "long_phung_sum_vay.mp3",
                },
              ],
            },
            {
              albumId: 4,
              albumName: "kiếp ve sầu",
              albumImage: "albumPhoto",
              listSong: [
                {
                  songId: 13,
                  songName: "kiếp ve sầu - kiếp ve sầu",
                  songLink: "long_phung_sum_vay.mp3",
                },
                {
                  songId: 14,
                  songName: "mùa xuân ơi - kiếp ve sầu",
                  songLink: "mua_xuan_oi.mp3",
                },
                {
                  songId: 15,
                  songName: "tết bình an - kiếp ve sầu",
                  songLink: "tet_binh_an.mp3",
                },
                {
                  songId: 16,
                  songName: "tết bình an_2 - kiếp ve sầu",
                  songLink: "tet_binh_an_2.mp3",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      theLoaiId: 2,
      theLoaiName: "nhạc trẻ",
      singer: [
        {
          singerId: 3,
          singerName: "nguyễn phi hùng",
          singerImage: "",
          album: [
            {
              albumId: 5,
              albumName: "tình đơn coi",
              albumImage: "albumPhoto",
              listSong: [
                {
                  songId: 17,
                  songName: "tình đơn coi - tình đơn coi",
                  songLink: "long_phung_sum_vay.mp3",
                },
              ],
            },
          ],
        },
        {
          singerId: 4,
          singerName: "ưng hoàng phúc",
          singerImage: "",
          album: [
            {
              albumId: 6,
              albumName: "thà rằng như thế",
              albumImage: "albumPhoto",
              listSong: [
                {
                  songId: 21,
                  songName: "thà răng như thế",
                  songLink: "tet_binh_an.mp3",
                },
                {
                  songId: 22,
                  songName: "tôi không tun",
                  songLink: "mua_xuan_oi.mp3",
                },
                {
                  songId: 23,
                  songName: "tôi đi tìm tôi",
                  songLink: "long_phung_sum_vay.mp3",
                },
              ],
            },
            {
              albumId: 7,
              albumName: "Nổi nhớ",
              albumImage: "albumPhoto",
              listSong: [
                {
                  songId: 24,
                  songName: "nổi thớ",
                  songLink: "long_phung_sum_vay.mp3",
                },
                {
                  songId: 25,
                  songName: "lạc mất em",
                  songLink: "mua_xuan_oi.mp3",
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  const defaultData = (theLoai) => {
    const allSingers = theLoai.flatMap((theloai) =>
      theloai.singer.map((singer) => ({
        ...singer,
        listSong: singer.album.flatMap((album) => album.listSong),
      }))
    );
    const allAlbums = theLoai.flatMap((theloai) =>
      theloai.singer.flatMap((singer) =>
        singer.album.map((album) => ({
          ...album,
          singerName: singer.singerName,
        }))
      )
    );
    const allListSongs = theLoai.flatMap((theloai) =>
      theloai.singer.flatMap((singer) =>
        singer.album.flatMap((album) => album.listSong)
      )
    );
    setListSingerSelected(allSingers);
    setListAlbumSelected(allAlbums);
    setListSong(allListSongs);
  };

  const [theLoaiSelected, setTheLoaiSelected] = useState(null);
  const [listSingerSelected, setListSingerSelected] = useState([]);
  const [singerSelected, setSingerSelected] = useState({ singerId: -1 });
  const [listAlbumSelected, setListAlbumSelected] = useState([]);
  const [albumSelected, setAlbumSelected] = useState({ albumId: -1 });

  const [listSong, setListSong] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch(updateUser(user));
      headers = { token: user?.token };
      defaultData(theLoai);
    } else {
      navigate("/dang-nhap");
    }
  }, []);

  const handleSelectTheLoai = (item) => {
    if (item.theLoaiId === theLoaiSelected?.theLoaiId) {
      defaultData(theLoai);
      setTheLoaiSelected(null);
      setSingerSelected({ singerId: -1 });
    } else {
      setTheLoaiSelected(item);
      const allSingers = theLoai
        .find((theLoai) => theLoai.theLoaiId === item.theLoaiId)
        .singer.map((singer) => ({
          ...singer,
          listSong: singer.album.flatMap((album) => album.listSong),
        }));
      setListSingerSelected(allSingers);
      setListAlbumSelected(item.singer[0].album);
      const allListSongs = theLoai
        .find((theLoai) => theLoai.theLoaiId === item.theLoaiId)
        .singer.flatMap((singer) =>
          singer.album.flatMap((album) => album.listSong)
        );
      setSingerSelected({ singerId: -1 });
      setAlbumSelected({ albumId: -1 });
    }
  };

  const handleSelectSinger = (singer) => {
    const { singerId } = singer;
    setSingerSelected({ singerId });
    setListSong(singer.listSong);
    setListAlbumSelected(singer.album);
    setAlbumSelected({ albumId: -1 });
  };
  const handleSelectAlbum = (album) => {
    const { albumId } = album;
    setAlbumSelected({ albumId });
    setListSong(album.listSong);
  };

  if (user) {
    return (
      <div id="music">
        <div className="musicTitle">
          <p className="music">Music player</p>
          <div>
            <NavigateButton text="Quay về" link="/admin" />
            {/* <a href="/admin">Quay về</a> */}
          </div>
        </div>

        <div className="musicContent">
          <div className="musicContentSlider">
            <div className="sliderContent">
              {theLoai?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="sliderItem"
                    style={{
                      borderColor:
                        theLoaiSelected?.theLoaiId === item.theLoaiId
                          ? "white"
                          : "",
                      background:
                        theLoaiSelected?.theLoaiId === item.theLoaiId
                          ? "orangered"
                          : "",
                    }}
                    onClick={() => handleSelectTheLoai(item)}
                  >
                    <span>{capitalizeFirstLetter(item.theLoaiName)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="musicPlayerContent">
            <div className="leftContent">
              <div className="singer">
                <div className="singerSlider">
                  {listSingerSelected?.map((singer, index) => {
                    return (
                      <div
                        className="singerWrap"
                        key={index}
                        onClick={() => {
                          singer.singerId !== singerSelected.singerId &&
                            handleSelectSinger(singer);
                        }}
                      >
                        <div className="singerItem">
                          <img src="" alt="" />
                          <p
                            style={{
                              backgroundColor:
                                singer.singerId === singerSelected.singerId
                                  ? "orangered"
                                  : "",
                            }}
                          >
                            {singer.singerName}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="album">
                <div className="albumSlider">
                  {listAlbumSelected?.map((album, index) => {
                    return (
                      <div
                        className="albumWrap"
                        key={index}
                        onClick={() => {
                          album.albumId !== albumSelected.albumId &&
                            handleSelectAlbum(album);
                        }}
                      >
                        <div className="albumItem">
                          <img src="" alt="" />
                          <p
                            style={{
                              backgroundColor:
                                album.albumId === albumSelected.albumId
                                  ? "orangered"
                                  : "",
                            }}
                          >
                            {album.albumName}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="rightContent">
              {/* <div className="musicPlayList">
                {listSong?.map((item, index) => {
                  return (
                    <p
                      key={index}
                      style={{
                        color:
                          item.songId === playing?.songId && play
                            ? "orangered"
                            : item.songId === playing?.songId && !play
                            ? "red"
                            : "",
                        fontWeight:
                          item.songId === playing?.songId ? "bold" : "",
                      }}
                      onClick={() => handleClickSong(item)}
                    >
                      <span>{index + 1}. </span>
                      {item.songName}
                    </p>
                  );
                })}
              </div>
              <div className="musicPlayer">
                <audio
                  // controls
                  muted={muted}
                  ref={audioRef}
                  src={`http://localhost:8080/${playing?.songLink}`}
                  onEnded={handleSongEnded}
                  autoPlay={play} // Không autoPlay ở đây
                  loop={repeat}
                ></audio>
                <div className="timeSlider">
                  <div>
                    <input
                      ref={timeSliderRef}
                      type="range"
                      min="0"
                      step="1"
                      defaultValue="0"
                      onChange={handleSliderChange}
                    />
                    <p>
                      Time: {formatTime(currentTime)} / {formatTime(duration)}
                    </p>
                  </div>
                  <div className="speaker">
                    <button onClick={handleMutedToggle}>
                      {muted ? (
                        <i className="fa-solid fa-volume-xmark"></i>
                      ) : (
                        <i className="fa-solid fa-volume-high"></i>
                      )}
                    </button>
                  </div>
                </div>
                <div className="playingName">
                  <p>{capitalizeFirstLetter(playing?.songName)}</p>
                </div>
                <div className="controller">
                  <button onClick={handlePrevClick}>
                    <i className="fa-solid fa-backward"></i>
                  </button>
                  {play ? (
                    <button onClick={handlePauseClick}>
                      <i className="fa-solid fa-pause"></i>
                    </button>
                  ) : (
                    <button onClick={handlePlayClick}>
                      <i className="fa-solid fa-play"></i>
                    </button>
                  )}
                  <button onClick={handleNextClick}>
                    <i className="fa-solid fa-forward"></i>
                  </button>
                  <button
                    onClick={handleRandomPlay}
                    style={{
                      color: random ? "white" : "",
                      background: random ? "red" : "",
                    }}
                  >
                    <i className="fa-solid fa-shuffle"></i>
                  </button>

                  <button
                    onClick={handleRepeatToggle}
                    style={{
                      color: repeat ? "white" : "",
                      background: repeat ? "red" : "",
                    }}
                  >
                    <i className="fa-solid fa-repeat"></i>
                  </button>
                </div>
              </div> */}
              <MusicPlayer listSong={listSong} />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MusicPage;
