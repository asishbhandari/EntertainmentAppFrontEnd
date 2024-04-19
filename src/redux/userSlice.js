import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  profilePicture: "",
  billingAddress: {},
  bookmarkedMedia: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.firstName = action.payload?.firstName;
      state.lastName = action.payload?.lastName;
      state.profilePicture = action.payload?.profilePicture;
      state.billingAddress = action.payload?.billingAddress;
      state.bookmarkedMedia = action.payload?.bookmarkedMedia;
    },
    addEmail: (state, action) => {
      state.email = action.payload;
    },
    addProfilePhoto: (state, action) => {
      state.profilePicture = action.payload;
    },
    addBookmarkMedia: (state, action) => {
      state.bookmarkedMedia = action.payload;
    },
    clearState: (state, action) => {
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.profilePicture = "";
      state.billingAddress = "";
      state.bookmarkedMedia = "";
    },
  },
});

export const {
  updateUser,
  addEmail,
  clearState,
  addProfilePhoto,
  addBookmarkMedia,
} = userSlice.actions;
export default userSlice.reducer;
