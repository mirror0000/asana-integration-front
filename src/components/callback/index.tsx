import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useLocalStorage } from "../../hooks/useLocalstorage";
import withAuth from "../../hoc/with-auth-redirect";

const AsanaCallback: React.FC = () => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useLocalStorage("access_token", "");
    let [searchParams] = useSearchParams();
    const handleCallback = async () => {
        try {
            const result: any = await axios.get(
                `${
                    process.env.REACT_APP_BACKEND_API
                }/auth/callback?${searchParams.toString()}`
            );
            console.log('access_token', result.data.access_token);

            if (result.data?.access_token) {
                
                setAccessToken(result.data.access_token);
                navigate("/")
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: index.tsx:17 ~ handleCallback ~ error:",
                error
            );
        }
    };

    useEffect(() => {
        handleCallback();
        console.log('ram', 'rehreer');
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-4xl">Authenticating..</h1>
        </div>
    );
};

export default withAuth(AsanaCallback);
