import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import MediaCard from "../component/MediaCard";
import { v4 as uuidv4 } from "uuid";
import { Options } from "../constants";

const Movies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [media, setMedia] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  // const Options = {
  //   method: "GET",
  //   headers: {
  //     accept: "application/json",
  //     Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzU5ZjNhYTE4ODRlMzE1Yzc5ZmEyOGQ4NWYwN2FiMSIsInN1YiI6IjY2MDZjZDQ0ZTFmYWVkMDEzMWY5NzlkYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Qvcdf4wzFyXwJzH2q9QQCTlrd2vvtJ5LGPSP1SkExaI
  //     `,
  //   },
  // };

  useEffect(() => {
    const moviesUrl = `https://api.themoviedb.org/3/trending/movie/day?language=en-US`;
    const getMovies = async () => {
      const response = await fetch(moviesUrl, Options);
      const data = await response.json();
      setMedia(data.results);
    };
    getMovies();
  }, []);
  useEffect(() => {
    const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=1`;

    const searchMovies = setTimeout(async () => {
      const response = await fetch(searchMovieUrl, Options);
      const data = await response.json();
      setSearchedMovies(data.results);
    }, 1000);

    return () => clearTimeout(searchMovies);
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
      {searchedMovies.length !== 0 ? (
        <div className="trending">
          <h2>
            Found {searchedMovies?.slice(0, 12).length} Movie results for{" "}
            {searchTerm}
          </h2>
          <div className="mediaCardDiv">
            {searchedMovies?.slice(0, 12).map((m) => (
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
        </div>
      ) : (
        <>
          <div className="trending">
            <h2>Movies</h2>
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

export default Movies;
