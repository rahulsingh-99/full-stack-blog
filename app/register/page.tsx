"use client";
import React, { useState } from 'react'
import Logo from '../components/Logo';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
    const { register, handleSubmit } = useForm();

    const signUpWithCreds = async (data: any) => {
        toast.loading("Signing In", { id: "1" });
        try {
            await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ ...data })
            });
            toast.success("Signin Successfully", { id: "1" });

        } catch (error) {
            console.log(error);
            toast.error("Credentials are incorrect", { id: "1" });

        }
    }
    const passwordLessSignIn = async (type: "google" | "github") => {
        toast.loading("Signing In", { id: "1" });
        try {
            await signIn(type);
            toast.success("Signin Successfully", { id: "1" });

        } catch (error) {
            console.log(error);
            toast.error("Credentials are incorrect", { id: "1" });

        }
    }
    const [showPassword, setShowPassword] = useState(false);
    return (
        <section className='w-full h-full flex flex-col'>
            <div className="mx-auto rounded-xl bg-slate-200 my-10 px-10 py-5">
                <div className="m-auto p-4 text-center">
                    <span className="font-extrabold text-xl">Register To</span> <Logo />
                </div>
                <div className="flex flex-col">
                    <label className='font-semibold text-2xl text-center text-slate-900' htmlFor="name">Name</label>
                    <div className="flex items-center justify-between bg-gray-100 my-4 px-6 py-4 rounded-xl text-gray-900 font-semibold">
                        <input
                            type="text"
                            className='bg-transparent p-1 border-none outline-none'
                            {...register("name")}
                        />
                    </div>
                    <label className='font-semibold text-2xl text-center text-slate-900' htmlFor="email">Email</label>
                    <div className="flex items-center justify-between bg-gray-100 my-4 px-6 py-4 rounded-xl text-gray-900 font-semibold">
                        <input
                            type="email"
                            className='bg-transparent p-1 border-none outline-none'
                            {...register("email")}
                        />
                    </div>
                    <label className='font-semibold text-2xl text-center text-slate-900' htmlFor="password">Password</label>
                    <div className="flex items-center justify-between bg-gray-100 my-4 px-6 py-4 rounded-xl text-gray-900 font-semibold">
                        <input
                            type={showPassword ? "text" : "password"}
                            className='bg-transparent p-1 border-none outline-none'
                            {...register("password")}
                        />
                        {showPassword ? (
                            <FiEyeOff onClick={() => setShowPassword((prev) => !prev)} size={30} className='ml-3 hover-bg-gray-200 cursor-pointer rounded-full p-2 ' />
                        ) : (
                            <FiEye onClick={() => setShowPassword((prev) => !prev)} size={30} className='ml-3 hover-bg-gray-200 cursor-pointer rounded-full p-2' />
                        )}
                    </div>
                    <button onClick={handleSubmit(signUpWithCreds)} className='my-2 font-bold border-[1px] text-white bg-orange-500 hover:bg-orange-600 px-6 py-3 flex items-center justify-center gap-3 rounded-xl duration-300'>Register
                    </button>
                    <button onClick={async () => { passwordLessSignIn("github") }} className='my-2 font-bold border-[1px] bg-gray-950 text-white hover:bg-gray-800 px-6 py-3 flex items-center justify-center gap-3 rounded-xl duration-300'>
                        <span className='mx-auto text-lg text-slate-100'>Continue with Github
                        </span>
                        <FaGithub size={30} />
                    </button>
                    <button onClick={async () => { passwordLessSignIn("google") }} className='my-2 font-bold border-[1px] bg-white text-black
                    hover:bg-slate-300 px-6 py-3 flex items-center justify-center gap-3 rounded-xl duration-300'>
                        <span className='mx-auto text-lg text-slate-950'>Continue with Google
                        </span>
                        <FcGoogle size={30} />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default RegisterPage;