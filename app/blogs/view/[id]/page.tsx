import { getBlogById } from "@/lib/helpers";
import { BlogItemType } from "@/lib/types";
import Image from "next/image";

const BlogViewPage = async ({ params }: { params: { id: string } }) => {
    const blog: BlogItemType = await getBlogById(params.id);

    return (
        <section className="w-full h-full flex flex-col">
            <Image
                src={blog.imageUrl ?? ""}
                alt={blog.title}
                width={1000}
                height={1000}
                className="md:w-2/4 xs:w-3/4 mx-auto my-8 drop-shadow-xl rounded-lg"
            />
            <div className="md:w-2/4 xs:w-3/4 mx-auto my-8">
                <h2 className="md:text-5xl xs:text-xl text-center">{blog.title}</h2>
            </div>
            <div className="flex flex-col p-2 items-center font-semibold">{blog.location}</div>
            <section
                className="md:w-2/4 xs:w-3/4 mx-auto my-8"
                dangerouslySetInnerHTML={{ __html: blog.description }}
            ></section>
        </section>
    );
}

export default BlogViewPage