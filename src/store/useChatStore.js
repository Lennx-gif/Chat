import {create} from "zustand";
import  toast from "react-hot-toast"; 
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

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
            // Backend returns { success: true, message: "...", data: [...] }
            set({users: response.data.data || response.data});
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Failed to load users");
            console.log("Error in getUsers",error);
        }
        finally{
            set({isLoadingUsers:false});
        }
    },

    getMessages: async(userToChatId) =>{
        set({isLoadingMessages:true});
        try{
            const response = await axiosInstance.get(`/messages/users/${userToChatId}`);
            // Backend returns { success: true, message: "...", data: [...] } or just [...]
            const messages = response.data.data || response.data;
            set({messages: Array.isArray(messages) ? messages : []});
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Failed to load messages");
        }
        finally{
            set({isLoadingMessages:false});
        }
    },
    sendMessage: async(msgdata)=> {
        const {selectedUser,messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,msgdata);
            // Backend returns the message object directly or wrapped in data
            const newMessage = res.data.data || res.data;
            set({messages:[...messages,newMessage]});
            return newMessage;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send message");
            console.log("Error in sendMessage",error);
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if(socket) socket.off("newMessage");
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