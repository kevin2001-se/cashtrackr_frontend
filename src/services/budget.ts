import { cache } from "react";
import getToken from "../auth/token";
import { notFound } from "next/navigation";
import { BudgetAPIResponseSchema } from "../schemas";

// cache: si los datos no han cambiado se usara la misma-
export const getBudgetId = cache(async (budgetId: string) => {
    const token = getToken();
    
    const url = `${process.env.API_URL}/budgets/${budgetId}`;
    const request = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        next: {
            tags: ['all-budgets']
        }
    })
    
    const json = await request.json();

    if (!request.ok) {
        notFound();    
    }

    const budget = BudgetAPIResponseSchema.parse(json);

    return budget;
})