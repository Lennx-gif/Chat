import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore"
import { Camera, User, Mail } from "lucide-react" // Added Mail import

const ProfilePage = () => {
  const  {authUser,isUpdatingProfile,updateProfile} = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null); // <-- Fix here

  const handleImageUpload = async(e) =>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async() =>{
      const base64Image= reader.result;
      setSelectedImg(base64Image);
      await updateProfile({profilePic:base64Image});
    }
  }

  // If authUser is null, show a loader or message
  if (!authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-2 mb-8">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-base-content/60">Your profile information and settings</p>
        </div>

        {/* Avatar Upload Functionality */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative group">
            <img
              src={selectedImg || authUser.profilePicture || "/user.png"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 border-base-300 shadow-xl"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 
                         bg-primary hover:scale-110 
                         p-2.5 rounded-full cursor-pointer 
                         transition-all duration-200 shadow-lg
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
          <p className="text-sm text-base-content/60">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <User className="w-4 h-4"/>
              Full Name
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
          </div>
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <Mail className="w-4 h-4"/>
              Email Address
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
          </div> 
        </div>
        <div className="mt-6 bg-base-300 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage