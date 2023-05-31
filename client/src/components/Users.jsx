import React, { useState, useEffect, useRef, useCallback } from "react";
import User from "./User";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import { userChats } from "../services/chat";
const Users = ({ setChats }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [_userChats, _setUserChats] = useState();
    const [search, setSearch] = useState("");
    const [notInChatUsers, setNotInChatUsers] = useState([]);
    const { currentUser } = useUser();
    const filteredUsers = notInChatUsers?.filter((user) =>
        user.did.includes(search)
    );

    useEffect(() => {
        (async () => {
            const allusers = await axios.get(
                "http://localhost:8000/api/v1/user"
            );
            const filteredUsers = allusers?.data?.filter(
                (user) => user._id !== currentUser?._id
            );
            console.log("all users", filteredUsers);
            const allChats = await userChats(currentUser?._id);
            let members = [];
            allChats?.data?.map((chat) => {
                console.log("chat", chat);
                members = [...members, ...chat.members];
            });
            console.log("members", members);
            const _notInChat = filteredUsers?.filter(
                (user) => !members?.includes(user._id)
            );
            setNotInChatUsers(_notInChat);
            console.log("not in chat", _notInChat);
        })();
    }, []);
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
    return (
        <div className="ml-10">
            <div className="flex flex-col gap-2 shadow-lg max-w-fit items-center ml-10 mt-10">
                <input
                    type="text"
                    placeholder="Search Friend..."
                    className="border-2 border-gray-300 rounded-lg p-2"
                    value={search}
                    onChange={(e) => {
                        handleSearch(e);
                    }}
                />
                <div>
                    {filteredUsers?.length ? (
                        filteredUsers.map((user, index) => (
                            <div
                                className="p-4 text-white"
                                key={index}
                                onClick={() => {}}
                            >
                                <User setChats={setChats} data={user} />
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-200 p-2 rounded-lg cursor-pointer">
                            No Users to Connect
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;
