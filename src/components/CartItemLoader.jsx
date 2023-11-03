import React, { Suspense, lazy, useEffect, useState, startTransition } from 'react';
import PreLoader from './PreLoader';
import { useParams } from 'react-router-dom';

const CartItem = lazy(() => import("./CartItem"));

function CartItemLoader() {
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
                    ? <CartItem meals={meals} categories={categories} />
                    : <PreLoader />
            }
        </Suspense>
    );
}

export default CartItemLoader;
