import styled from 'styled-components'

const EmptyProfileImage = styled.div<{ size?: number }>`
  display: inline-block;
  width: ${({ size }) => (!size ? '200px' : `${size}px`)};
  height: ${({ size }) => (!size ? '200px' : `${size}px`)};
  border-radius: ${({ size }) => (!size ? '100px' : `${size / 2}px`)};
  background: rgb(158, 140, 158);
  background: linear-gradient(
    135deg,
    rgba(158, 140, 158, 1) 0%,
    rgba(89, 133, 138, 1) 100%
  );
`

export default EmptyProfileImage
export const EmptyProfileImageBackground = `
background: rgb(89,133,138);
background: linear-gradient(135deg, rgba(89,133,138,1) 0%, rgba(158, 140, 158,1) 100%);
`
