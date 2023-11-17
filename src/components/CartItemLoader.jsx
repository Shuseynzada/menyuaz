import React, { Suspense, lazy, useEffect, useState, startTransition, useContext } from 'react';
import PreLoader from './PreLoader';
import { useParams } from 'react-router-dom';
import { MainContext } from "../context";

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


                startTransition(() => {
                    setCategories(categoriesData.sort((a, b) => {
                        return a.index - b.index
                    }));
                    setMeals(mealsData.sort((a, b) => {
                        return a.index - b.index
                    }));
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchMeals();
    }, [id]);

    return (
        <Suspense fallback={<PreLoader />}>
            {
                (meals[0] != -1 && categories[0] != -1)
                    ?
                    getItemById(data, id).isActive
                        ? < CartItem meals={meals} categories={categories} />
                        : <div className="p-2 flex flex-col items-center text-center">
                            <h1 className="font-bold text-[1.5em] text-red-600">Diqqət</h1><br />
                            <div className="flex items-center">
                                <p className="text-[1.2em]">
                                    Hörmətli müştəri,<br />
                                    Sizin Qr-menyunuzun abunə vaxtı bitdiyi üçün sisteminiz bağlanmışdır. Ətraflı məlumat üçün zəhmət olmasa bizimlə əlaqə saxlayın.<br />
                                    Tel:055-801-03-04
                                </p>
                            </div>
                            <img src={menyuazlogo} width="200px" className="mt-[50px]" />
                        </div>

                    : <PreLoader />
            }
        </Suspense>
    );
}

export default CartItemLoader;
