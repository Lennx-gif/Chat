import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, User, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  if (!authUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/50 backdrop-blur-xl relative overflow-y-auto pb-10">
      {/* Mobile Header Back Button */}
      <div className="flex md:hidden items-center gap-4 mb-4 px-4 py-3 border-b border-base-content/5 bg-base-100/30 backdrop-blur-md sticky top-0 z-30">
        <Link to="/" className="size-10 flex items-center justify-center rounded-2xl bg-base-content/5 text-base-content/60 hover:bg-base-content/10 transition-all">
          <ArrowLeft className="size-5" />
        </Link>
        <span className="font-black uppercase tracking-wider text-xs text-base-content/70">Back to Chats</span>
      </div>

      <div className="max-w-2xl mx-auto p-4 py-8 md:pt-28">
        <Card className="border border-base-content/5 mb-8">
          <CardHeader className="text-center md:text-left">
            <CardTitle className="text-2xl font-black">Profile</CardTitle>
            <CardDescription>Your personal profile details and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Avatar Upload Functionality */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <img
                  src={selectedImg || authUser.profilePicture || "/user.png"}
                  alt="Profile"
                  className="size-32 rounded-3xl object-cover border-2 border-primary/20 shadow-xl group-hover:border-primary/40 transition-colors"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute -bottom-2 -right-2 
                             bg-primary hover:scale-115 
                             p-3 rounded-2xl cursor-pointer 
                             transition-all duration-200 shadow-lg shadow-primary/20
                             ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                          `}
                >
                  <Camera className="w-5 h-5 text-primary-content"/>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest text-center max-w-[200px]">
                {isUpdatingProfile ? "Uploading..." : "Click camera badge to update profile picture"}
              </p>
            </div>

            {/* Inputs list */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary/60"/>
                  Full Name
                </div>
                <div className="w-full bg-base-content/5 border border-base-content/5 rounded-2xl py-3.5 px-4 text-sm font-semibold text-base-content">
                  {authUser?.fullName}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary/60"/>
                  Email Address
                </div>
                <div className="w-full bg-base-content/5 border border-base-content/5 rounded-2xl py-3.5 px-4 text-sm font-semibold text-base-content">
                  {authUser?.email}
                </div>
              </div> 
            </div>
          </CardContent>
        </Card>

        {/* Account Info Card */}
        <Card className="border border-base-content/5">
          <CardHeader>
            <CardTitle className="text-lg font-black">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between py-3 border-b border-base-content/5 font-semibold text-base-content/70">
              <span>Member Since</span>
              <span className="font-bold text-base-content">{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-3 font-semibold text-base-content/70">
              <span>Account Status</span>
              <span className="font-bold text-green-500 flex items-center gap-1.5">
                <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                Active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;