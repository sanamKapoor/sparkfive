import { useState, useRef } from 'react'

const ToggleableAbsoluteWrapper = ({ Wrapper, Content, wrapperClass = '', contentClass = '', closeOnAction = true, onCloseAction = false, onClose = () => { }, ignoreSelect = false }) => {

  const wrapperRef = useRef(null)
  const contentRef = useRef(null)

  const [isOpen, setIsOpen] = useState(false)

  const handleClickOutside = ({ target }) => {

    if (ignoreSelect) {
      const allowedDivs = ['svg', 'path']
      const allowedClass = 'select-prefix__indicator'
      if (allowedDivs.includes(target.tagName) || target.className.includes(allowedClass)) return
    }

    if (contentRef.current && !contentRef.current.contains(target) && !wrapperRef.current.contains(target)) {
      setDropdownOpen(null, false)
    }
  }

  const setDropdownOpen = (e, visible) => {
    if (e)
      e.stopPropagation()

    if (visible === false && onCloseAction) {
      onClose()
    }
    setIsOpen(visible)
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }

  return (
    <div ref={wrapperRef} className={wrapperClass} onClick={(e) => {
      setDropdownOpen(e, !isOpen)
    }}>
      <Wrapper>
        {isOpen &&
          <div ref={contentRef} className={contentClass} onClick={(e) => {
            if (!closeOnAction) e.stopPropagation()
          }}
          >
            <Content />
          </div>
        }
      </Wrapper>
    </div>
  )
}

export default ToggleableAbsoluteWrapper