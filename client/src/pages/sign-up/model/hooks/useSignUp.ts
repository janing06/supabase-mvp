import { zodResolver } from '@hookform/resolvers/zod'
import { paths } from '@shared/paths'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { signUp } from '../../api/signUp'

const schema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type Inputs = z.infer<typeof schema>

export const useSignUp = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) })

  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => navigate(paths.home),
    onError: (error) => setErrorMessage(error.message),
  })

  const onSubmit = handleSubmit(({ email, password }) => {
    setErrorMessage(null)
    mutate({ email, password })
  })

  return { register, errors, isPending, errorMessage, onSubmit }
}
