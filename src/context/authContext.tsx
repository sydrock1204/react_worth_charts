import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/auth-helpers-react'
import { UserInfo } from '../utils/typing'
import { supabase } from './supabase'

interface AuthContextProps {
  session: Session | null
  user: User | null
  userInfo: UserInfo
  users: UserInfo[]
  signUpHandler: null | ((e: string, p: string) => {})
  signInHandler: null | ((e: string, p: string) => void)
  signOutHandler: null | (() => void)
  loadUsers: () => void
  isLoading: boolean // Add loading state to context props
}

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  userInfo: {} as UserInfo,
  users: [],
  signInHandler: (e: string, p: string) => {},
  signOutHandler: () => {},
  loadUsers: () => {},
  signUpHandler: (e: string, p: string) => null,
  isLoading: false, // Initialize loading state
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo)
  const [users, setUsers] = useState<UserInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true) // State to track loading

  const signInHandler = async (email: string, password: string) => {
    // console.log('signInHandler')
    const { data, error } = await supabase.auth.signInWithPassword({
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
    const { error } = await supabase.auth.signOut()
    if (error) {
      return
    }
    setUser(null)
    setSession(null)
    setUserInfo({} as UserInfo)
  }

  const signUpHandler = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    return error
  }

  const loadUsers = async () => {
    setIsLoading(true) // Set loading to true before fetching data
    supabase.auth
      .getUser()
      .then(data => {
        // console.log('userData: ', data)
        setUser(data.data.user)
        setIsLoading(false) // Set loading to false after fetching data
      })
      .catch(() => setIsLoading(false)) // Ensure loading is set to false on error
  }

  useEffect(() => {
    if (!session) {
      loadUsers()
    }
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
        signUpHandler,
        isLoading, // Provide loading state through context
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
