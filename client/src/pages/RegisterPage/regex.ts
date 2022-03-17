const notUsernameRegex = /[^a-zA-Z0-9_-]/gi
const usernameRegex = /^[a-zA-Z0-9_-]{6,20}$/
const passwordRegex = /(?=.*[a-z|A-Z])(?=.*[0-9])[a-zA-Z0-9#?!@$%^&*-]{6,20}$/
const emailRegex =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
const nicknameRegex = /^[a-zA-Z0-9가-힣-_\s]{2,20}$/

export {
  notUsernameRegex,
  usernameRegex,
  passwordRegex,
  emailRegex,
  nicknameRegex,
}
