import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';
import {io} from 'socket.io-client';


const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
// Remove useNavigate import and usage in the store
export const useAuthStore = create((set,get) => ({
    
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth :async() =>{
        try {
            const res = await axiosInstance("/auth/check");

            set ({authUser:res.data})
        } catch (error) {
            console.log("Error in CheckAuth",error);
            set ({authUser:null})
            
        } finally {
            set({isCheckingAuth:false})
        }
    },
    

    signup : async(data) => {
        set({isSigningUp:true});
        try {
            const res= await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Signup Successful! You can now log in.");
            get.connectSocket();
            return true;    
            
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in signup. Please try again.");
            console.log("Error in signup",error);
        }finally{
                set({isSigningUp:false});
        }
    },
    login : async(data) =>{
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Login Successful!");
            get().connectSocket();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in login. Please try again.");
        } finally{
            set({isLoggingIn:false});
        }
    },
    logout : async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in logout. Please try again.");
            console.log("Error in logout",error);
        }
        
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            // set the updated user in the store
            set({ authUser: res.data });
            toast.success("Profile updated");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error updating profile");
            console.error("Error updateProfile", error);
            return false;
        } finally {
            set({ isUpdatingProfile: false });
        }
    },


    connectSocket: () => {

        const {authUser} = get();
        if(!authUser|| get().socket?.connected) return;
        const socket = io(BASE_URL)
        socket.on("connect", () => {
            console.log("Connected to socket server with ID:", socket.id);
        });
        set({socket});
    },
    disconnectSocket:() => {
        const {socket} = get();
        if(socket && socket.connected){
            socket.disconnect();
            set({socket:null});
            console.log("Socket disconnected");
        }
    },
    
}));