import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OauthFinish: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const rawHash = window.location.hash.startsWith("#")
            ? window.location.hash.slice(1)
            : window.location.hash;

        const params = new URLSearchParams(rawHash);
        const rt = params.get("rt") ?? "";
        const at = params.get("at") ?? "";

        if (rt) {
            localStorage.setItem("refresh_token", rt)
        };

        if (at) {
            localStorage.setItem("jwt_token", at)
        };

        window.history.replaceState({}, "", "/oauth-finish");

        navigate("/dashboard", { replace: true });
    }, [navigate]);

    return <p>Finishing sign-in…</p>;
};

export default OauthFinish;
