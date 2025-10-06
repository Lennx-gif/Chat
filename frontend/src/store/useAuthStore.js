import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';
// Remove useNavigate import and usage in the store
export const useAuthStore = create((set) => ({
    
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,

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
            // Remove navigation from the store; handle it in the component after signup returns true
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
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in logout. Please try again.");
            console.log("Error in logout",error);
        }
    },

    updateProfile: async(data) =>{
        set({isUpdatingProfile:true});
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in updating profile. Please try again.");
            console.log("Error in updateProfile",error);
        } finally{
            set({isUpdatingProfile:false});
        }
    },
    
}));