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
            const users = response.data.data || response.data;
            
            if (!Array.isArray(users)) {
                throw new Error("Invalid users data format from server");
            }
            
            set({users: users});
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Failed to load users");
            set({users: []}); // Clear users on error
            console.log("Error in getUsers",error);
        }
        finally{
            set({isLoadingUsers:false});
        }
    },

    getMessages: async(userToChatId) =>{
        set({isLoadingMessages:true});
        try{
            if (!userToChatId) {
                throw new Error("Invalid user ID");
            }
            
            const response = await axiosInstance.get(`/messages/users/${userToChatId}`);
            // Backend returns { success: true, message: "...", data: [...] } or just [...]
            const messages = response.data.data || response.data;
            set({messages: Array.isArray(messages) ? messages : []});
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Failed to load messages");
            set({messages: []}); // Clear messages on error
            console.log("Error in getMessages",error);
        }
        finally{
            set({isLoadingMessages:false});
        }
    },
    sendMessage: async(msgdata)=> {
        const {selectedUser,messages} = get();
        
        if (!selectedUser) {
            toast.error("Please select a user to message");
            return;
        }
        
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,msgdata);
            // Backend returns the message object directly or wrapped in data
            const newMessage = res.data.data || res.data;
            
            if (!newMessage || !newMessage._id) {
                throw new Error("Invalid message received from server");
            }
            
            set({messages:[...messages,newMessage]});
            return newMessage;
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Failed to send message";
            toast.error(errorMsg);
            console.log("Error in sendMessage",error);
            throw error; // Re-throw for caller to handle
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if(!socket) return;

        // Remove existing listener to prevent duplicates
        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            const currentSelectedUser = get().selectedUser;
            // Accept messages from the selected user (both directions)
            if(newMessage.senderId !== currentSelectedUser?._id && newMessage.receiverId !== currentSelectedUser?._id) return;
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if(socket) socket.off("newMessage");
    },

    setSelectedUser: (userOrId) => {
        if (!userOrId) {
            set({selectedUser: null});
            return;
        }
        const {users} = get();
        const userId = typeof userOrId === "object" ? userOrId._id : userOrId;
        const userObj = typeof userOrId === "object" ? userOrId : users.find(u => u._id === userId);
        if(!userObj) {
            console.warn(`User ${userId} not found in users list`);
            return;
        }
        set({selectedUser: userObj});
    },
    
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