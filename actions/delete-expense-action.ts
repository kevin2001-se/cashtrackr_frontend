'use server'

import getToken from "@/src/auth/token";
import { ErrorResponseSchema, SuccessSchema } from "@/src/schemas";
import { revalidateTag } from "next/cache";

type ActionStateType = {
    errors: string[];
    success: string;
}

type BudgetAndExpense = {budgetId: number, expenseId: number}

export async function deleteExpense({ budgetId, expenseId }: BudgetAndExpense, prevState: ActionStateType) {
        
    const token = getToken();

    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`;
    const request = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    
    const json = await request.json();

    if (!request.ok) {
        const error = ErrorResponseSchema.parse(json)

        return {
            errors: [error.error],
            success: ''
        }
    }
        
    // revalidatePath('/admin')
    revalidateTag('all-budgets')
        
    const success = SuccessSchema.parse(json)

    return {
        errors: [],
        success
    }
}