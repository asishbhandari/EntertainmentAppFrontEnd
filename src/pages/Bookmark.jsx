import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BASE_URL, Options } from "../constants";
import MediaCard from "../component/MediaCard";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { Zoom, toast } from "react-toastify";
import { Bars } from "react-loader-spinner";

const Bookmark = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const userBookmarkedMedia = useSelector(
    (state) => state.user.bookmarkedMedia
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [searchedTv, setSearchedTv] = useState([]);

  // useEffect to Search Movies
  useEffect(() => {
    const searchTvUrl = `https://api.themoviedb.org/3/search/tv?query=${searchTerm}&language=en-US&page=1`;
    const searchTv = setTimeout(async () => {
      const response = await fetch(searchTvUrl, Options);
      const data = await response.json();
      setSearchedTv(data.results);
    }, 1000);

    return () => clearTimeout(searchTv);
  }, [searchTerm]);

  // useEffect to Search Tv Shows
  useEffect(() => {
    const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=1`;

    const searchMovies = setTimeout(async () => {
      const response = await fetch(searchMovieUrl, Options);
      const data = await response.json();
      setSearchedMovies(data.results);
    }, 1000);

    return () => clearTimeout(searchMovies);
  }, [searchTerm]);

  // useEffect to load all the bookmarked media from dataBase
  useEffect(() => {
    const getBookmarkedMedia = async () => {
      try {
        const mediaBody = userBookmarkedMedia.map((media) => media?.mediaId);
        const response = await fetch(BASE_URL + "/v1/user/bookmarkedMedia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(mediaBody),
        });
        const data = await response.json();
        setMedia(data);
        setLoading(false);
      } catch (error) {
        toast.error(error.message, { transition: Zoom });
      }
    };
    getBookmarkedMedia();
  }, [userBookmarkedMedia]);

  return (
    <div className="mainContainer">
      <div className="searchBox">
        <FiSearch className="searchIcon" style={{ scale: "1.5" }} />
        <input
          type="text"
          name="search"
          id="searchBox"
          placeholder="Search for movies or Tv series"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {searchedMovies.length !== 0 || searchedTv.length !== 0 ? (
        <div className="trending">
          <h2>
            Found {searchedMovies?.slice(0, 8).length} Movie results for{" "}
            {searchTerm}
          </h2>
          <div className="mediaCardDiv">
            {searchedMovies?.slice(0, 8).map((m) => (
              <MediaCard
                key={uuidv4()}
                id={m.id}
                mediaPhoto={`https://image.tmdb.org/t/p/original/${
                  m.backdrop_path || m.poster_path
                }`}
                year={m.release_date}
                type={"movie"}
                title={m.title}
              />
            ))}
          </div>
          <h2>
            Found {searchedTv?.slice(0, 8).length} Tv Shows results for{" "}
            {searchTerm}
          </h2>
          <div className="mediaCardDiv">
            {searchedTv?.slice(0, 8).map((m) => (
              <MediaCard
                key={uuidv4()}
                id={m.id}
                mediaPhoto={`https://image.tmdb.org/t/p/original/${
                  m.backdrop_path || m.poster_path
                }`}
                year={m.first_air_date}
                type={"tv"}
                title={m.name}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="trending">
            <h2>Bookmarked Movies</h2>
            <div className="mediaCardDiv">
              {loading ? (
                <Bars
                  height="80"
                  width="80"
                  color="#4fa94d"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              ) : (
                <>
                  {media?.mediaResponse
                    ?.filter((ele) => ele.mediaType === "movie")
                    ?.slice(0, 10)
                    .map((m) => (
                      <MediaCard
                        key={uuidv4() * m.mediaId}
                        id={m.mediaId}
                        mediaPhoto={`https://image.tmdb.org/t/p/original/${m.mediaPhoto}`}
                        year={m.releaseYear.toString()}
                        type={m.mediaType}
                        title={m.title}
                      />
                    ))}
                </>
              )}
            </div>
          </div>
          <div className="trending">
            <h2>Bookmarked TV Series</h2>
            <div className="mediaCardDiv">
              {loading ? (
                <Bars
                  height="80"
                  width="80"
                  color="#4fa94d"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              ) : (
                <>
                  {media?.mediaResponse
                    ?.filter((ele) => ele.mediaType === "tv")
                    ?.slice(0, 10)
                    .map((m) => (
                      <MediaCard
                        key={uuidv4()}
                        id={m.mediaId}
                        mediaPhoto={`https://image.tmdb.org/t/p/original/${m.mediaPhoto}`}
                        year={m.releaseYear.toString()}
                        type={m.mediaType}
                        title={m.title}
                      />
                    ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Bookmark;
