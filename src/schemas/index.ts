import { z } from "zod";

export const RegisterSchema = z.object({
    email: z.email({message: 'Email no válido'})
        .min(1, {message: 'El Email es obligatorio.'}),
    name: z.string()
        .min(1, {message: 'Tu nombre no puede ir vacío.'}),
    password: z.string()
        .min(8, 'La contraseña es muy corto, mínimo 8 caracteres.'),
    password_confirmation: z.string()
}).refine(({password, password_confirmation}) => password === password_confirmation, {
    message: 'Las contraseñas no son iguales.',
    path: ['password_confirmation']
})

export const LoginSchema = z.object({
        email: z.string()
                .min(1, {message: 'El Email es Obligatorio'})
                .email( {message: 'Email no válido'}),
        password: z.string()
                .min(1, {message: 'El Password no puede ir vacio'})
})

export const TokenSchemma = z.string({message: 'Token no válido'})
                                .length(6, {message: 'Token no válido'});

export const ForgotPasswordSchema = z.object({
        email: z.email( {message: 'Email no válido'})   
                .min(1, {message: 'El Email es Obligatorio'})
    })

export const ResetPasswordSchema = z.object({
        password: z.string()
                .min(8, {message: 'El Password debe ser de al menos 8 caracteres'}),
        password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
        message: "Los Passwords no son iguales",
        path: ["password_confirmation"]
});

export const DraftBudgetSchema = z.object({
        name: z.string()
                .min(1, {message: 'El Nombre del presupuesto es obligatorio'}),
        amount: z.coerce.
                number({message: 'Cantidad no válida'})
                .min(1, {message: 'Cantidad no válida'}),
})

export const ExpenseAPIResponseSchema = z.object({
        id: z.number(),
        name: z.string(),
        amount: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        budgetId: z.number()
})

export const BudgetAPIResponseSchema = z.object({
        id: z.number(),
        name: z.string(),
        amount: z.string(),
        userId: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
        expenses: z.array(ExpenseAPIResponseSchema)
})

export const budgetApiResponsSchema = z.array(BudgetAPIResponseSchema.omit({expenses: true}))

export const PasswordValidationSchema = z.string().min(1, {message: 'El password no puede ir vacío.'})

export const DraftExpenseSchema = z.object({
        name: z.string()
                .min(1, {message: 'El Nombre del gasto es obligatorio'}),
        amount: z.coerce.
                number({message: 'Cantidad no válida'})
                .min(1, {message: 'Cantidad no válida'}),
})

export const UpdatePasswordSchema = z.object({
        current_password: z.string().min(1, {message: 'El Password no puede ir vacio'}),
        password: z.string()
                .min(8, {message: 'El Nuevo Password debe ser de al menos 8 caracteres'}),
        password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
        message: "Los Passwords no son iguales",
        path: ["password_confirmation"]
});

export const UpdateProfileSchema = z.object({
    email: z.email({message: 'Email no válido'})
        .min(1, {message: 'El Email es obligatorio.'}),
    name: z.string()
        .min(1, {message: 'Tu nombre no puede ir vacío.'})
})

// Respuesta
export const SuccessSchema = z.string()
export const ErrorResponseSchema = z.object({
    error: z.string()
})

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.email()
})

// Types
export type User = z.infer<typeof UserSchema>;
export type Budget = z.infer<typeof BudgetAPIResponseSchema>;
export type Expense = z.infer<typeof ExpenseAPIResponseSchema>;
export type DraftExpense = z.infer<typeof DraftExpenseSchema>;