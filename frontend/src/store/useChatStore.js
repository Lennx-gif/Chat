import {create} from "zustand";
import  toast from "react-hot-toast"; 
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isLoadingMessages: false,
    isLoadingUsers: false,


    getUsers: async() =>{
        set({isLoadingUsers:true});   
        try{
            const response = await axiosInstance.get("/messages/users");
            set({users:response.data.users});
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Failed to load users");
            console.log("Error in getUsers",error);
           // set({isLoadingUsers:false});
        }
        finally{
            set({isLoadingUsers:false});
        }
    },

    getMessages: async(userId) =>{
        set({isLoadingMessages:true,selectedUser:userId});
        try{
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({messages:response.data.messages});
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Failed to load messages");
            //console.log("Error in getMessages",error);
        }
        finally{
            set({isLoadingMessages:false});
        }
    },
    //Optimize Later!!!!!!!!!!!!!!!!!!!!
    setSelectedUser: (userId) => set({selectedUser:userId}),    
}));