import React from 'react'
import * as S from './Footer.style'
import { AiFillFacebook, AiFillInstagram, AiFillYoutube } from 'react-icons/ai'

type FooterProps = React.HTMLAttributes<HTMLElement>

interface ItemData {
  head: string
  content: string | JSX.Element
}

const waveInfoData = [
  { head: 'WAVE 페이지 제작자', content: '김장혁' },
  { head: '사업자등록번호', content: '000-00-00000' },
  { head: '주소', content: 'OO OO시 OO로 WAVE' },
  { head: '대표전화', content: '0000-0000' },
  {
    head: '이메일',
    content: (
      <a href="mailto:d0or_hyeok@naver.com" target="_blank" rel="noreferrer">
        d0or_hyeok@naver.com
      </a>
    ),
  },
  { head: 'Item', content: 'Content' },
]

const termsData = [
  { link: '#', content: 'WAVE 소개' },
  { link: '#', content: '개인정보처리방침' },
  { link: '#', content: 'WAVE 이용약관' },
  { link: '#', content: '고객센터' },
]

const makeFooterItem = (itemData: ItemData) => (
  <span key={itemData.head} className="item">
    <span className="item-head">{itemData.head}</span>
    {itemData.content}
  </span>
)

const Footer = (props: FooterProps) => {
  return (
    <S.Wrapper {...props}>
      <S.Container>
        <S.Section className="notice">
          <S.FooterLink to="#">공지사항</S.FooterLink>
        </S.Section>
        <S.Divider />
        <S.SectionInfo className="waveInfo">
          {waveInfoData.map((item) => makeFooterItem(item))}
        </S.SectionInfo>
        <S.SectionTerms className="terms">
          {termsData.map((item) => (
            <S.FooterLink key={item.content} to={item.link}>
              {item.content}
            </S.FooterLink>
          ))}
        </S.SectionTerms>
        <S.SectionSNS className="sns">
          <a href="https://facebook.com/" target="_blank" rel="noreferrer">
            <AiFillFacebook />
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
            <AiFillYoutube />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            <AiFillInstagram />
          </a>
        </S.SectionSNS>
      </S.Container>
    </S.Wrapper>
  )
}

export default React.memo(Footer)
