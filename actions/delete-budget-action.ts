'use server'

import getToken from "@/src/auth/token";
import { Budget, ErrorResponseSchema, PasswordValidationSchema, SuccessSchema } from "@/src/schemas";
import { revalidateTag } from "next/cache";

type ActionStateType = {
    errors: string[];
    success: string;
}

export async function deleteBudget(budgetId: Budget['id'],prevState: ActionStateType, formData: FormData) {

    const currentPassword = PasswordValidationSchema.safeParse(formData.get('password'))

    if (!currentPassword.success) {
        return {
            errors: currentPassword.error.issues.map(issue => issue.message),
            success: ''
        }
    }
            
    const token = getToken();

    // Comprobar password
    const checkPasswordURL = `${process.env.API_URL}/auth/check-password`;
    const checkPasswordReq = await fetch(checkPasswordURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            password: currentPassword.data
        })
    })
        
    const checkPasswordJson = await checkPasswordReq.json();

    if (!checkPasswordReq.ok) {
        const error = ErrorResponseSchema.parse(checkPasswordJson)

        return {
            errors: [error.error],
            success: ''
        }
    }

    const deleteBudgetURL = `${process.env.API_URL}/budgets/${budgetId}`;
    const deleteBudgetReq = await fetch(deleteBudgetURL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        
    const deleteBudgetJson = await deleteBudgetReq.json();

    if (!deleteBudgetReq.ok) {
        const error = ErrorResponseSchema.parse(deleteBudgetJson)

        return {
            errors: [error.error],
            success: ''
        }
    }
    
    // revalidatePath('/admin')
    revalidateTag('all-budgets')
        
    const success = SuccessSchema.parse(deleteBudgetJson)

    return {
        errors: [],
        success
    }
}