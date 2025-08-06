import Message from "../models/Message";

// Get all users except the logged-in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await user.find({ _id: { $ne: userId } }).select("-password");

        // Count the number of unread messages for each user
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }

        });
        await Promise.all(promises);

        res.json({ success: true, users: filteredUsers, unseenMessages });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
} 

// Get all messages for selected user
export const getMessages = async (req, res) => {
    try {
               const {id: selectedUserId}= req.params;
               const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        });
        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId },
            { $set: { seen: true } }
        );
        res.json({ success: true, messages });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// api to mark messages as seen using message id
export const markMessagesAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}
