import styled from 'styled-components'

export const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 30px;
`

export const Head = styled.div`
  display: flex;
  margin-bottom: 20px;

  & .detail-imageBox {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    margin-right: 20px;

    & .detail-imageBox-link,
    & .detail-imageBox-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .detail-info {
    & .title {
      margin-top: 10px;
      font-size: 24px;
    }
  }
`

export const NavUl = styled.ul`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

  & .detail-navItem {
    font-size: 18px;
    padding: 10px 0;
    border-bottom: 2px solid rgba(0, 0, 0, 0);

    ${({ theme }) => theme.device.tablet} {
      font-size: 14px;
    }

    &:not(:last-child) {
      margin-right: 15px;
    }

    &.select,
    &:hover {
      color: ${({ theme }) => theme.colors.primaryColor};
      border-color: ${({ theme }) => theme.colors.primaryColor};
    }
  }
`

export const Content = styled.div``
