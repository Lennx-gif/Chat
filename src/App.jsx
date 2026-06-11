import { Routes,Route } from "react-router-dom";
import AppHeader from "./components/AppHeader.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useChatStore } from "./store/useChatStore.js";
import BottomNav from "./components/BottomNav.jsx";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore.js";


const App = () => {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();
  const {selectedUser, selectedGroup} = useChatStore();

  const {theme} = useThemeStore();
  useEffect(() => {
    checkAuth();
  },[checkAuth]);
  console.log({authUser});

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-11 animate-spin"/>
      </div>
    );
  }

  const isChatOpen = selectedUser || selectedGroup;

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100 flex flex-col">
      <div className={`${isChatOpen ? "hidden md:block" : "block"}`}>
        <AppHeader />
      </div>
      <div className="flex-1 flex flex-col min-h-0 pb-20 md:pb-0">
        <Routes>
        <Route path="/" element={ authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/>: <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>

      </Routes>
      </div>
      {authUser && <BottomNav />}
      <Toaster/>
    </div>
    
  )
};

export default App;