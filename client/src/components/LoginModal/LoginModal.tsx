import React, { useState } from 'react'
import { Modal } from '@components/Common'
import TextField from '@components/Common/TextField'
import * as S from './LoginModal.style'
import { Link } from 'react-router-dom'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

const textFieldStyle = { width: '300px', marginBottom: '1rem' }

const LoginModal = (props: LoginModalProps) => {
  const [inputValue, setInputValue] = useState({
    username: '',
    password: '',
  })

  const { username, password } = inputValue

  const handleChangeInput = (evnet: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = evnet.currentTarget
    setInputValue({ ...inputValue, [id]: value })
  }

  return (
    <Modal {...props}>
      <S.ModalWrapper>
        <S.StyledContainer>
          <h1 className="modal-title">Sign In</h1>
          <S.Box>
            <TextField
              type="text"
              id="username"
              placeholder="ID"
              style={textFieldStyle}
              value={username}
              onChange={handleChangeInput}
            />
            <TextField
              type="password"
              id="password"
              placeholder="Password"
              style={textFieldStyle}
              value={password}
              onChange={handleChangeInput}
            />
          </S.Box>
          <S.Box className="signin-loginbox">
            <input type="checkbox" id="saveID" />
            <label htmlFor="saveID">아이디 저장</label>
            <S.LoginButton>로그인</S.LoginButton>
          </S.Box>
          <S.Box className="signin-more">
            <ul className="signin-find">
              <li>
                <Link to="#">아이디 찾기</Link>
              </li>
              <li>
                <Link to="#">비밀번호 찾기</Link>
              </li>
            </ul>
            <span className="siginin-register">
              <Link to="register">회원가입</Link>
            </span>
          </S.Box>
        </S.StyledContainer>
      </S.ModalWrapper>
    </Modal>
  )
}

export default React.memo(LoginModal)
