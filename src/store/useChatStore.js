import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { encryptText, decryptText, getDirectChatSecret, getGroupChatSecret } from "../lib/encryption";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    groups: [],
    selectedUser: null,
    selectedGroup: null,
    isLoadingMessages: false,
    isLoadingUsers: false,
    isLoadingGroups: false,
    filter: "",
    setFilter: (value) => set({ filter: value }),
    activeTab: "chats",
    isDiscoverMode: false,
    setActiveTab: (activeTab) => set({ activeTab }),
    setIsDiscoverMode: (isDiscoverMode) => set({ isDiscoverMode }),

    getUsers: async () => {
        set({ isLoadingUsers: true });
        try {
            const response = await axiosInstance.get("/messages/users");
            const users = response.data.data || response.data;
            if (!Array.isArray(users)) {
                throw new Error("Invalid users data format from server");
            }
            set({ users });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load users");
            set({ users: [] });
            console.log("Error in getUsers", error);
        } finally {
            set({ isLoadingUsers: false });
        }
    },

    getGroups: async () => {
        set({ isLoadingGroups: true });
        try {
            const response = await axiosInstance.get("/groups");
            const groups = response.data.data || [];
            set({ groups });
        } catch (error) {
            console.error("Error in getGroups:", error);
            toast.error("Failed to load groups");
        } finally {
            set({ isLoadingGroups: false });
        }
    },

    getMessages: async (userToChatId) => {
        set({ isLoadingMessages: true });
        try {
            if (!userToChatId) throw new Error("Invalid user ID");
            
            const response = await axiosInstance.get(`/messages/users/${userToChatId}`);
            const rawMessages = response.data.data || response.data;
            
            const myId = useAuthStore.getState().authUser._id;
            const secret = getDirectChatSecret(myId, userToChatId);
            
            const decryptedMessages = await Promise.all(
                (Array.isArray(rawMessages) ? rawMessages : []).map(async (msg) => ({
                    ...msg,
                    text: await decryptText(msg.text, secret),
                }))
            );
            
            set({ messages: decryptedMessages });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load messages");
            set({ messages: [] });
            console.log("Error in getMessages", error);
        } finally {
            set({ isLoadingMessages: false });
        }
    },

    getGroupMessages: async (groupId) => {
        set({ isLoadingMessages: true });
        try {
            if (!groupId) throw new Error("Invalid group ID");
            
            const response = await axiosInstance.get(`/groups/${groupId}/messages`);
            const rawMessages = response.data.data || response.data;
            
            const secret = getGroupChatSecret(groupId);
            
            const decryptedMessages = await Promise.all(
                (Array.isArray(rawMessages) ? rawMessages : []).map(async (msg) => ({
                    ...msg,
                    text: await decryptText(msg.text, secret),
                }))
            );
            
            set({ messages: decryptedMessages });
        } catch (error) {
            console.error("Error in getGroupMessages:", error);
            toast.error("Failed to load group messages");
            set({ messages: [] });
        } finally {
            set({ isLoadingMessages: false });
        }
    },

    sendMessage: async (msgdata) => {
        const { selectedUser, messages } = get();
        const myId = useAuthStore.getState().authUser._id;
        
        if (!selectedUser) {
            toast.error("Please select a user to message");
            return;
        }
        
        try {
            // Client-side E2E Encryption
            const secret = getDirectChatSecret(myId, selectedUser._id);
            const encryptedText = await encryptText(msgdata.text, secret);
            
            const payload = {
                ...msgdata,
                text: encryptedText
            };

            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, payload);
            const newMessage = res.data.data || res.data;
            
            if (!newMessage || !newMessage._id) {
                throw new Error("Invalid message received from server");
            }
            
            const decryptedNewMsg = {
                ...newMessage,
                text: msgdata.text // Show original unencrypted text locally
            };
            
            set({ messages: [...messages, decryptedNewMsg] });
            return decryptedNewMsg;
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Failed to send message";
            toast.error(errorMsg);
            console.log("Error in sendMessage", error);
            throw error;
        }
    },

    sendGroupMessage: async (msgdata) => {
        const { selectedGroup, messages } = get();
        
        if (!selectedGroup) {
            toast.error("Please select a group to message");
            return;
        }
        
        try {
            // Client-side E2E Encryption
            const secret = getGroupChatSecret(selectedGroup._id);
            const encryptedText = await encryptText(msgdata.text, secret);
            
            const payload = {
                ...msgdata,
                text: encryptedText
            };

            const res = await axiosInstance.post(`/groups/${selectedGroup._id}/send`, payload);
            const newMessage = res.data.data;
            
            const decryptedNewMsg = {
                ...newMessage,
                text: msgdata.text // Show original unencrypted text locally
            };
            
            set({ messages: [...messages, decryptedNewMsg] });
            return decryptedNewMsg;
        } catch (error) {
            console.error("Error in sendGroupMessage:", error);
            toast.error("Failed to send group message");
            throw error;
        }
    },

    createGroup: async (groupData) => {
        try {
            const res = await axiosInstance.post("/groups", groupData);
            const newGroup = res.data.data;
            set({ groups: [newGroup, ...get().groups] });
            toast.success("Group created successfully!");
            return newGroup;
        } catch (error) {
            console.error("Error in createGroup:", error);
            toast.error(error?.response?.data?.message || "Failed to create group");
            return null;
        }
    },

    searchUsersOnPlatform: async (query) => {
        try {
            const res = await axiosInstance.get(`/users/search?query=${encodeURIComponent(query)}`);
            return res.data.data || [];
        } catch (error) {
            console.error("Error in searchUsersOnPlatform:", error);
            toast.error("Failed to search users");
            return [];
        }
    },

    connectUser: async (userId) => {
        try {
            const res = await axiosInstance.post("/users/chatlist/add", { userId });
            if (res.data.success) {
                toast.success(res.data.message || "Connected successfully!");
                await get().getUsers(); // Refresh contacts
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error in connectUser:", error);
            toast.error(error?.response?.data?.message || "Failed to connect");
            return false;
        }
    },

    disconnectUser: async (userId) => {
        try {
            const res = await axiosInstance.delete(`/users/chatlist/remove/${userId}`);
            if (res.data.success) {
                toast.success(res.data.message || "Disconnected successfully!");
                if (get().selectedUser?._id === userId) {
                    set({ selectedUser: null });
                }
                await get().getUsers(); // Refresh contacts
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error in disconnectUser:", error);
            toast.error(error?.response?.data?.message || "Failed to disconnect");
            return false;
        }
    },

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");
        socket.off("newGroupMessage");

        socket.on("newMessage", async (newMessage) => {
            const currentSelectedUser = get().selectedUser;
            if (!currentSelectedUser) return;
            if (newMessage.senderId !== currentSelectedUser._id && newMessage.receiverId !== currentSelectedUser._id) return;
            
            const myId = useAuthStore.getState().authUser._id;
            const secret = getDirectChatSecret(myId, currentSelectedUser._id);
            const decryptedMsg = {
                ...newMessage,
                text: await decryptText(newMessage.text, secret),
            };
            
            set({
                messages: [...get().messages, decryptedMsg],
            });
        });

        socket.on("newGroupMessage", async (newGroupMessage) => {
            const currentSelectedGroup = get().selectedGroup;
            if (!currentSelectedGroup) return;
            if (newGroupMessage.groupId !== currentSelectedGroup._id) return;
            
            const secret = getGroupChatSecret(currentSelectedGroup._id);
            const decryptedMsg = {
                ...newGroupMessage,
                text: await decryptText(newGroupMessage.text, secret),
            };
            
            set({
                messages: [...get().messages, decryptedMsg],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
            socket.off("newGroupMessage");
        }
    },

    setSelectedUser: (userOrId) => {
        if (!userOrId) {
            set({ selectedUser: null });
            return;
        }
        const { users } = get();
        const userId = typeof userOrId === "object" ? userOrId._id : userOrId;
        const userObj = typeof userOrId === "object" ? userOrId : users.find(u => u._id === userId);
        if (!userObj) {
            console.warn(`User ${userId} not found in users list`);
            return;
        }
        set({ selectedUser: userObj, selectedGroup: null });
    },

    setSelectedGroup: (group) => {
        set({ selectedGroup: group, selectedUser: null });
    },
    
    getFilteredUsers: () => {
        const { users, filter, selectedUser } = get();
        const q = (filter || '').trim().toLowerCase();

        return users.filter((u) => {
            if (!u) return false;
            if (selectedUser && u._id === selectedUser._id) return false;
            if (!q) return true;
            const hay = `${u.fullName || ''} ${u.email || ''}`.toLowerCase();
            return hay.includes(q);
        });
    },
}));