'use server'

import getToken from "@/src/auth/token";
import { DraftExpenseSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas";
import { revalidateTag } from "next/cache";

type ActionStateType = {
    errors: string[];
    success: string;
}

type BudgetAndExpense = {budgetId: number, expenseId: number}

export async function editExpense({ budgetId, expenseId }: BudgetAndExpense, prevState: ActionStateType, formData: FormData) {

    const expense = DraftExpenseSchema.safeParse({
      name: formData.get('name'),
      amount: formData.get('amount')
    })

    if (!expense.success) {
        return {
            errors: expense.error.issues.map(issue => issue.message),
            success: ''
        }
    }
        
    const token = getToken();

    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`;
    const request = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name: expense.data.name,
            amount: expense.data.amount,
        })
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