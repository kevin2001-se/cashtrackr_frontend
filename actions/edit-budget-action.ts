'use server'

import getToken from "@/src/auth/token";
import { Budget, DraftBudgetSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas";
import { revalidatePath, revalidateTag } from "next/cache";

type ActionStateType = {
    errors: string[];
    success: string;
}

export async function editBudget(budgetId: Budget['id'], prevState: ActionStateType, formData: FormData) {

    const budget = DraftBudgetSchema.safeParse({
      name: formData.get('name'),
      amount: formData.get('amount')
    })

    if (!budget.success) {
        return {
            errors: budget.error.issues.map(issue => issue.message),
            success: ''
        }
    }
        
    const token = getToken();

    const url = `${process.env.API_URL}/budgets/${budgetId}`;
    const request = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name: budget.data.name,
            amount: budget.data.amount,
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