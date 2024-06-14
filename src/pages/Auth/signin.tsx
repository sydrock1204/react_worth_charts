import { useState, useEffect, useContext } from 'react'
import { useNavigate, redirect } from 'react-router-dom'

import { useAuthContext } from '../../context/authContext'
import { BaseInput } from '../../components/common/BaseInput'

export default function WorthAuth() {
  const navigate = useNavigate()
  const { signInHandler, session } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // if (session) {
  //   return redirect('/chart')
  // } else {
  return (
    <div className="flex flex-col w-[320px] ml-[350px] mt-[200px] p-4 bg-white rounded-lg">
      <p>LogIn Please</p>
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
        onClick={() => {
          // if (!signInHandler) {
          //   return
          // } else {
          signInHandler(email, password)
          // }
        }}
      >
        LogIn
      </button>
    </div>
  )
  // }
}
