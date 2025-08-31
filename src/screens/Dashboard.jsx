/* eslint-disable no-unused-vars */
import React, { useLayoutEffect, useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { RxCross1 } from "react-icons/rx";
import { motion } from 'motion/react';
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { LabelInputContainer } from '../components/Signup';
import ChatSheet from '../components/ChatSheet'
import { useDispatch, useSelector } from 'react-redux';
import axios from '../config/axios';
import { initializeSocket } from '../config/socket';
export default function Dashboard() {
    const [loadProjects, setLoadProjects] = useState(false);//holds the loading state of projects
    const [project, setProject] = useState([]); //list of projects a user contain
    const [loadError, setLoadError] = useState(null);//holds the error if any while loading projects
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);
    useLayoutEffect(() => {
        const fetchAllProjects = async () => {
            // API call to load projects
            setLoadProjects(true);
            try {
                const response = await axios.get("/project/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProject(await response.data.data);
            } catch (err) {
                setLoadError(err.response?.data?.message || "Something went wrong");

            } finally {
                setLoadProjects(false);
                setTimeout(() => { setLoadError(null); }, 5000);
            }
        }
        fetchAllProjects();
    }, [token, dispatch]);
    const [chatSec, setChatSec] = useState(false);//holds the state of chat section open or close
    const [chatId, setChatId] = useState(''); //holds the current chat id
    return (
        <div className='min-h-[calc(100dvh-64px)] w-full flex shrink-0'>
            <Leftbar projects={project} open={!chatSec} setOpen={setChatSec} setChatId={setChatId} loading={loadProjects} />
            <motion.div initial={{ opacity: 0 }}
                animate={{ opacity: chatSec ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className={`${chatSec ? 'flex' : 'hidden'}  min-h-full w-full`}>
                <ChatSheet setIsOpen={setChatSec} chatId={chatId} open={chatSec} />
            </motion.div>
        </div>
    )
}


const Leftbar = ({ projects, open, setOpen, setChatId, loading }) => {
    const [isOpen, setIsOpen] = useState(false); //state to handle add project overlay
    const [delBox, setDelBox] = useState(false); //state to handle delete project overlay
    const [id, setId] = useState(null); //holds the id of project to be deleted
    const handleDel = (projectId) => {
        setTimeout(() => {
            setOpen(false);
        }, 10);
        setDelBox(true);
        setId(projectId);
    }
    return (
        <div className={`min-h-full ${open ? 'flex' : 'hidden'} p-5 md:flex flex-col gap-2 w-full md:min-w-1/4 md:max-w-1/4 md:border-r border-zinc-700`}>
            <h2 className='text-white text-center font-bold text-xl mb-5'>Projects</h2>
            {!loading && projects.length <= 0 ? <p className='text-center mb-5 '>Create new projects</p> : projects.map((elem) => (
                <div className="bg-zinc-800 h-12 px-3 flex items-center justify-between w-full border border-zinc-700 rounded-lg hover:bg-zinc-900 transition-all duration-200" key={elem._id} onClick={() => { setChatId(elem); setOpen(true); initializeSocket(elem._id) }}>{elem.projectName}
                    <button className='bg-red-500/10 size-8 border border-red-500/50 rounded-lg flex items-center justify-center active:bg-red-500/80 z-1' onClick={() => { handleDel(elem._id) }}><FaTrash className='text-red-500/70' /></button>
                </div>
            ))}
            <div className="bg-zinc-800 h-12 w-full border border-zinc-700 rounded-lg hover:bg-zinc-900 transition-all duration-200 flex items-center justify-center" onClick={() => setIsOpen(true)}><FaPlus className='bg-zinc-700 size-7 p-1.5 rounded-full' /></div>
            <AddProject isOpen={isOpen} setIsOpen={setIsOpen} />
            <DelBox isOpen={delBox} setIsOpen={setDelBox} projectId={id} />
        </div>
    )
}

const AddProject = ({ isOpen, setIsOpen }) => {
    const [projectName, setProjectName] = useState(''); //holds the name of new project
    const [projectDesc, setProjectDesc] = useState(''); //holds the description of new project
    const [createError, setCreateError] = useState(null) //holds the error if any while creating new project
    const [loading, setLoading] = useState(false) //holds the loading state while creating new project
    const dispatch = useDispatch();
    const { token, user } = useSelector(state => state.user);
    const handleSubmit = async (e) => { 
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                "/project/create",
                { name: projectName, description: projectDesc, userId: user._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.data;
            setIsOpen(false);
            setProjectName('');
            setProjectDesc('');
            window.location.reload();
        }
        catch (err) {
            setCreateError(err.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false);
            setTimeout(() => {
                setCreateError(null);
                setProjectName('');
                setProjectDesc('');
            }, 5000);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={`${isOpen ? 'absolute' : 'hidden'} h-[calc(100vh-64px)] -m-5 w-full flex items-center justify-center bg-zinc-900/30 backdrop-blur-lg z-10`}>
            <div className='size-80 p-4 bg-zinc-800 border border-zinc-700 rounded-xl flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                    <h3 className="text-xl">New Project</h3>
                    <RxCross1 onClick={() => setIsOpen(false)} />
                </div>
                {createError && <p className='text-red-500 text-center text-sm mt-2 border border-red-500 p-2 rounded-lg'>{createError}</p>}
                <div className="h-full w-full flex flex-col items-center justify-evenly">
                    <LabelInputContainer>
                        <Label htmlFor={"name"}>Project Name</Label>
                        <Input id="name" type="text" stateName={projectName} setState={setProjectName} placeholder="Project Name" />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor={"name"}>Project Description</Label>
                        <Input id="name" type="text" stateName={projectDesc} setState={setProjectDesc} placeholder="Project Description" />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <button type={'submit'} className='w-full border-zinc-500 border rounded-lg py-2 md:hover:bg-zinc-700 transition-all duration-200 active:bg-zinc-700' onClick={handleSubmit} disabled={loading}>Submit</button>
                    </LabelInputContainer>
                </div>

            </div>
        </motion.div>
    )
}

const DelBox = ({ isOpen, setIsOpen, projectId }) => {
    const token = useSelector(state => state.user.token);
    const handleDelete = async () => {
        // API call to delete project
        try {
            const response = await axios.delete(`/project/delete/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.data;
            console.log(data);
            setIsOpen(false);
            window.location.reload();
        } catch (err) {
            console.log(err.response?.data?.message || "Something went wrong");
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className={`${isOpen ? 'absolute' : 'hidden'} h-[calc(100vh-64px)] -m-5 w-full flex items-center justify-center bg-zinc-900/30 backdrop-blur-lg z-10`}>
            <div className='max-h-40 max-w-sm p-4 bg-red-500/10 backdrop-blur-lg border border-red-700 rounded-xl flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                    <h3 className="text-xl">Are you sure you want to <span className='text-red-500'>delete</span> this project ?</h3>
                </div>
                <div className="h-full w-full flex items-center justify-evenly">
                    <button className="rounded-lg border-white border py-2 px-4 active:bg-white/70" onClick={() => setIsOpen(false)}  >Cancel</button><button className="rounded-lg border-red-500 border py-2 px-4 text-red-500 font-bold active:bg-red-500/70" onClick={() => handleDelete()}>Delete</button>
                </div>

            </div>
        </motion.div>
    )
}
