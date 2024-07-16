import { useSelector } from "react-redux";
import SocketContext from "../../context/SocketContext";
import "./Results.css";
import React, { useContext, useEffect, useState } from "react";
const Results = ({users}) => {
    
    return (
        <div className="screen">
            <span className="result-header">Results</span>
            {users
                .sort((a, b) => {
                    return b.points - a.points;
                })
                .map((user, i) => {
                    return (
                        <div className="individual-result" key={i}>
                            <span key={i} className="r-span">
                                <span>{user.name} </span>
                                <span>{user.points} Points</span>
                            </span>
                        </div>
                    );
                })}
        </div>
    );
};

export default Results;
