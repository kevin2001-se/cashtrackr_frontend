'use server'

import getToken from "@/src/auth/token";
import { DraftExpenseSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas";
import { revalidateTag } from "next/cache";

type ActionStateType = {
    errors: string[];
    success: string;
}

export async function createExpense(budgetId: string, prevState: ActionStateType, formData: FormData) {

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

    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses`;
    const request = await fetch(url, {
        method: 'POST',
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