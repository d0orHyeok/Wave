import * as S from './Register.style'
import * as regex from './regex'
import React, { useState } from 'react'
import TextField from '@components/Common/TextField'

const Register = () => {
  const [registerInput, setRegisterInput] = useState({
    username: '',
    password: '',
    passwordConfirmed: '',
    email: '',
    nickname: '',
  })
  // NORMAL: 0, ERROR: -1, VALIDATE: 1
  const [inputValidate, setInputValidate] = useState({
    username: 0,
    password: 0,
    passwordConfirmed: 0,
    email: 0,
    nickname: 0,
  })
  const [checkbox, setCheckbox] = useState({
    term1: false,
    term2: false,
  })

  const { username, password, passwordConfirmed, email, nickname } =
    registerInput

  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.currentTarget
    setCheckbox({ ...checkbox, [id]: checked })
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.currentTarget
    setRegisterInput({ ...registerInput, [id]: value })
    validationCheck(id, value.trim())
  }

  const validationCheck = (id: string, value: string) => {
    let validate = 0
    if (value.length) {
      switch (id) {
        case 'username':
          validate =
            regex.usernameRegex.test(value) &&
            !regex.notUsernameRegex.test(value)
              ? 1
              : -1
          break
        case 'password':
          validate = regex.passwordRegex.test(value) ? 1 : -1
          break
        case 'email':
          validate = regex.emailRegex.test(value) ? 1 : -1
          break
        case 'nickname':
          validate = regex.nicknameRegex.test(value) ? 1 : -1
          break
        case 'passwordConfirmed':
          validate = value === password ? 1 : -1
          break
      }
    }
    setInputValidate({ ...inputValidate, [id]: validate })
  }

  return (
    <S.Wrapper>
      <h1 className="register-title">Register</h1>
      <S.InputArea>
        <TextField
          className="register-input"
          type="text"
          id="username"
          placeholder="ID*"
          value={username}
          onChange={handleChangeInput}
          success={inputValidate.username === 1}
          error={inputValidate.username === -1}
          errorText="영문자, 숫자를 포함한 6~20자의 아이디를 입력해주세요"
        />
        <TextField
          className="register-input"
          type="password"
          id="password"
          placeholder="Password*"
          value={password}
          onChange={handleChangeInput}
          success={inputValidate.password === 1}
          error={inputValidate.password === -1}
          errorText="영문자, 숫자를 포함한 6~20자의 비밀번호를 입력해주세요"
        />
        <TextField
          className="register-input"
          type="password"
          id="passwordConfirmed"
          placeholder="Password Confirmed*"
          value={passwordConfirmed}
          onChange={handleChangeInput}
          success={inputValidate.passwordConfirmed === 1}
          error={inputValidate.passwordConfirmed === -1}
          errorText="비밀번호가 일치하지 않습니다."
        />
        <TextField
          className="register-input"
          type="text"
          id="email"
          placeholder="Email*"
          value={email}
          onChange={handleChangeInput}
          success={inputValidate.email === 1}
          error={inputValidate.email === -1}
          errorText="올바르지 않은 Email 입니다."
        />
        <TextField
          className="register-input"
          type="text"
          id="nickname"
          placeholder="Nickname"
          value={nickname}
          onChange={handleChangeInput}
          success={inputValidate.nickname === 1}
          error={inputValidate.nickname === -1}
          errorText="한영, 숫자, _-, 2~20자의 닉네임을 입력해주세요."
        />
        <S.TermBox className="register-term">
          <h2 className="register-term-title">Terms 1</h2>
          <div className="register-term-text">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit,
            sint tempora? Eligendi neque deleniti tempore architecto consequatur
            eius cum odit suscipit veniam! Natus molestiae laboriosam nobis ex!
            Delectus, eligendi! Rerum officia doloremque, repudiandae incidunt
            veniam id et nam soluta nemo provident voluptates at temporibus
            pariatur impedit eum suscipit, laborum non numquam quis eaque!
            Pariatur rerum quae ad distinctio nulla maiores ea? Eaque, suscipit.
            Obcaecati placeat at quas, aperiam maiores non quibusdam eligendi,
            quis omnis ad optio qui. Voluptatibus officiis ipsa, nostrum ipsum
            deleniti quam commodi impedit eos. Provident natus rerum delectus,
            nostrum pariatur sunt, consequatur quia, possimus enim blanditiis
            necessitatibus!
          </div>
          <input
            id="term1"
            type="checkbox"
            checked={checkbox.term1}
            onChange={handleChangeCheckbox}
          />
          <label className="register-trem-label" htmlFor="term1">
            동의합니다
          </label>
        </S.TermBox>
        <S.TermBox className="register-term">
          <h2 className="register-term-title">Terms 2</h2>
          <div className="register-term-text">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit,
            sint tempora? Eligendi neque deleniti tempore architecto consequatur
            eius cum odit suscipit veniam! Natus molestiae laboriosam nobis ex!
            Delectus, eligendi! Rerum officia doloremque, repudiandae incidunt
            veniam id et nam soluta nemo provident voluptates at temporibus
            pariatur impedit eum suscipit, laborum non numquam quis eaque!
            Pariatur rerum quae ad distinctio nulla maiores ea? Eaque, suscipit.
            Obcaecati placeat at quas, aperiam maiores non quibusdam eligendi,
            quis omnis ad optio qui. Voluptatibus officiis ipsa, nostrum ipsum
            deleniti quam commodi impedit eos. Provident natus rerum delectus,
            nostrum pariatur sunt, consequatur quia, possimus enim blanditiis
            necessitatibus!
          </div>
          <input
            id="term2"
            type="checkbox"
            checked={checkbox.term2}
            onChange={handleChangeCheckbox}
          />
          <label className="register-trem-label" htmlFor="term2">
            동의합니다
          </label>
        </S.TermBox>
        <S.RegisterButton className="register-button">
          회원가입
        </S.RegisterButton>
      </S.InputArea>
    </S.Wrapper>
  )
}

export default Register
