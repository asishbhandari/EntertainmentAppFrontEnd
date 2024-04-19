import React, { useEffect, useState } from "react";
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { addBookmarkMedia } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../constants";

const BookmarkComponent = ({ id, mediaPhoto, year, type, title }) => {
  const dispatch = useDispatch();
  const bookmarkState = useSelector((state) => state.user.bookmarkedMedia);
  const [bookmark, setBookmark] = useState(false);
  let isBookmarked;
  if (bookmarkState) {
    isBookmarked = bookmarkState?.some((element) => element.mediaId === id);
  }
  // const [bookmark, setBookmark] = useState(false);

  const updateBookmarkMedia = async () => {
    try {
      const mediaBody = {
        mediaId: id,
        title: title,
        mediaType: type,
        mediaPhoto: mediaPhoto,
        releaseYear: parseInt(year?.slice(0, 4), 10),
      };
      const resp = await fetch(BASE_URL + "/v1/user/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(mediaBody),
      });
      const data = await resp.json();
      dispatch(addBookmarkMedia(data.bookmarkedMedia));
    } catch (error) {
      console.log("error updating bookmarked media :", error.message);
    }
  };
  const handledBookmark = () => {
    setBookmark(!bookmark);
    updateBookmarkMedia();
  };

  useEffect(() => {
    isBookmarked ? setBookmark(true) : setBookmark(false);
  }, [isBookmarked]);
  return (
    <div className="bookmarkIcon" onClick={handledBookmark}>
      {bookmark ? <IoBookmark /> : <IoBookmarkOutline />}
    </div>
  );
};

export default BookmarkComponent;
