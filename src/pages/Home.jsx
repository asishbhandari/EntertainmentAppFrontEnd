import { FiSearch } from "react-icons/fi";
import "../css/home.css";
import { useEffect, useState } from "react";
import { updateUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { BASE_URL, Options } from "../constants";
import { Zoom, toast } from "react-toastify";
import MediaCard from "../component/MediaCard";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [media, setMedia] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [searchedTv, setSearchedTv] = useState([]);
  const dispatch = useDispatch();
  const trendingUrl =
    "https://api.themoviedb.org/3/trending/all/day?language=en-US";

  const getTrending = async () => {
    const response = await fetch(trendingUrl, Options);
    const data = await response.json();
    setMedia(data.results);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch(BASE_URL + "/v1/user/info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        // dispatch an action to store userinfo in the redux state
        dispatch(updateUser(data[0]));
      } catch (error) {
        toast.error("Error fetching data", { transition: Zoom });
        console.error("Error fetching data:", error);
      }
    };
    getUserInfo();
    getTrending();
  }, [dispatch]);

  useEffect(() => {
    const searchTvUrl = `https://api.themoviedb.org/3/search/tv?query=${searchTerm}&language=en-US&page=1`;
    const searchTv = setTimeout(async () => {
      const response = await fetch(searchTvUrl, Options);
      const data = await response.json();
      setSearchedTv(data.results);
    }, 1000);

    return () => clearTimeout(searchTv);
  }, [searchTerm]);

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
                isTrending={false}
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
                isTrending={false}
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
            <h2>Trending</h2>
            <div className="trendingCardDiv">
              {media?.slice(0, 10).map((m) => (
                <MediaCard
                  key={uuidv4()}
                  id={m.id}
                  isTrending={true}
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
          <div className="trending">
            <h2>Recommended for you</h2>
            <div className="mediaCardDiv">
              {media?.slice(8).map((m) => (
                <MediaCard
                  key={uuidv4()}
                  isTrending={false}
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

export default Home;
