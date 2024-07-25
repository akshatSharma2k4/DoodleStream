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
    const [localUserControlsVisible, setLocalUserControlsVisible] =
        useState(false);

    const isConnected = useIsConnected();
    useJoin(
        { appid: appId, channel: channel, token: token ? token : null },
        calling
    );
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
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
    const handleUserAction = (uid, action) => {
        // Here you would use Agora's API to mute/unmute or disable/enable video for the specific user
        // Example: remoteUser.audioTrack.setEnabled(action === "mute" ? false : true);

        toggleUserControl(uid, action);
    };

    return (
        <>
            <Stack className="room">
                <Stack className="user-list">
                    <Stack
                        height={"180px"}
                        sx={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#fff",
                            padding: "8px",
                            width: "100%",
                            position: "relative",
                        }}
                        onMouseEnter={() => setLocalUserControlsVisible(true)}
                        onMouseLeave={() => setLocalUserControlsVisible(false)}
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
                            {localUserControlsVisible && (
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
                            )}
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
            {/* Removed control buttons for local user from here */}
        </>
    );
};

export default Basics;
