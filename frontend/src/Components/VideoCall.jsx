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
import React, { useState } from "react";

import "./style.css";
import { Stack } from "@mui/material";

export const Basics = ({ appId, channel, token }) => {
    const [calling, setCalling] = useState(true);
    const isConnected = useIsConnected();
    // const [appId, setAppId] = useState("");
    // const [channel, setChannel] = useState("");
    // const [token, setToken] = useState("");

    useJoin(
        { appid: appId, channel: channel, token: token ? token : null },
        calling
    );
    //local user
    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);
    usePublish([localMicrophoneTrack, localCameraTrack]);
    //remote users
    const remoteUsers = useRemoteUsers();

    return (
        <>
            <Stack className="room">
                <Stack className="user-list">
                    <Stack
                        height={"180px"}
                        sx={{
                            borderRadius: "8px",
                            boxShadow:
                                "0 4px 8px rgba(0, 0, 0, 0.1)" /* Add shadow for card effect */,
                            backgroundColor: "#fff",
                            padding: "8px",
                            width: "100%",
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
                        </LocalUser>
                    </Stack>
                    {remoteUsers.map((user) => (
                        <Stack
                            sx={{
                                borderRadius: "8px",
                                boxShadow:
                                    "0 4px 8px rgba(0, 0, 0, 0.1)" /* Add shadow for card effect */,
                                backgroundColor: "#fff",
                                padding: "8px",
                                width: "100%",
                                height: "180px",
                            }}
                            // className="user"
                            key={user.uid}
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
                            </RemoteUser>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
            {/* {isConnected && (
                <div className="control">
                    <div className="left-control">
                        <button
                            className="btn"
                            onClick={() => setMic((a) => !a)}
                        >
                            <i
                                className={`i-microphone ${
                                    !micOn ? "off" : ""
                                }`}
                            />
                        </button>
                        <button
                            className="btn"
                            onClick={() => setCamera((a) => !a)}
                        >
                            <i
                                className={`i-camera ${!cameraOn ? "off" : ""}`}
                            />
                        </button>
                    </div>
                    <button
                        className={`btn btn-phone ${
                            calling ? "btn-phone-active" : ""
                        }`}
                        onClick={() => setCalling((a) => !a)}
                    >
                        {calling ? (
                            <i className="i-phone-hangup" />
                        ) : (
                            <i className="i-mdi-phone" />
                        )}
                    </button>
                </div>
            )} */}
        </>
    );
};

export default Basics;
