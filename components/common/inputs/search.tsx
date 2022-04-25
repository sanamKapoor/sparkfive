import styles from './search.module.css'
import { Utilities } from '../../../assets'
import { useRef, useState } from 'react'

// Components
import Button from '../buttons/button'

const Search = (props) => {

  const [term, setTerm] = useState('')
  const [filtersTags, setFiltersTags] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef(null)

  const filters = [
    {
      label: 'Any',
      value: 'any'
    },
    {
      label: 'All',
      value: 'all'
    },
    {
      label: 'Phrase',
      value: 'phrase'
    },
    {
      label: 'Exact',
      value: 'exact'
    }
  ]

  const limitBy = [
    {
      label: 'Tags only',
      value: 'tags',
      icon: Utilities.tags
    },
    {
      label: 'Custom fields only',
      value: 'custom',
      icon: Utilities.custom
    },
    {
      label: 'Collections only',
      value: 'collections',
      icon: Utilities.collections
    },
    {
      label: 'Files name only',
      value: 'filesName',
      icon: Utilities.file
    },
  ]

  const addTag = (tag) => {
    if (filtersTags.some(filter => filter.value === tag.value)) {
      return
    } else {
      setFiltersTags([...filtersTags, tag])
    }
  }

  const removeTag = (index) => {
    const newTags = filtersTags.filter((tag, i) => index !== i)
    setFiltersTags([...newTags])
  }

  const handleClickOutside = (event) => {
    if (contentRef.current && !contentRef.current.contains(event.target)) {
      setFiltersVisible(null, false)
    }
  }

  const setFiltersVisible = (e, visible) => {
    if (e) {
      e.stopPropagation()
    }
    setIsOpen(visible)
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      props.onSubmit(term)
    }}>
      <div className={styles.form}>
        <div className={styles['input-container']} ref={contentRef}>
          <img src={Utilities.search} />
          {filtersTags.length > 0 &&
            <div className={styles.tags}>
              {filtersTags.map((tag, index) => (
                <div className={styles.tag} key={index}>
                  {tag.icon &&
                    <img src={tag.icon} />
                  }
                  {tag.label}
                  <span onClick={() => removeTag(index)}>
                    <img src={Utilities.close} />
                  </span>
                </div>
              ))}
            </div>
          }
          <input
            onFocus={() => setFiltersVisible(null, true)}
            {...props}
            onChange={(e) => setTerm(e.target.value)}
            value={term}
            placeholder={props.placeholder || 'Search'}
            className={`${styles.container} ${props.styleType && styles[props.styleType]}`}
          />
          {isOpen &&
            <div className={styles.filters}>
              <h5>Search Filter</h5>
              <ul>
                {filters.map((filter, index) => {

                  let active = filtersTags.some(tag => tag.value === filter.value) ? true : false

                  return (
                    <li key={`filter-${index}`} className={`${styles.filter} ${active ? styles['filter-active'] : ''}`} onClick={() => addTag(filter)}>
                      {filter.label}
                    </li>
                  )
                })}

              </ul>
              <h5>Limit by</h5>
              <ul>
                {limitBy.map((item, index) => {

                  let active = filtersTags.some(tag => tag.value === item.value) ? true : false

                  return (
                    <li key={`limit-by-${index}`} className={`${styles.limit} ${active ? styles['limit-active'] : ''}`} onClick={() => addTag(item)}>
                      <img src={item.icon} />
                      {item.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          }
        </div>
        <Button
          disabled={term.length < 1}
          type={'submit'}
          text='Search'
          styleType='primary'
        />
      </div>
    </form>
  )
}

export default Search
