import styled from 'styled-components'

const EmptyMusicCover = styled.div<{ size?: number }>`
  display: inline-block;
  width: ${({ size }) => (!size ? '200px' : `${size}px`)};
  height: ${({ size }) => (!size ? '200px' : `${size}px`)};
  background: rgb(168, 78, 62);
  background: linear-gradient(
    135deg,
    rgba(168, 78, 62, 1) 0%,
    rgba(109, 27, 130, 1) 100%
  );
`

export default EmptyMusicCover
export const EmptyMusicCoverBackgorund = `
background: rgba(109, 27, 130, 1);
background: linear-gradient(
  135deg,
  rgba(109, 27, 130, 1) 0%,
  rgba(168, 78, 62, 1) 100%
);
`
