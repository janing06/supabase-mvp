import { useSignIn } from '../model/hooks/useSignIn'
import { SignInPage } from './sign-in-page'

export const SignInPageContainer = () => {
  const form = useSignIn()
  return <SignInPage form={form} />
}
