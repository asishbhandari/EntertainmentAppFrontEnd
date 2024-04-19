import React from "react";

import { MdLocalMovies } from "react-icons/md";
import { PiTelevisionFill } from "react-icons/pi";
import { FaCirclePlay } from "react-icons/fa6";
import BookmarkComponent from "./BookmarkComponent";
import { Link } from "react-router-dom";

const MediaCard = ({ id, isTrending, mediaPhoto, year, type, title }) => {
  return (
    <div className={isTrending ? "trendingCard" : "mediaCard"}>
      <div className="mediaImg">
        <img src={mediaPhoto} alt={`${title}`} />
      </div>
      <BookmarkComponent
        id={id}
        mediaPhoto={mediaPhoto}
        year={year}
        type={type}
        title={title}
      />
      <div className="mediaCardInfo">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "24px",
            gap: "6px",
          }}
        >
          <p>{year?.slice(0, 4)}</p>
          <span className="point"></span>
          <div style={{ display: "flex", alignItems: "center" }}>
            {type === "movie" ? (
              <MdLocalMovies style={{ scale: "0.5" }} />
            ) : (
              <PiTelevisionFill style={{ scale: "0.5" }} />
            )}
            <p>{type}</p>
          </div>
          <span className="point"></span>

          <p>PG</p>
        </div>
        <span>{title}</span>
      </div>
      <Link
        to={type === "movie" ? `/movie/:${id}` : `/tvShow/:${id}`}
        className="link"
      >
        <div className="play">
          <FaCirclePlay />
          <span>Play</span>
        </div>
      </Link>
    </div>
  );
};

export default MediaCard;
