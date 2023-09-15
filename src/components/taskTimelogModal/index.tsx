import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useLocalStorage } from 'usehooks-ts';

type ITaskTimeLogProps = {
    showModal: boolean,
    setShowModal: any,
    taskData: any,
    listID: string,
    sectionOption: any[],
}
type IFormDataInterface = {
    duration: string;
    status: string;
    description: string;
}


const TaskTimelogModal = ({ showModal, setShowModal, taskData, listID, sectionOption }: ITaskTimeLogProps) => {
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const [accessToken, setAccessToken] = useLocalStorage("access_token", "");

    console.log('task time log modal', accessToken);

    const [formData, setFormData] = useState<IFormDataInterface | any>({
        duration: "",
        status: listID,
        description: "",
    });

    const [errors, setErrors] = useState<IFormDataInterface | any>({
        duration: "",
        status: "",
        description: "",
    });
    const OnFormInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: "",
        });
    };

    const handleAddTimeLog = async (e:any) => {
        e.preventDefault()
        const fields = ["duration", "description"];
        
        let customError: any = {};
        for (const field of fields) {
            if (field !== 'notes' && !formData[field] ) {
                customError[field] = `${field.toLocaleUpperCase()} is required.`;
            }
        }
        if (Object.keys(customError).length) {
            setErrors(customError);
            return;
        }
        console.log("🚀 ~ file: index.tsx:58 ~ handleAddTimeLog ~ return:", taskData)
        // const { duration, status, description } = formData;

        // const body = {
        //     duration, 
        //     status, 
        //     description, 
        //     assignee: taskData?.assignees[0]?.id,
        //     tid: taskData?.id,
        //     start: taskData?.start_date || Date.now(),
        //     tags: taskData?.tags
        // };
        
        setSubmitLoading(true);
        try {
            console.log('submit formdata', formData);
            if (!formData.status) {
                formData.status = listID;
            }
            const result: any = await axios.post(
                `${process.env.REACT_APP_BACKEND_API}/portals/${taskData?.gid}/log`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if(result){
                setShowModal(false)
                setSubmitLoading(false)
                toast.success('Task Timelog added successfully!')
                setTimeout(() => {
                    setFormData({
                        date: "",
                        task_status: "",
                        hours: "",
                        notes: "",
                    });
                  }, 1000);
            }
        } catch (error:any) {
            console.log(
                "🚀 ~ file: index.tsx:78 ~ handleCallback ~ error:",
                error
            );
            setShowModal(false)
            toast.error(error?.response?.data?.error?.message)
        }
    };
    
    return (
        <div className={`${!showModal ? 'hidden' : ''}fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
            <div className="relative w-full max-w-2xl max-h-full h-[100vh] flex items-center m-auto ">
                <div className="relative w-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Add Task Time Log
                        </h3>
                        <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <p className="mb-2">Task: </p>
                        <p className="!mt-2">{taskData.name}</p>
                        <form onSubmit={handleAddTimeLog}>
                            <div className="flex flex-col items-start mb-3">
                                <label htmlFor="date" className="label p-0 mb-[0.5rem] dark:text-slate-400">Duration:<span className='text-sm text-red-500'>*</span></label>
                                <input
                                    type="number"
                                    id="number"
                                    autoComplete="off"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={OnFormInputChange}
                                    className="rounded-lg h-[30px] w-full py-5 px-5 dark:bg-slate-800/60 dark:border-slate-700/50 focus:outline-none" />
                                <span className="mt-2 text-sm text-red-500 dark:text-red-400">{errors?.duration}</span>
                            </div>
                            <div className="flex flex-col items-start mb-3">
                                <label htmlFor="task_status" className="label p-0 mb-[0.5rem] dark:text-slate-400">Status:<span className='text-sm text-red-500'>*</span></label>
                                <select
                                    value={formData.status ? formData.status : listID}
                                    onChange={OnFormInputChange}
                                    name="status"
                                    id="task_status" className="rounded-lg h-[40px] w-full py-2 px-5 dark:bg-slate-800/60 dark:border-slate-700/50 focus:outline-none">
                                    {
                                        sectionOption && sectionOption?.map((item: any) => (
                                            <option value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                                <span className="mt-2 text-sm text-red-500 dark:text-red-400">{errors?.task_status}</span>
                            </div>
                            <div className="flex flex-col items-start mb-3">
                                <label htmlFor="notes"
                                    onChange={OnFormInputChange}
                                    className="label p-0 mb-[0.5rem] dark:text-slate-400">Description:</label>
                                <input type="text" id="notes"
                                    autoComplete="off"
                                    name="description"
                                    value={formData.description}
                                    onChange={OnFormInputChange}
                                    className="rounded-lg h-[30px] w-full py-5 px-5 dark:bg-slate-800/60 dark:border-slate-700/50 focus:outline-none" placeholder="Enter Notes" />
                            </div>
                            <div className="mt-6">
                                <button type='submit' className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskTimelogModal