import "./App.css";
import "./css/MediaCard.css";
import "./css/singleMediaPage.css";
import {
  createBrowserRouter,
  Route,
  Routes,
  RouterProvider,
} from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ErrorPage from "./pages/errorPage";
import { Outlet } from "react-router-dom";
import Bookmark from "./pages/Bookmark";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import Navbar from "./component/Navbar";
import UserInfo from "./pages/UserInfo";
import Movie from "./pages/Movie";
import Tv from "./pages/Tv";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return (
      <div className="containerWrapper RootContainer">
        <Navbar />
        <Outlet />
      </div>
    );
  } else return <Login />;
};

const router = createBrowserRouter([{ path: "*", Component: Root }]);

function Root() {
  return (
    <div>
      <Routes>
        <Route path="/" Component={ProtectedRoute} errorElement={<ErrorPage />}>
          <Route index path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TvShows />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="movie/:movieId" element={<Movie />} />
          <Route path="tvShow/:TvId" element={<Tv />} />
        </Route>
        <Route
          path="/signup"
          element={<SignUp />}
          errorElement={<ErrorPage />}
        />
        <Route path="/login" element={<Login />} errorElement={<ErrorPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
