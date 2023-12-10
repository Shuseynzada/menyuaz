import React, { Suspense, lazy, useEffect, useState, startTransition, useContext } from 'react';
import PreLoader from './PreLoader';
import { useParams } from 'react-router-dom';
import { MainContext } from "../context";
import { menyuazlogo } from '../assets';
import { motion } from "framer-motion"

const CartItem = lazy(() => import("./CartItem"));

const getItemById = (response, itemId) => {
    return response.find((item) => item._id === itemId);
};

function CartItemLoader() {
    const { data } = useContext(MainContext);
    const [meals, setMeals] = useState([-1]);
    const [categories, setCategories] = useState([-1]);

    const { id } = useParams();

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const categoriesAPI = await fetch(`${import.meta.env.VITE_RESTS_API}/categories/${id}`);
                const categoriesData = await categoriesAPI.json();

                const mealsAPI = await fetch(`${import.meta.env.VITE_RESTS_API}/meals/${id}`);
                const mealsData = await mealsAPI.json();

                if (!Array.isArray(categoriesData) || !Array.isArray(mealsData)) {
                    throw new Error('Data is not an array');
                }

                startTransition(() => {
                    setCategories(categoriesData.sort((a, b) => a.index - b.index));
                    setMeals(mealsData.sort((a, b) => a.index - b.index));
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchMeals();
    }, [id]);

    const item = getItemById(data, id);
    // Check if item is defined and active
    const isItemActive = item && item.isActive;

    return (
        <Suspense fallback={<PreLoader />}>
            {
                (meals && meals[0] != -1 && categories && categories[0] != -1)
                    ?
                    isItemActive
                        ? <CartItem meals={meals} categories={categories} />
                        : <motion.div initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 2 }}
                            className="p-2 flex flex-col items-center text-center"
                        >
                            <h1 className="font-bold text-[1.5em] text-red-600">Diqqət</h1><br />
                            <div className="flex items-center">
                                <p className="text-[1.2em]">
                                    Hörmətli müştəri,<br />
                                    Sizin Qr-menyunuzun abunə vaxtı bitdiyi üçün sisteminiz bağlanmışdır. Ətraflı məlumat üçün zəhmət olmasa bizimlə əlaqə saxlayın.<br />
                                    Tel:055-801-03-04
                                </p>
                            </div>
                            <img src={menyuazlogo} width="200px" className="mt-[50px]" />
                        </motion.div>
                    : <PreLoader />
            }
        </Suspense>
    );
}

export default CartItemLoader;
