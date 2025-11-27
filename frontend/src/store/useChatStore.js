import {create} from "zustand";
import  toast from "react-hot-toast"; 
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isLoadingMessages: false,
    isLoadingUsers: false,
    filter : "",
    setFilter:(value) => set({filter:value}),


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
    sendMessage: async(msgdata)=> {
        const {selectedUser,messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,msgdata);
            set({messages:[...messages,res.data.message]});
            const newMessage = res.data.message;
            set({messages:[...messages,newMessage]});
            return newMessage;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send message");
            console.log("Error in sendMessage",error);
        }
    },
    //Optimize Later!!!!!!!!!!!!!!!!!!!!
    setSelectedUser: (userId) => set({selectedUser:userId}),  
    
    getFilteredUsers: () => {
    const { users, filter, selectedUser } = get();
    const q = (filter || '').trim().toLowerCase();

    return users.filter((u) => {
      if (!u) return false;
      // exclude currently selected user
      if (selectedUser && u._id === selectedUser._id) return false;
      if (!q) return true;
      // search in fullName and email
      const hay = `${u.fullName || ''} ${u.email || ''}`.toLowerCase();
      return hay.includes(q);
    });
  },
}));