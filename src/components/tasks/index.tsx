import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { useLocalStorage } from 'usehooks-ts';
import withAuth from '../../hoc/with-auth-redirect';
import TaskTimelogModal from '../taskTimelogModal';

const ProjectTasks: React.FC = () => {
    const [profile] = useLocalStorage<any>("profile", {});
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useLocalStorage("access_token", "");
    const [showModal, setShowModal] = useState<boolean>(false)
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({})
    const [sections, setSections] = useState([]);
    const [sectionOption, setSectionOption] = useState<any>([]);
    const [listId, setListId] = useState();

    // const pathname

    const handleGetSections = async () => {
        try {
            const result: any = await axios.get(
                `${process.env.REACT_APP_BACKEND_API}/portals/${projectId}/sections?access_token=${accessToken}`
            );
            if (result) {
                console.log('fetch sections data', result);
                let sections: any = [];
                sections = result?.data;
                setSections(sections.data);
            }
        } catch(error) {
            console.log('fetch sections data error :', error);
        }
    }

    const handleGetTasks = async () => {
        try {
            const section_params: any[] = [];
            sections?.map((item: any) => {
                const data = {
                    id: item.gid,
                    name: item.name,
                }
                section_params.push(data);
            });
            const params = {
                access_token: accessToken,
                ids: section_params,
            }
            console.log('get task', params);
            setSectionOption(section_params);
            const result: any = await axios.get(
                `${process.env.REACT_APP_BACKEND_API}/portals/tasks`,
                { params }
            );
            if (result) {
                let tasks: any = []
                tasks = result?.data;
                console.log('tasks', tasks);
                setTasks(tasks);
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: index.tsx:11 ~ handleCallback ~ error:",
                error
            );
        }
    }
    useEffect(() => {
        projectId &&
        handleGetSections()
        
    }, [projectId]);

    useEffect(() => {
        sections.length &&
        handleGetTasks();
    }, [sections]);

    console.log('ram', tasks)

    return (
        <div className="flex flex-col items-center justify-center">
            {/* <div className="flex flex-col items-center justify-center h-screen"> */}
            <div className='flex items-center justify-between w-full max-w-2xl mt-8'>
                <h1 className="text-2xl">Projects Tasks of: {profile?.username || ""}</h1>
                <button className="px-3 py-2 text-sm font-semibold text-white bg-blue-500 rounded lg:px-4 hover:bg-blue-600" onClick={() => navigate(-1)}>Back</button>
            </div>
            <div>
                <div className="max-w-[80%] m-auto mt-10">
                    <div className="relative overflow-hidden not-prose bg-slate-50 rounded-xl dark:bg-slate-800/25">
                        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
                        <div className="relative overflow-auto rounded-xl">
                            <div className="my-8 overflow-auto shadow-sm">
                                {tasks?.map((item: any) => (
                                <>
                                <h1>{item.list_name}</h1>
                                <table className="w-full text-sm border-collapse table-fixed">
                                    <thead>
                                        <tr>
                                            <th rowSpan={1} className="p-4 pt-0 pb-3 pl-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[50px]">S.N</th>
                                            <th rowSpan={1} className="p-4 pt-0 pb-3 pl-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[300px]">Name</th>
                                            <th rowSpan={1} className="p-4 pt-0 pb-3 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[150px]">Created Person</th>
                                            <th rowSpan={1} className="p-4 pt-0 pb-3 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[150px]">Completed</th>
                                            <th rowSpan={1} className="p-4 pt-0 pb-3 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[150px]">Priority</th>
                                            {/* <th colSpan={2} className="p-4 pt-0 pb-3 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[250px]">Log Hours</th> */}
                                            <th rowSpan={1} className="p-4 pt-0 pb-3 pr-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[200px]">Actions</th>
                                        </tr>
                                        {/* <tr>
                                            <th className="p-4 pb-3 pr-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[150px]">Non-Billable</th>
                                            <th className="p-4 pb-3 pr-8 font-medium text-center border-b dark:border-slate-600 text-slate-400 dark:text-slate-200 w-[150px]">Billable</th>
                                        </tr> */}
                                    </thead>
                                    <tbody className="bg-white dark:bg-slate-800">
                                        {
                                            item.card.length && item.card?.map((card: any, index: number) => (
                                                <tr key={index}>
                                                    <td className="p-4 pl-8 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{index + 1}.</td>
                                                    <td className="p-4 pl-8 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{card?.name ?? 'N/A'}</td>
                                                    <td className="p-4 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{card?.due_on ?? 'N/A'}</td>
                                                    <td className="p-4 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{card?.completed ? 'true' : 'false'}</td>
                                                    <td className="p-4 pr-8 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{card?.actual_time_minutes ?? 'N/A'}</td>
                                                    {/* <td className="p-4 pr-8 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{task?.log_hours?.non_billable_hours}</td> */}
                                                    {/* <td className="p-4 pr-8 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">{task?.log_hours?.billable_hours}</td> */}
                                                    <td className="p-4 pr-8 text-center border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                                                        <button
                                                            onClick={() => { setTaskData(card); setShowModal(true); setListId(item.list_id)}}
                                                            className="px-3 text-sm font-semibold text-blue-600 rounded cursor-pointer lg:px-4 dark:text-blue-500 hover:underline"
                                                        >Add Time log</button>
                                                    </td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>
                                </>
                                ))}
                            </div>
                        </div>
                        <div className="absolute inset-0 border pointer-events-none border-black/5 rounded-xl dark:border-white/5"></div>
                    </div>
                </div>
            </div>
            {
                showModal &&
                <TaskTimelogModal listID={listId!} showModal={showModal} setShowModal={setShowModal} taskData={taskData} sectionOption={sectionOption}/>
            }
        </div>
    )
}

export default withAuth(ProjectTasks)