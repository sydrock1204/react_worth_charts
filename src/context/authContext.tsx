import React, { createContext, useContext, useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { User, Session } from '@supabase/auth-helpers-react'
import { UserInfo } from '../utils/typing'
import { supabase } from './supabase'

interface AuthContextProps {
  session: Session | null
  user: User | null
  userInfo: UserInfo
  users: UserInfo[]
  signInHandler: null | ((e: string, p: string) => void)
  signOutHandler: null | (() => void)
  loadUsers: () => void
}

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  userInfo: {} as UserInfo,
  users: [],
  signInHandler: (e: string, p: string) => {},
  signOutHandler: () => {},
  loadUsers: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo)
  const [users, setUsers] = useState<UserInfo[]>([])

  const signInHandler = async (email: string, password: string) => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (!data.user) {
      return
    }
    setSession(data.session)
    setUser(data.user)
  }

  const signOutHandler = async () => {
    let { error } = await supabase.auth.signOut()
    if (error) {
      return
    }
    setUser(null)
    setSession(null)
    setUserInfo({} as UserInfo)
  }

  const loadUsers = async () => {
    supabase.auth.getUser().then(v => console.log(v))
  }

  useEffect(() => {
    loadUsers()
  }, [session])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userInfo,
        users,
        signInHandler,
        signOutHandler,
        loadUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
