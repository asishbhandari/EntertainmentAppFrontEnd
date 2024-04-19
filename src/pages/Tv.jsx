import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Options } from "../constants";
import Rating from "react-rating";
import { FiStar } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import { Zoom, toast } from "react-toastify";

const Tv = () => {
  const { TvId } = useParams();
  const [tv, setTv] = useState({});
  const [casts, setCasts] = useState({});

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/tv/${TvId.slice(
      1
    )}?language=en-US`;
    const urlCast = `https://api.themoviedb.org/3/tv/${TvId.slice(
      1
    )}/credits?language=en-US`;
    const getMediaMovie = async () => {
      try {
        const response = await fetch(url, Options);
        const data = await response.json();
        const responseCasts = await fetch(urlCast, Options);
        const dataCast = await responseCasts.json();
        setTv(data);
        setCasts(dataCast);
      } catch (error) {
        toast.error(error.message, { transition: Zoom });
        console.log(error);
      }
    };
    getMediaMovie();
  }, [TvId]);
  return (
    <div className="singleMediaContainer">
      <div className="mediaPic">
        <img
          src={`https://image.tmdb.org/t/p/original/${tv.poster_path}`}
          alt="tv Poster"
        />
      </div>
      <div className="mediaContent">
        <h1 style={{ lineHeight: "1" }}>
          {tv?.name} : {tv?.tagline}
        </h1>
        <p style={{ color: "gray", fontSize: "15px" }}>{tv.type}</p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span>{(tv.vote_average / 2).toPrecision(2)}</span>
          <Rating
            initialRating={tv.vote_average / 2}
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
            <p style={{ color: "gray" }}>Language</p>
            <p>English</p>
            {/* <p>{tv.original_language}</p> */}
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "150px" }}
          >
            <p style={{ color: "gray" }}>First Air</p>
            <p>{`${tv.first_air_date}`}</p>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "150px" }}
          >
            <p style={{ color: "gray" }}> Last Air</p>
            <p>{tv.last_air_date}</p>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "150px" }}
          >
            <p style={{ color: "gray" }}>Status</p>
            <p>{tv.status}</p>
          </div>
        </div>
        <div>
          <h2>Genres</h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            {tv.genres?.map((genre) => (
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
          <p style={{ fontSize: "14px" }}>{tv.overview}</p>
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
            onClick={() => window.open(tv.homepage, "_blank")}
          >
            Website <FaLink />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Tv;
