import styled from 'styled-components'

const EmptyPlaylistImage = styled.div<{ size?: number }>`
  display: inline-block;
  width: ${({ size }) => (!size ? '200px' : `${size}px`)};
  height: ${({ size }) => (!size ? '200px' : `${size}px`)};
  background: rgb(82, 150, 147);
  background: linear-gradient(
    135deg,
    rgba(82, 150, 147, 1) 0%,
    rgba(163, 138, 81, 1) 100%
  );
`

export default EmptyPlaylistImage
export const EmptyPlaylistImageBackground = `
background: rgba(163, 138, 81, 1);
background: linear-gradient(135deg, rgba(163, 138, 81, 1) 0%, rgba(82,150,147,1) 100%);
`
