"use client";
import { categories } from "@/lib/utils";
import { FaSearch } from "react-icons/fa";
import BlogItem from "../components/BlogItem";
import { BlogItemType } from "@/lib/types";
import { useEffect, useState } from "react";

export const getBlogs = async () => {
    const res = await fetch("http://localhost:3000/api/blogs", {
        next: { revalidate: 60 }
    });
    const data = await res.json();
    return data.blogs;
}
const BlogsPage = () => {
    const [searchText, setSearchText] = useState("");
    const [blogs, setBlogs] = useState<BlogItemType[]>([]);
    const [filters, setFilters] = useState<string>("");
    const [filteredData, setFilteredData] = useState<BlogItemType[]>([]);

    useEffect(() => {
        getBlogs().then((data) => {
            setBlogs(data);
            setFilteredData(data);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    useEffect(() => {
        setFilteredData(blogs.filter((blog) => blog.title.includes(searchText)));
    }, [searchText]);
    useEffect(() => {
        setFilteredData(blogs.filter((blog) => blog.categoryId === filters));
    }, [filters]);

    return (
        <section className="w-full h-full">
            <div className="flex flex-col gap-3 my-10 p-8">
                <h4 className="text-3xl font-semibold">
                    Explore Articles On Various Categories
                </h4>
                <p className="text-xl font-semibold">
                    Browse through our collection of articles on various categories.
                </p>
            </div>
            <nav className="bg-gray-100 border w-full flex my-4 sticky top-0 bg-center gap-4 h-20 md:p-8 xs:p-2 justify-between items-center">
                <div className="mr-auto flex md:w-1/4 xs:2/4 items-center gap-6">
                    <p className="font-semibold text-2xl">Filter</p>
                    <select
                        onChange={(e) => setFilters(e.target.value)}
                        name="category"
                        id="select"
                        className="md:px-5 xs:px-2 w-3/4 mx-2 py-3 rounded-lg">
                        {categories.map((item) => (
                            <option className="rounded bg-gray-100" key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-2/4 flex ml-auto md:gap-6 xs:gap-2 items-center">
                    <p className="font-semibold text-2xl">Search</p>
                    <input
                        onChange={({ target }) => setSearchText(target.value)}
                        value={searchText}
                        type="text"
                        className="w-3/4 px-4 py-2 rounded-lg"
                    />
                    <FaSearch className="cursor-pointer" />
                </div>
            </nav>
            <div className="flex gap-4 flex-wrap justify-center my-1">
                {filteredData?.map((blog: BlogItemType) => (
                    <BlogItem {...blog} key={blog.id} />
                ))}
            </div>
        </section>
    );
}

export default BlogsPage;