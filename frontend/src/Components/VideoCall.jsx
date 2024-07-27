import React, { useState } from "react";
import {
    LocalUser,
    RemoteUser,
    useIsConnected,
    useJoin,
    useLocalMicrophoneTrack,
    useLocalCameraTrack,
    usePublish,
    useRemoteUsers,
} from "agora-rtc-react";
import "./style.css";
import { Stack } from "@mui/material";

export const Basics = ({ appId, channel, token }) => {
    const [calling, setCalling] = useState(true);
    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);

    // State for remote users controls
    const [remoteUsersStatus, setRemoteUsersStatus] = useState({});

    const isConnected = useIsConnected();
    useJoin(
        { appid: appId, channel: channel, token: token ? token : null },
        calling
    );
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn, {
        audioOptions: { echoCancellation: true },
    });
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);
    usePublish([localMicrophoneTrack, localCameraTrack]);
    const remoteUsers = useRemoteUsers();

    // Function to toggle microphone and camera for remote users
    const toggleUserControl = (uid, controlType) => {
        setRemoteUsersStatus((prevState) => ({
            ...prevState,
            [uid]: {
                ...prevState[uid],
                [controlType]: !prevState[uid]?.[controlType],
            },
        }));
    };

    // Function to mute/unmute or disable/enable video for remote users
    const handleUserAction = async (uid, action) => {
        // Find the remote user
        const user = remoteUsers.find((user) => user.uid === uid);
        if (!user) return;

        try {
            // Access remote user’s tracks
            const remoteAudioTrack = user.audioTrack;
            const remoteVideoTrack = user.videoTrack;

            switch (action) {
                case "mute":
                    if (remoteAudioTrack) {
                        // Mute or unmute remote user
                        await remoteAudioTrack.setEnabled(
                            !remoteUsersStatus[uid]?.mute
                        );
                    }
                    break;
                case "video":
                    if (remoteVideoTrack) {
                        // Enable or disable video for remote user
                        await remoteVideoTrack.setEnabled(
                            !remoteUsersStatus[uid]?.video
                        );
                    }
                    break;
                default:
                    break;
            }

            // Update local state
            toggleUserControl(uid, action);
        } catch (error) {
            alert(`Error handling user action: ${error}`);
        }
    };

    return (
        <>
            <Stack className="room">
                <Stack className="user-list">
                    <Stack
                        height={"180px"}
                        className="local-user-container"
                        sx={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#fff",
                            padding: "8px",
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        <LocalUser
                            style={{
                                height: "100%",
                                minHeight: "100%",
                            }}
                            audioTrack={localMicrophoneTrack}
                            cameraOn={cameraOn}
                            micOn={micOn}
                            videoTrack={localCameraTrack}
                            cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                        >
                            <samp className="user-name">You</samp>
                            {
                                <div className="local-controls">
                                    <button
                                        onClick={() => setMic((prev) => !prev)}
                                    >
                                        {micOn ? "Mute" : "Unmute"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            setCamera((prev) => !prev)
                                        }
                                    >
                                        {cameraOn
                                            ? "Disable Video"
                                            : "Enable Video"}
                                    </button>
                                </div>
                            }
                        </LocalUser>
                    </Stack>
                    {remoteUsers.map((user) => (
                        <Stack
                            key={user.uid}
                            className="remote-user-container"
                            sx={{
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#fff",
                                padding: "8px",
                                width: "100%",
                                height: "180px",
                                position: "relative",
                            }}
                        >
                            <RemoteUser
                                style={{
                                    height: "100%",
                                    minHeight: "100%",
                                }}
                                cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                                user={user}
                            >
                                <samp className="user-name">{user.uid}</samp>
                                <div className="controls">
                                    <button
                                        onClick={() =>
                                            handleUserAction(user.uid, "mute")
                                        }
                                    >
                                        {remoteUsersStatus[user.uid]?.mute
                                            ? "Unmute"
                                            : "Mute"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleUserAction(user.uid, "video")
                                        }
                                    >
                                        {remoteUsersStatus[user.uid]?.video
                                            ? "Disable Video"
                                            : "Enable Video"}
                                    </button>
                                </div>
                            </RemoteUser>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
        </>
    );
};

export default Basics;
