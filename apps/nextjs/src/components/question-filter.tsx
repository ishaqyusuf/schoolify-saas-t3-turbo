'use client'

import { parseAsString, useQueryStates } from "nuqs"


export const useQuestionFilter({})
{
    const [query,setQuery] = useQueryStates({
        classes: parseAsString,
        subjects: parseAsString
    })
}
export function QuestionFilter({})
{

}