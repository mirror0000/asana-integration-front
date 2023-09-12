import React from 'react';
import withAuth from '../../hoc/with-auth-redirect';


const Login: React.FC = () => {
    const handleLoginWithOauth = () => {
        console.log('ram', process.env.REACT_APP_BACKEND_API);
        // @ts-ignore
        window.location.href = process.env.REACT_APP_BACKEND_API + "/auth";
    };
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">{/* Your grid content */}</div>
                <div className="col-span-2 flex justify-center">
                    <button
                        onClick={handleLoginWithOauth}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Login with Oauth
                    </button>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Login);