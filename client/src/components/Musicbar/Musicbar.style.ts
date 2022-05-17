import styled from 'styled-components'

export const Wrapper = styled.div`
  z-index: 1111;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 81px;
  background-color: ${({ theme }) => theme.colors.bgColor};
`

export const Container = styled.div`
  padding: 0 1em;
  background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.12')};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > * {
    flex-shrink: 0;
  }

  & .svgBtn {
    position: relative;
    border: none;
    padding: 0;
    width: 20px;
    height: 20px;
    opacity: 0.6;
    margin-right: 6px;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      opacity: 1;
    }

    & svg {
      width: 100%;
      height: 100%;
    }
  }
`

// 음악정보
export const InfoBox = styled.div`
  padding-top: 3px;
  display: inline-block;
  height: 100%;
`

export const InfoArea = styled.div`
  height: 100%;
  display: flex;
  align-items: center;

  & > * {
    margin-right: 1em;
    &:last-child {
      margin-right: 0;
    }
  }

  & .img-container {
    position: relative;
    width: 50px;
    height: 50px;
    & .img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      border-radius: 6px;
    }

    ${({ theme }) => theme.device.tablet} {
      display: none;
    }
  }

  & .music-info {
    font-size: 0.8em;
    max-width: 200px;

    & .uploader,
    & .title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    & .uploader {
      color: ${({ theme }) => theme.colors.bgTextRGBA('0.6')};
    }
    & .title {
      color: ${({ theme }) => theme.colors.bgTextRGBA('0.86')};
    }
    & .title:hover,
    & .uploader:hover {
      color: ${({ theme }) => theme.colors.bgText};
    }

    ${({ theme }) => theme.device.tablet} {
      max-width: 150px;
    }
  }
`

// 음악 컨트롤러
export const ControllBox = styled.div`
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);

  ${({ theme }) => theme.device.desktop} {
    position: static;
    transform: translateX(0);
  }
`

export const ControllArea = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 0 auto;
  & .btn {
    padding: 12px;
    border: none;
    height: 50px;
    width: 50px;

    & svg {
      width: 100%;
      height: 100%;
    }
  }

  & .playBtn {
    border-radius: 25px;
    color: ${({ theme }) => theme.colors.primaryColor};
    &:hover {
      background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.06')};
    }

    & svg {
      transform: translateX(2px);
    }
  }

  & .specialBtn,
  & .backwardBtn,
  & .fowardBtn {
    height: 45px;

    &:hover {
      height: 47.5px;
    }
  }

  ${({ theme }) => theme.device.tablet} {
    & .specialBtn {
      display: none;
    }
  }
`

export const SubControllBox = styled.div`
  display: flex;
  align-items: center;

  & .drawerBtn.block {
    cursor: not-allowed;
  }
`

export const VolumeArea = styled.div`
  z-index: 11111;
  position: relative;
  transform: translateY(1px);
  & .volume-controll {
    display: none;
  }
  &:hover .volume-controll {
    display: block;
  }
`

export const VolumeControll = styled.div`
  transform: translate(-50%, -90px);
  position: absolute;
  border-radius: 3px;
  top: -10px;
  left: 50%;
  background-color: ${({ theme }) => theme.colors.bgColor};
  cursor: default;

  & .volume-container {
    border-radius: inherit;
    width: 30px;
    height: 100px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.12')};
    box-shadow: 0 0 6px ${({ theme }) => theme.colors.bgColorRGBA('0.3')};

    & .volume {
      cursor: pointer;
      width: 80px;
      height: 6px;
      transform: rotate(270deg);
    }
  }
`

export const PlaylistArea = styled.div`
  margin-left: 0.5em;
`
