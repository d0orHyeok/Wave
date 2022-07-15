import React, {
  useState,
  useCallback,
  createContext,
  useEffect,
  useContext,
  useRef,
} from 'react'
import * as S from './Select.style'
import { IoIosArrowDown } from 'react-icons/io'

interface ISelectContext {
  value?: string | number
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setValue: React.Dispatch<React.SetStateAction<string | number | undefined>>
  onChangeValue?: (value?: string | number) => void
}

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string | number
  onChangeValue?: (value?: string | number) => void
}

const SelectContext = createContext<any>(null)

const Select = ({
  value: v,
  children,
  onChangeValue,
  ...props
}: SelectProps) => {
  const selectRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string | number | undefined>(v)

  const handleClick = useCallback((event: any) => {
    const isInside = selectRef.current?.contains(event.target) || false
    if (!isInside) {
      setOpen(false)
    }
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false)
    }
  }, [])

  const handleClickLabelBtn = useCallback(() => {
    setOpen((state) => !state)
  }, [])

  useEffect(() => {
    setValue(v)
  }, [v])

  useEffect(() => {
    window.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClick, handleKeyDown])

  return (
    <SelectContext.Provider value={{ setOpen, value, setValue, onChangeValue }}>
      <S.Wrapper ref={selectRef} className="door-select" {...props}>
        <S.SelectButton className="select-button" onClick={handleClickLabelBtn}>
          <span className="button-aria-label">{v}</span>
          <span className="button-aria-icon">
            <IoIosArrowDown className="icon" />
          </span>
        </S.SelectButton>
        <S.Container className="select-container" open={open}>
          <S.Content>{children}</S.Content>
        </S.Container>
      </S.Wrapper>
    </SelectContext.Provider>
  )
}

export default Select

interface OptionProps {
  value?: string | number
  children?: React.ReactNode
}

export const Option = ({ value: v, children }: OptionProps) => {
  const { value, setValue, setOpen, onChangeValue }: ISelectContext =
    useContext(SelectContext)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      event.preventDefault()
      setValue(v)
      onChangeValue && onChangeValue(v)
      setOpen(false)
    },
    [setValue, v, onChangeValue, setOpen]
  )

  return (
    <>
      <S.StyledLi
        className={v !== undefined && value === v ? 'select' : ''}
        onClick={handleClick}
        value={value}
      >
        {children}
      </S.StyledLi>
    </>
  )
}
