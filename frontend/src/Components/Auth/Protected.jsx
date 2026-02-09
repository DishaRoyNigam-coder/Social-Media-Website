import React, { useEffect } from "react";
import { isTokenExpired } from "./jwt.js";
import { useNavigate } from "react-router-dom";

export default function Protected({ Component }) {
    const nav = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || isTokenExpired()) {
            nav("/auth");
        }
    }, [nav]);

    const token = localStorage.getItem("token");
    if (!token || isTokenExpired()) {
        return null;
    }

    return <Component />;
}
