import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { useAuthContext } from '../../context/authContext'
import { BaseInput } from '../../components/common/BaseInput'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUpHandler, session } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSignUp = async () => {
    console.log('email: ', email, 'password: ', password)
    let error = await signUpHandler(email, password)
    if (!error) navigate('/auth/login')
  }

  return (
    <div className="flex flex-col w-[320px] ml-[350px] mt-[200px] p-4 bg-white rounded-lg">
      <p>Register Please</p>
      <BaseInput
        name="email"
        label="email"
        placeholder="What is your email?"
        value={email}
        handleChange={e => {
          setEmail(e.target.value)
        }}
      />

      <BaseInput
        name="password"
        label="password"
        placeholder="What is your password?"
        value={password}
        type="password"
        handleChange={e => {
          setPassword(e.target.value)
        }}
      />
      <button
        className=" bg-red-600 rounded-md p-3 mt-4 text-white"
        onClick={onSignUp}
      >
        Register
      </button>
    </div>
  )
  // }
}
