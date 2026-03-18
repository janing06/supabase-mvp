import { paths } from '@shared/paths'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { signIn } from '../../api/signIn'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type Inputs = z.infer<typeof schema>

export const useSignIn = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) })

  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: () => navigate(paths.home),
    onError: (error) => setErrorMessage(error.message),
  })

  const onSubmit = handleSubmit(({ email, password }) => {
    setErrorMessage(null)
    mutate({ email, password })
  })

  return { register, errors, isPending, errorMessage, onSubmit }
}
