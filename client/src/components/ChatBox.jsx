import React, {
    useCallback,
    useDeferredValue,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { getUser } from "../services/user";
import { addMessage, getMessages } from "../services/message";
import { useSocket } from "../contexts/SocketContext";
import { formatDid } from "../utils";
import { useChatBox } from "../hooks/useChatBox";
import { fetchMessages, getUserData } from "../helpers/api";
import { getDidDoc } from "../lib/src/kilt/didResolver";
import { useUser } from "../contexts/UserContext";
import { receiveMessage, sendMessage } from "../lib/src/didComm";
import { verifyMessageSignature } from "../lib/src/didComm/signing";

const ChatBox = ({
    chat,
    currentUser,
    recievedMessage,
    setRecievedMessage,
    peer,
}) => {
    const [connection, setConnection] = useState(null);
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [receiverDidDoc, setReceiverDidDoc] = useState({});
    const socket = useSocket();
    const _chat = useRef();
    const { currentUser: user } = useUser();

    const container = useRef();

    const Scroll = () => {
        const { offsetHeight, scrollHeight, scrollTop } = container.current;
        if (scrollHeight <= scrollTop + offsetHeight + 100) {
            container.current?.scrollTo(0, scrollHeight);
        }
    };

    useEffect(() => {
        Scroll();
    }, [messages]);

    const makeInitialCall = () => {
        const senderId = currentUser;
        const receiverId = chat?.members?.find((id) => id !== currentUser);
        socket.emit("send-user-to-call", { senderId, receiverId });
    };
    const connectPeer = useCallback((peerId) => {
        const conn = peer.connect(peerId);
        setConnection(conn);
        conn.on("open", () => {
            console.log("connection open");
        }); //this is working
    }, []);
    useEffect(() => {
        if (chat !== null) {
            _chat.current = chat;
        }
    }, [chat]);
    useEffect(() => {
        if (chat !== null) {
            (async () => {
                const receiverId = chat?.members?.find(
                    (id) => id !== currentUser
                );
                const _userData = await getUserData(receiverId);
                setUserData(_userData);
                const _messages = await fetchMessages(chat._id);
                setMessages(_messages);
                const { data } = await getUser(receiverId);
                const didDoc = await getDidDoc(data.did);
                console.log(user);
                setReceiverDidDoc(didDoc);
            })();
        }
    }, [chat?.members?.senderId, chat?._id]);
    useEffect(() => {
        if (chat !== null) {
            makeInitialCall();
        }
        socket.on("make-call", (peerId) => {
            connectPeer(peerId);
        });
        peer.on("connection", (conn) => {
            conn.on("data", async (data) => {
                // setRecievedMessage(JSON.parse(data));
                const _data = JSON.parse(data);
                const receiverId = _chat.current?.members?.find(
                    (id) => id !== currentUser
                );
                const { data: receiverData } = await getUser(receiverId);
                const didDoc = await getDidDoc(receiverData.did);
                const receiverPrivateKey = user?.keyAgreementPrivateKey;
                const senderPublicKey = didDoc?.keyAgreement[0].publicKey;
                const encryptedMsg = _data.encrypted;
                const nonce = _data.nonce;
                const signature = _data.signature;

                const decryptedMessage = await receiveMessage(
                    encryptedMsg,
                    receiverPrivateKey,
                    senderPublicKey,
                    nonce
                );

                const verifySignature = await verifyMessageSignature(
                    decryptedMessage,
                    signature
                );
                if (verifySignature) {
                    setRecievedMessage(decryptedMessage);
                } else {
                    console.log("signature not verified");
                }
            });
        });
    }, [chat?.members?.senderId, chat?._id]);
    // Listen for connection

    useEffect(() => {
        if (recievedMessage !== null && recievedMessage?.chatId === chat?._id) {
            setMessages([...messages, recievedMessage]);
        }
    }, [recievedMessage?.chatId, recievedMessage?.text]);

    const handleSend = async (e) => {
        e.preventDefault();
        const receiverPublicKey = receiverDidDoc?.keyAgreement[0].publicKey;
        const senderPrivateKey = user?.keyAgreementPrivateKey;
        const seed = user?.mnemonic;
        const senderDid = user?.did;
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id,
        };
        const { encrypted, nonce, signature } = await sendMessage(
            message,
            receiverPublicKey,
            senderPrivateKey,
            seed,
            senderDid
        );
        connection.send(JSON.stringify({ encrypted, nonce, signature }));

        // send message to database
        try {
            const { data } = await addMessage(message);
            setMessages([...messages, data]);
            setNewMessage("");
        } catch {
            console.log("error");
        }
    };
    return (
        <div
            ref={container}
            className="h-[700px] overflow-y-scroll rounded-md bg-gray-300 flex flex-col-reverse p-5 shadow-xl  "
        >
            {!chat ? (
                <div className="h-screen w-full justify-self-center bg-gray-300 text-center text-5xl rounded-md shadow-md">
                    Select a chat
                </div>
            ) : (
                <div>
                    <div>
                        {userData?.did ? formatDid(userData.did) : "Loading..."}
                    </div>
                    <div className="space-y-2">
                        {messages.map((message, id) => (
                            <div
                                key={id}
                                className={`${
                                    message?.senderId === currentUser
                                        ? "flex justify-end pr-5"
                                        : "flex justify-start"
                                }`}
                            >
                                <div>
                                    <span className="text-xs">
                                        {message?.senderId === currentUser
                                            ? "You"
                                            : "Other"}
                                    </span>
                                    <div
                                        className={`${
                                            message?.senderId === currentUser
                                                ? "bg-purple-500"
                                                : "bg-gray-500"
                                        } text-white p-2 rounded-lg`}
                                    >
                                        {message?.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <form className="space-y-2 mt-5" onSubmit={handleSend}>
                            <input
                                type="text"
                                className="border p-3 w-full rounded-md shadow-md"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                className="bg-blue-500 text-white float-right px-10 py-3 text-lg font-semibold rounded-lg"
                                type="submit"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
