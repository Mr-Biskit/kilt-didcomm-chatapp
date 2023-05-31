import React, { useState, useEffect } from "react";
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
    const filteredUsers = notInChatUsers.filter((user) =>
        user.did.includes(search)
    );
    const getAllUsers = async () => {
        axios.get("http://localhost:8000/api/v1/user").then((res) => {
            const filterCurrrUser = res.data.filter(
                (user) => user._id !== currentUser?._id
            );

            setAllUsers(filterCurrrUser);
        });
    };

    const getChats = async () => {
        try {
            const { data } = await userChats(currentUser?._id);
            data?.map((chat) => {
                _setUserChats(chat);
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getAllUsers();
        getChats();
    }, []);

    useEffect(() => {
        const notInChat = allUsers.filter(
            (user) => !_userChats?.includes(user._id)
        );
        console.log(notInChat);
        setNotInChatUsers(notInChat);
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
    return (
        <div className="ml-10">
            <div className="flex flex-col gap-2 shadow-lg max-w-fit mt-10">
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
                    {filteredUsers.length ? (
                        filteredUsers.map((user, index) => (
                            <div
                                key={index}
                                className="bg-gray-200 p-2 rounded-lg cursor-pointer space-y-3"
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
