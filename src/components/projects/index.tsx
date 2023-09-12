import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useLocalStorage } from "../../hooks/useLocalstorage";
import withAuth from "../../hoc/with-auth-redirect";

const Project: React.FC = () => {
    const [profile] = useLocalStorage<any>("profile", {});
    let { portalId } = useParams();
    const [projects, setProjects] = useState([]);
    const [accessToken] = useLocalStorage("access_token", "");
    const handleGetProjects = async () => {
        try {
            const result: any = await axios.get(
                `${process.env.REACT_APP_BACKEND_API}/portals/${portalId}/projects`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(
                "🚀 ~ file: index.tsx:23 ~ handleGetProjects ~ result.data:",
                result.data
            );
            if (result.data?.projects) {
                setProjects(result.data.projects);
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: index.tsx:17 ~ handleCallback ~ error:",
                error
            );
        }
    };

    useEffect(() => {
        handleGetProjects();
    }, [portalId]);

    return (
        <div className="flex flex-col justify-center items-center">
            {/* <div className="flex flex-col justify-center items-center h-screen"> */}
            <h1 className="text-4xl">Projects of: {profile?.email || ""}</h1>
            {/* </div> */}
            <div>
                {projects.map((project: any) => (
                    <div
                        key={project.id}
                        className="w-screen h-screen flex justify-center items-center"
                    >
                        <div className="container mx-auto max-w-sm w-full p-4 sm:w-1/2">
                            <div className="card flex flex-col justify-center p-10 bg-white rounded-lg shadow-2xl">
                                <div className="prod-title">
                                    <p className="text-wrap text-2xl uppercase text-gray-900 font-bold">
                                        {project.owner_name}
                                    </p>
                                    <p className="uppercase text-sm text-gray-400">
                                        {project.name}
                                    </p>
                                </div>
                                {/* <div className="prod-img">
                                    <img
                                        src={project.image_url}
                                        alt="project"
                                        className="w-full object-cover object-center"
                                    />
                                </div> */}
                                <div className="prod-info grid gap-10">
                                    <div className="flex flex-col md:flex-row justify-between items-center text-gray-900">
                                        <p>
                                            Tasks:
                                            <p className="text-gray-400 text-sm">
                                                Opened:{" "}
                                                {project?.task_count?.open}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                Closed:{" "}
                                                {project?.task_count?.closed}
                                            </p>
                                        </p>
                                        {/* <button className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
                                            View
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default withAuth(Project);
