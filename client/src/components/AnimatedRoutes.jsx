import React from "react";
import Home from "./Home";
import Contact from "./Contact";
import Restaurants from "./Restaurants";
import NotFound from "./NotFound";
import Navbar from "./Navbar";
import {
    Outlet,
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import CartItemLoader from "./CartItemLoader";
import About from "./About";
import { menyuazlogo } from "../assets";
const Layout = () => {
    return (
        <>
            <Navbar />
            <div className="bg-white min-h-[100vh] pt-[3em] flex flex-col">
                <div className="bg-black h-[20vh] flex w-full">
                    <div className="h-full w-[50%] flex justify-center">
                        <img src={menyuazlogo} className="h-full px-3" />
                    </div>
                    <div className="h-full w-[50%] flex flex-col p-4 justify-center items-center text-white">
                        <div className="bg-yellow-500 h-[0.3em] w-full"></div>
                        <p>Bizimlə əlaqə</p>
                        <p>+994 55 801 03 04</p>
                        <p>+994 50 801 03 03</p>
                    </div>
                </div>
                <div className="bg-yellow-500 h-[0.3em]"></div>
                <Outlet />
                <div className="h-[10vh] bg-yellow-500 px-2">
                    Menyu.az ©️ 2021
                    <br />
                    Azərbaycanın ən böyük menyu mərkəzi
                </div>
            </div>
        </>
    );
};

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route exact path="/restaurants/" element={<Restaurants />} />
                <Route exact path="/about" element={<About />} />
                <Route exact path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
            </Route>
            <Route
                path="/restaurants/:id/*"
                element={<CartItemLoader />}
                errorElement={<NotFound />}
            />
        </Route>
    )
);

export default function AnimatedRoutes() {
    return (
        <>
            <AnimatePresence>
                <RouterProvider router={router} />
            </AnimatePresence>
        </>
    );
}
