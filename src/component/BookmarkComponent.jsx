import React from "react";
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { addBookmarkMedia, removeBookmarkMedia } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../constants";

const BookmarkComponent = ({ id, mediaPhoto, year, type, title }) => {
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.user?.bookmarkedMedia);

  const handledBookmark = async () => {
    const mediaBody = {
      mediaId: id,
      title: title,
      mediaType: type,
      mediaPhoto: mediaPhoto,
      releaseYear: parseInt(year?.slice(0, 4), 10),
    };
    try {
      const resp = await fetch(BASE_URL + "/v1/user/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(mediaBody),
      });
      if (!resp.ok) {
        throw new Error(`bookmarked not updated to database`);
      }
      if (bookmarks?.some((e) => e.mediaId === id)) {
        dispatch(removeBookmarkMedia(mediaBody));
      } else {
        dispatch(addBookmarkMedia(mediaBody));
      }
    } catch (error) {
      console.log("error updating bookmarked media :", error.message);
    }
  };

  return (
    <div className="bookmarkIcon" onClick={handledBookmark}>
      {bookmarks?.some((e) => e.mediaId === id) ? (
        <IoBookmark />
      ) : (
        <IoBookmarkOutline />
      )}
    </div>
  );
};

export default BookmarkComponent;
