"use client";

import { useSession } from "next-auth/react";
import { ChangeEvent, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { categories } from "@/lib/utils";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { toast } from 'react-hot-toast';


const BlogAdd = () => {
    const { data: session } = useSession();
    const [imageUrl, setImageUrl] = useState("");
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const convertEditorDataToHTML = () => {
        return draftToHtml(convertToRaw(editorState.getCurrentContent()));
    }
    const handleEditorStateChange = (e: any) => {
        setEditorState(e);
    }

    const handlePost = async (data: any) => {
        const formData = new FormData();
        const postData = JSON.stringify({
            title: headingRef.current?.innerText,
            description: convertEditorDataToHTML(),
            location: data.location,
            userId: session?.user.id,
            categoryId: data.category
        });
        formData.append("postData", postData);
        formData.append("image", data.image[0]);

        try {
            toast.loading("Sending your post....", { id: "postData" });

            await fetch("http://localhost:3000/api/blogs", {
                method: "POST",
                body: formData,
                cache: "no-store"
            })

            toast.success("Sent successfully", { id: "postData" });
        } catch (error) {
            toast.error("Sending failed", { id: "postData" })
            return console.log(error);
        }
    };
    return (
        <section className="w-full">
            <div className="flex justify-between p-4 items-center">
                <div className="w-1/4">
                    <span className="font-extrabold mx-3">Author: </span>
                    <span className="font-semibold uppercase">
                        {session?.user?.name}
                    </span>
                </div>
                <button onClick={handleSubmit(handlePost)} className="bg-orange-600 text-white px-6 focus:ring-orange-950 py-3 rounded-xl font-semibold shadow-xl hover:bg-orange-700">Publish</button>
            </div>
            {imageUrl && (
                <Image
                    className="mx-auto my-20 rounded-lg shadow-xl border-[3px] border-slate-700 "
                    src={imageUrl}
                    alt="NewPost"
                    width={800}
                    height={400} />
            )}
            <h1
                ref={headingRef}
                contentEditable={true}
                className="outline-none border-none font-serif mx-auto p-4 text-2xl text-center font-semibold w-full h-28 focus:border-none">
                Enter the title
            </h1>
            <div className="w-full flex my-5">
                <input
                    type="file"
                    className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl"
                    {...register("image", {
                        required: true, onChange(event) {
                            setImageUrl(URL.createObjectURL(event.target.files[0]));
                        }
                    })}
                />
            </div>
            <div className="w-full flex my-5">
                <input
                    placeholder="Location Ex: Delhi, India "
                    type="text"
                    className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl"
                    {...register("location", { required: true })}
                />
            </div>
            <div className="w-full flex my-5">
                <select
                    className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl"
                    {...register("category", { required: true })}
                >
                    {categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
                </select>
            </div>
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorStateChange}
                editorStyle={{
                    minHeight: "50vh",
                    height: "auto",
                    border: "1px solid #000",
                    padding: "10px"
                }}
            />
        </section>
    )
}

export default BlogAdd;