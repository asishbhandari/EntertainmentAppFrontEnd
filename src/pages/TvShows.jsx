import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import MediaCard from "../component/MediaCard";
import { Options } from "../constants";
import { v4 as uuidv4 } from "uuid";

const TvShows = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [media, setMedia] = useState([]);
  const [searchedTv, setSearchedTv] = useState([]);

  // const Options = {
  //   method: "GET",
  //   headers: {
  //     accept: "application/json",
  //     Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzU5ZjNhYTE4ODRlMzE1Yzc5ZmEyOGQ4NWYwN2FiMSIsInN1YiI6IjY2MDZjZDQ0ZTFmYWVkMDEzMWY5NzlkYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qvcdf4wzFyXwJzH2q9QQCTlrd2vvtJ5LGPSP1SkExaI
  //     `,
  //   },
  // };

  useEffect(() => {
    const tvUrl = `https://api.themoviedb.org/3/trending/tv/day?language=en-US`;
    const getTv = async () => {
      try {
        const response = await fetch(tvUrl, Options);
        const data = await response.json();
        setMedia(data.results);
      } catch (error) {
        console.log("error fetching Tv Shows :", error);
      }
    };
    getTv();
  }, []);
  useEffect(() => {
    const searchTvUrl = `https://api.themoviedb.org/3/search/tv?query=${searchTerm}&include_adult=false&language=en-US&page=1`;
    const searchTv = setTimeout(async () => {
      const response = await fetch(searchTvUrl, Options);
      const data = await response.json();
      setSearchedTv(data.results);
    }, 1000);

    return () => clearTimeout(searchTv);
  }, [searchTerm]);
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
      {searchedTv.length !== 0 ? (
        <div className="trending">
          <h2>
            Found {searchedTv?.slice(0, 12).length} Tv shows results for{" "}
            {searchTerm}
          </h2>
          <div className="mediaCardDiv">
            {searchedTv?.slice(0, 12).map((m) => (
              <MediaCard
                key={uuidv4()}
                id={m.id}
                mediaPhoto={`https://image.tmdb.org/t/p/original/${
                  m.backdrop_path || m.poster_path
                }`}
                year={m.release_date || m.first_air_date}
                type={"tv"}
                title={m.title || m.name}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="trending">
            <h2>TV Series</h2>
            <div className="mediaCardDiv">
              {media?.slice(0, 16).map((m) => (
                <MediaCard
                  key={uuidv4()}
                  id={m.id}
                  mediaPhoto={`https://image.tmdb.org/t/p/original/${
                    m.backdrop_path || m.poster_path
                  }`}
                  year={
                    m.media_type === "movie" ? m.release_date : m.first_air_date
                  }
                  type={m.media_type}
                  title={m.media_type === "movie" ? m.title : m.name}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TvShows;
