import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { DraftExpense } from "@/src/schemas";
import { editExpense } from "@/actions/edit-expense-action";
import { useFormState } from "react-dom";
import ErrorMessage from "../ui/ErrorMessage";
import { toast } from "react-toastify";

export default function EditExpenseForm({ closeModal }: { closeModal: () => void }) {

    const [expense, setExpense] = useState<DraftExpense>()

    const params = useParams();
    const searchParams = useSearchParams()

    const expenseId = searchParams.get('editExpenseId')
    
    const editExpenseWithBudgetId = editExpense.bind(null, {
        budgetId: +params.id,
        expenseId: +expenseId!
    })
    const [state, dispatch] = useFormState(editExpenseWithBudgetId, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_URL}/admin/api/budget/${params.id}/expense/${expenseId}`
        fetch(url)
            .then(res => res.json())
            .then(data => setExpense(data))

    }, [expenseId, params.id])
    
    useEffect(() => {
        if (state.success) {
            toast.success(state.success);
            closeModal();
        }
    }, [state, closeModal])

    return (
        <>
            <DialogTitle
                as="h3"
                className="font-black text-4xl text-purple-950 my-5"
            >
                Editar Gasto: {expense && expense.name}
            </DialogTitle>
            <p className="text-xl font-bold">Edita los detalles de un {''}
                <span className="text-amber-500">gasto</span>
            </p>
            
            {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}

            <form
                className="bg-gray-100 shadow-lg rounded-lg p-10 mt-10 border"
                noValidate
                action={dispatch}
            >

                <ExpenseForm 
                    expense={expense}
                />

                <input
                type="submit"
                className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                value='Guardar Cambios'
                />
            </form>
        </>
    )
}