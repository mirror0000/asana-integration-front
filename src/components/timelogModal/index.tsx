import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useLocalStorage } from 'usehooks-ts';

type ITimeLogModalProps = {
    showModal: boolean,
    setShowModal: any,
    projectData: any
}
type IFormDataInterface = {
    date: string;
    name: string;
    bill_status: string;
    hours: string;
    notes?: string
}


const TimelogModal = ({ showModal, setShowModal, projectData }: ITimeLogModalProps) => {
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const [accessToken, setAccessToken] = useLocalStorage("access_token", "");
    const [formData, setFormData] = useState<IFormDataInterface | any>({
        date: "",
        name: "",
        bill_status: "",
        hours: "",
        notes: "",
    });

    const [errors, setErrors] = useState<IFormDataInterface | any>({
        date: "",
        name: "",
        bill_status: "",
        hours: "",
        notes: "",
    });
    const OnFormInputChange = (e: any) => {
        console.log('projectData', projectData);
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
        const fields = ["date", "name", "bill_status", "hours", "notes"];
        let customError: any = {};
        let hourValidationRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
        for (const field of fields) {
            if (!formData[field] && field !== 'notes') {
                customError[field] = `${field.toLocaleUpperCase()} is required.`;
            }
            // check hours validation
            if (field === "hours" && !hourValidationRegex.test(formData[field])) {
                customError[field] = "Time must be in the format of hh:mm";
            }
        }
        if (Object.keys(customError).length) {
            setErrors(customError);
            return;
        }
        const { date, name, bill_status, hours, notes } = formData;
        const body = {
            owner:projectData?.owner_id,
            date, 
            name, 
            bill_status, 
            hours, 
            notes
        };
        setSubmitLoading(true);
        try {
            const result: any = await axios.post(
                `${process.env.REACT_APP_BACKEND_API}/portals/${projectData?.portal_id}/projects/${projectData.id_string}/tasks`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if(result){
                setShowModal(false)
                setSubmitLoading(false)
                toast.success('Timelog added succesfully!')
                setTimeout(() => {
                    setFormData({
                        owner: "",
                        date: "",
                        name: "",
                        bill_status: "",
                        hours: "",
                        notes: "",
                    });
                  }, 1000);
            }
        } catch (error:any) {
            console.log(
                "🚀 ~ file: index.tsx:60 ~ handleCallback ~ error:",
                error
            );
            setShowModal(false)
            toast.error(error?.response?.data?.error?.message)
        }
    };


    // const handleServerError = (error: any) => {
    //     if (error) {
    //         if (error?.response?.status === 422 && error?.response?.data?.errors) {
    //             error?.response?.data?.errors.forEach((errs: any, index: number) => {
    //                 setErrors({
    //                     ...errors,
    //                     [errs.property]: errs.messages,
    //                 });
    //             });
    //         } else {
    //             toastError(error?.response?.data?.errors.detail);
    //         }
    //     }
    // };
    // console.log('formData' , formData)
    return (
        <div className={`${!showModal ? 'hidden' : ''}fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
            <div className="relative w-full max-w-2xl max-h-full h-[100vh] flex items-center m-auto ">
                <div className="relative w-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Add Time Log
                        </h3>
                        <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <form onSubmit={handleAddTimeLog}>
                            <div className="flex flex-col items-start mb-3">
                                <label htmlFor="date" className="label p-0 mb-[0.5rem] dark:text-slate-400">Date:<span className='text-sm text-red-500'>*</span></label>
                                <input
                                    type="date"
                                    id="date"
                                    autoComplete="off"
                                    name="date"
                                    value={formData.date}
                                    onChange={OnFormInputChange}
                                    className="rounded-lg h-[30px] w-full py-5 px-5 dark:bg-slate-800/60 dark:border-slate-700/50 focus:outline-none" />
                                <span className="mt-2 text-sm text-red-500 dark:text-red-400">{errors?.date}</span>
                            </div>
                            <div className="flex flex-col items-start mb-3">
                                <label htmlFor="name" className="label p-0 mb-[0.5rem] dark:text-slate-400">Task:<span className='text-sm text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    id="name"
                                    autoComplete="off"
                                    name="name"
                                    value={formData.name}
                                    onChange={OnFormInputChange}
                                    className="rounded-lg h-[30px] w-full py-5 px-5 dark:bg-slate-800/60 dark:border-slate-700/50 focus:outline-none" placeholder="Enter Your Task" />
                                <span className="mt-2 text-sm text-red-500 dark:text-red-400">{errors?.name}</span>
                            </div>
                            <div className="flex flex-col items-start mb-3">
                                <label htmlFor="hours" className="label p-0 mb-[0.5rem] dark:text-slate-400">Time:<span className='text-sm text-red-500'>*</span></label>
                                <input type="text" id="hours"
                                    autoComplete="off"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={OnFormInputChange}
                                    className="rounded-lg h-[30px] w-full py-5 px-5 dark:bg-slate-800/60 dark:border-slate-700/50 focus:outline-none" placeholder="Enter Your Timelog" />
                                <span className="mt-2 text-sm text-red-500 dark:text-red-400">{errors?.hours}</span>
                            </div>
                            <div className="flex flex-col items-start mb-3">
                                <label htmlFor="bill_status" className="label p-0 mb-[0.5rem] dark:text-slate-400">Bill Status:<span className='text-sm text-red-500'>*</span></label>
                                <select name="bill_status"
                                    value={formData.bill_status}
                                    onChange={OnFormInputChange}
                                    id="bill_status" className="rounded-lg h-[40px] w-full py-2 px-5 dark:bg-slate-800/60 dark:border-slate-700/50 focus:outline-none">
                                    <option value="">Select Bill Status</option>
                                    <option value="Non Billable">Non Billable</option>
                                    <option value="Billable">Billable</option>
                                </select>
                                <span className="mt-2 text-sm text-red-500 dark:text-red-400">{errors?.bill_status}</span>
                            </div>
                            <div className="flex flex-col items-start mb-3">
                                <label htmlFor="notes"
                                    onChange={OnFormInputChange}
                                    className="label p-0 mb-[0.5rem] dark:text-slate-400">Notes:</label>
                                <input type="text" id="notes"
                                    autoComplete="off"
                                    name="notes"
                                    value={formData.notes}
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

export default TimelogModal