"use client"

import { toast } from "react-hot-toast";
import draftToHtml from "draftjs-to-html";
import { ContentState, convertFromHTML, convertToRaw, EditorState } from "draft-js";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { BlogItemType } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton"


const getBlogById = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/blogs/${id}`, {
        cache: "no-store"
    });
    const data = await res.json();
    return data.blog;
}
const updateBlog = async (id: string, postData: any) => {
    const res = await fetch(`http://localhost:3000/api/blogs/${id}`, {
        cache: "no-store",
        method: "PUT",
        body: JSON.stringify({ ...postData }),
    });
    const data = await res.json();
    return data.blog;
}

const EditBlogPage = ({ params }: { params: { id: string } }) => {
    const { data: session } = useSession();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [isLoading, setIsLoading] = useState(false);
    const headingRef = useRef<HTMLHeadingElement | null>(null);

    useEffect(() => {
        setIsLoading(true);
        toast.loading("Updating Blog Details", { id: "loading" })
        getBlogById(params.id).then((data: BlogItemType) => {
            const contentBlocks = convertFromHTML(data.description);
            const contentState = ContentState.createFromBlockArray(contentBlocks.contentBlocks);
            const initialState = EditorState.createWithContent(contentState);
            setEditorState(initialState);
            if (headingRef && headingRef.current)
                headingRef.current.innerText = data.title;
            setIsLoading(false);
            toast.success("Blogs Details Added Successfully", { id: "loading" });
        }).catch((error) => {
            console.log(error);
            toast.error("Error in Updating Details", { id: "loading" });
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const convertEditorDataToHTML = () => {
        return draftToHtml(convertToRaw(editorState.getCurrentContent()));
    }
    const handleEditorStateChange = (e: any) => {
        setEditorState(e);
    }

    const handlePost = async () => {
        const postData = {
            title: headingRef.current?.innerText,
            description: convertEditorDataToHTML()
        };

        try {
            toast.loading("Updating your post....", { id: "postUpdate" });
            await updateBlog(params.id, postData);
            toast.success("Updated successfully", { id: "postUpdate" });
        } catch (error) {
            toast.error("Sending failed", { id: "postUpdate" })
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
                <button onClick={handlePost} className="bg-orange-600 text-white px-6 focus:ring-orange-950 py-3 rounded-xl font-semibold shadow-xl hover:bg-orange-700">Publish</button>
            </div>
            {isLoading && (
                <p>
                    <Skeleton className="w-[300px] h-[50px] rounded-lg mx-auto" />
                </p>
            )}
            <h1
                ref={headingRef}
                contentEditable={true}
                className="outline-none border-none font-serif mx-auto p-4 text-2xl text-center font-semibold w-full h-28 focus:border-none">
            </h1>
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

export default EditBlogPage;