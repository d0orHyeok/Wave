import React from 'react'
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar'
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert'

interface IAlertProps extends SnackbarProps {
  severity?: AlertColor
  alertText: string
}

const MyAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Alert = ({ alertText, severity, ...props }: IAlertProps) => {
  return (
    <Snackbar {...props}>
      <MyAlert severity={severity} sx={{ width: '100%' }}>
        {alertText}
      </MyAlert>
    </Snackbar>
  )
}

export default Alert
