import "./App.css";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DangKy from "./pages/DangKyPage";
import DangNhap from "./pages/DangNhapPage";
import AdminPage from "./pages/AdminPage";
import Demo from "./pages/Demo";
import ReportPage from "./pages/ReportPage";
import MusicPage from "./pages/MusicPage";
import SellPage from "./pages/SellPage";
import MusicPlayer from "./pages/components/music/MusicPlayer";
import StaffPage from "./pages/StaffPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="dang-ky" element={<DangKy />} />
          <Route path="dang-nhap" element={<DangNhap />} />
          <Route path="admin" element={<AdminPage />}>
            <Route index element={<SellPage />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="music" element={<MusicPage />} />
            {/* <Route path="music" element={<MusicPlayer />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
