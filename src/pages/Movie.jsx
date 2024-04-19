import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Options } from "../constants";
import Rating from "react-rating";
import { FiStar } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { SiImdb } from "react-icons/si";
import { v4 as uuidv4 } from "uuid";

function Movie() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});
  const [casts, setCasts] = useState({});

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${movieId.slice(
      1
    )}?language=en-US`;
    const urlCast = `https://api.themoviedb.org/3/movie/${movieId.slice(
      1
    )}/credits?language=en-US`;
    const getMediaMovie = async () => {
      try {
        const response = await fetch(url, Options);
        const data = await response.json();
        const responseCasts = await fetch(urlCast, Options);
        const dataCast = await responseCasts.json();
        setMovie(data);
        setCasts(dataCast);
      } catch (error) {
        console.log(error);
      }
    };
    getMediaMovie();
  }, [movieId]);
  return (
    <div className="singleMediaContainer">
      <div className="mediaPic">
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          alt="Movie Poster"
        />
      </div>
      <div className="mediaContent">
        <h1>
          {movie?.title} : {movie?.tagline}
        </h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span>{(movie.vote_average / 2).toPrecision(2)}</span>
          <Rating
            initialRating={movie.vote_average / 2}
            readonly={true}
            fractions={10}
            emptySymbol={<FiStar className="ratingIcon" />}
            fullSymbol={<FaStar className="ratingIcon" />}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "15px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", width: "150px" }}
          >
            <p style={{ color: "gray" }}>Length</p>
            <p>{`${movie.runtime} min.`}</p>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "150px" }}
          >
            <p style={{ color: "gray" }}>Language</p>
            <p>English</p>
            {/* <p>{movie.original_language}</p> */}
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "150px" }}
          >
            <p style={{ color: "gray" }}> Year</p>
            <p>{movie.release_date?.slice(0, 4)}</p>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "150px" }}
          >
            <p style={{ color: "gray" }}>Status</p>
            <p>{movie.status}</p>
          </div>
        </div>
        <div>
          <h2>Genres</h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            {movie.genres?.map((genre) => (
              <span
                key={uuidv4()}
                style={{
                  backgroundColor: "white",
                  color: "#10141e",
                  borderRadius: "0.3rem",
                  width: "fit-content",
                  padding: "0 4px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {genre?.name}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2>Synopsis</h2>
          <p style={{ fontSize: "14px" }}>{movie.overview}</p>
        </div>
        <div>
          <h2>Casts</h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {casts.cast?.map((c) => (
              <span
                key={uuidv4()}
                style={{
                  color: "white",
                  borderRadius: "0.3rem",
                  border: "1px solid white",
                  width: "fit-content",
                  padding: "0 4px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {c?.name}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
          <span
            style={{
              backgroundColor: "#5a698f",
              borderRadius: "0.3rem",
              padding: "0.5rem 1rem",
              fontSize: "13px",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => window.open(movie.homepage, "_blank")}
          >
            Website <FaLink />
          </span>
          <span
            style={{
              backgroundColor: "#5a698f",
              borderRadius: "0.3rem",
              padding: "0.5rem 1rem",
              fontSize: "13px",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() =>
              window.open(
                `https://www.imdb.com/title/${movie.imdb_id}/`,
                "_blank"
              )
            }
          >
            IMDB <SiImdb />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Movie;
