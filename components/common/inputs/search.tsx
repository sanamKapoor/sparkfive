import styles from './search.module.css'
import { Utilities } from '../../../assets'
import { useRef, useState, useContext } from 'react'
import { UserContext } from '../../../context'

// Components
import Button from '../buttons/button'

const Search = (props) => {

  const [term, setTerm] = useState('')
  const [filtersTags, setFiltersTags] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef(null)

  const {advancedConfig} = useContext(UserContext)

  const searchModes = [
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

  const searchFrom = [
    {
      label: 'Tags',
      value: 'tags.name',
      icon: Utilities.tags
    },
    {
      label: 'Custom fields',
      value: 'attributes.name',
      icon: Utilities.custom
    },
    {
      label: 'Collections',
      value: 'folders.name',
      icon: Utilities.collections
    },
    {
      label: 'File name',
      value: 'assets.name',
      icon: Utilities.file
    },
    {
      label: "Notes",
      value: "notes.text",
      icon: Utilities.notes,
    },
  ]

  if (filtersTags.length === 0 && advancedConfig.searchDefault==='tags_only') {
    setFiltersTags([...filtersTags, searchFrom[0]])
  }

  const addTag = (tag, isFilter) => {
    let selectedItems = [...filtersTags]
    if (isFilter) {
      selectedItems = selectedItems.filter(item => {
        const isSelected = searchModes.some(fItem => fItem.value === item.value)
        return !isSelected
      })
    } else {
      selectedItems = selectedItems.filter(filter => filter.value !== tag.value)
    }

    setFiltersTags([...selectedItems, tag])
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

  const hideSearchOnEnter = (ev) => {
    if (ev.keyCode === 13) {
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
      const selectedModes = searchModes.filter((filter) => {
        return filtersTags.some(tag => tag.value === filter.value)
      }).map(item => item.value)
    
      const from = searchFrom.filter((filter) => {
        return filtersTags.some(tag => tag.value === filter.value)
      }).map(item => item.value)

      props.onSubmit(term, {advSearchMode: selectedModes, advSearchFrom: from})
    }}>
      <div className={styles.form}>
        <div className={styles['input-container']} ref={contentRef} onClick={() => setFiltersVisible(null, true)}>
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
          <input {...props}
            onChange={(e) => setTerm(e.target.value)}
            onKeyUp={(e) => hideSearchOnEnter(e)}
            value={term}
            placeholder={props.placeholder || 'Search'}
            className={`${styles.container} ${props.styleType && styles[props.styleType]}`}
          />
          {isOpen &&
            <div className={styles.filters}>
              <h5>Search Mode</h5>
              <ul>
                {searchModes.map((filter, index) => {

                  let active = filtersTags.some(tag => tag.value === filter.value) ? true : false

                  return (
                    <li key={`filter-${index}`} className={`${styles.filter} ${active ? styles['filter-active'] : ''}`} onClick={() => addTag(filter, true)}>
                      {filter.label}
                    </li>
                  )
                })}

              </ul>
              <h5>Search from</h5>
              <ul>
                {searchFrom.map((item, index) => {

                  let active = filtersTags.some(tag => tag.value === item.value) ? true : false

                  return (
                    <li key={`limit-by-${index}`} className={`${styles.limit} ${active ? styles['limit-active'] : ''}`} onClick={() => addTag(item, false)}>
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
