"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogItemType } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdLocationPin } from "react-icons/md";

type Props = BlogItemType;
function getTextFromHtml(html: string) {
    const elm = document.createElement("span");
    elm.innerHTML = html;
    return elm.innerText.slice(0, 300);
}

const deleteBlog = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/blogs/${id}`, {
        cache: "no-store",
        method: "DELETE",
    });
}

const BlogItem = (props: Props) => {
    const [descriptionText, setDescriptionText] = useState(props.description);

    useEffect(() => {
        setDescriptionText(getTextFromHtml(props.description));
    }, [props.description]);

    const handleDelete = async () => {
        try {
            toast.loading("Deleting Blog", { id: "delete" });
            await deleteBlog(props.id);
            toast.success("Blog Deleted Succesfully", { id: "delete" });
        } catch (error) {
            toast.error("Deleting Failed", { id: "delete" });
            console.log(error);
        }
    }

    return (
        <Card className="hover: border-slate-950 duration-500 flex flex-col w-[400px] h-[550px] mx-4 my-2 rounded-lg">
            <CardHeader>
                <Image
                    width={400}
                    height={100}
                    className="h-48 rounded-sm"
                    alt={props.title}
                    src={props.imageUrl ?? "https://images.unsplash.com/photo-1633078654544-61b3455b9161"}
                />
            </CardHeader>
            <CardTitle className="p-3">{props.title}</CardTitle>
            <CardContent className="w-full text-slate-900">
                <div className="flex justify-end gap-2 p-2 items-center font-semibold">
                    <MdLocationPin size={20} className="text-orange-600" />
                    <p className="font-mono">{props.location}</p>
                </div>
                <p className="tracking-wide w-full px-2 py-1 text-left">
                    {descriptionText}
                </p>
            </CardContent>
            <CardFooter className="w-full h-full p-3 flex justify-between items-center">
                <Link href={`/blogs/view/${props.id}`}
                    className="mt-auto border-[1px] p-3 rounded-lg hover:bg-orange-600 font-semibold hover:text-orange-100 duration-500 cursor-pointer">View More</Link>{" "}
                {props.isProfile &&
                    <Link
                        href={`/blogs/edit/${props.id}`}
                        className="mt-auto border-[1px] p-3 rounded-lg hover:bg-orange-600 font-semibold hover:text-orange-100 duration-500 cursor-pointer">Edit</Link>
                }
                {props.isProfile &&
                    <button
                        onClick={handleDelete}
                        className="mt-auto border-[1px] p-3 rounded-lg hover:bg-orange-600 font-semibold hover:text-orange-100 duration-500 cursor-pointer">Delete</button>
                }
            </CardFooter>
        </Card>
    )
}

export default BlogItem