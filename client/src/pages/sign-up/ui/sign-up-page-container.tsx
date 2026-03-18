import { useSignUp } from '../model/hooks/useSignUp'
import { SignUpPage } from './sign-up-page'

export const SignUpPageContainer = () => {
  const form = useSignUp()
  return <SignUpPage form={form} />
}
