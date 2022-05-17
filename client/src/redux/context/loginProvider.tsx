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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AlertContext = createContext<any>({})

export const LoginProvider = ({ children }: ILoginProviderProps) => {
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <AlertContext.Provider value={{ open, setOpen }}>
      <Modal open={open} onClose={handleClose}>
        <Login onClose={handleClose} />
      </Modal>
      {children}
    </AlertContext.Provider>
  )
}

export const useLoginOpen = () => {
  const context: ILoginContext = useContext(AlertContext)
  const setOpen = context.setOpen

  const openLoginModal = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return openLoginModal
}
