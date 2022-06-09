import { createContext, useCallback, useContext, useState } from 'react'
import { Modal } from '@components/Common'
import Login from '@components/InnerModal/Login/Login'

interface ILoginProviderProps {
  children: React.ReactNode
}

interface ILoginContext {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginContext = createContext<any>({})

export const LoginProvider = ({ children }: ILoginProviderProps) => {
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <LoginContext.Provider value={{ open, setOpen }}>
      <Modal open={open} onClose={handleClose}>
        <Login onClose={handleClose} />
      </Modal>
      {children}
    </LoginContext.Provider>
  )
}

export const useLoginOpen = () => {
  const context: ILoginContext = useContext(LoginContext)
  const setOpen = context.setOpen

  const openLoginModal = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return openLoginModal
}
