import styles from './search.module.css'
import { Utilities } from '../../../assets'
import { useRef, useState, useContext, useEffect } from 'react'
import { FilterContext, UserContext } from '../../../context'

// Components
import Button from '../buttons/button'
import { useDebounce } from '../../../hooks/useDebounce'

const Search = (props) => {

  const { openFilters, setOpenFilters } = props

  const [input, setInput] = useState('');

  const {setSearchTerm} = useContext(FilterContext);

  const debouncedSearchTerm = useDebounce(input, 500);

  useEffect( () => {
    setSearchTerm(debouncedSearchTerm);
    if(setOpenFilters){
      setOpenFilters(false);
    }
    
}, [debouncedSearchTerm]);

  const [filtersTags, setFiltersTags] = useState([])
  const contentRef = useRef(null)
  let isOpen = openFilters

  const { advancedConfig } = useContext(UserContext)

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
      label: 'Tags only',
      value: 'tags.name',
      icon: Utilities.tags
    },
    {
      label: 'Custom fields only',
      value: 'attributes.name',
      icon: Utilities.custom
    },
    {
      label: 'Collections only',
      value: 'folders.name',
      icon: Utilities.collections
    },
    {
      label: 'File name only',
      value: 'assets.name',
      icon: Utilities.file
    },
    {
      label: "Notes",
      value: "notes.text",
      icon: Utilities.notes,
    },
  ]

  // if (filtersTags.length === 0 && advancedConfig.searchDefault === 'tags_only') {
  //   setFiltersTags([...filtersTags, searchFrom[0]])
  // }

  const addTag = (tag, isFilter) => {
    let selectedItems = [...filtersTags]
    if (isFilter) {
      selectedItems = selectedItems?.filter(item => {
        const isSelected = searchModes?.some(fItem => fItem.value === item.value)
        return !isSelected
      })
    } else {
      selectedItems = selectedItems?.filter(filter => filter.value !== tag.value)
    }

    setFiltersTags([...selectedItems, tag])
  }

  const removeTag = (index) => {
    const newTags = filtersTags?.filter((tag, i) => index !== i)
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
    isOpen = visible
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const selectedModes = searchModes?.filter((filter) => {
        return filtersTags?.some(tag => tag.value === filter.value)
      })?.map(item => item.value)
    
      const from = searchFrom?.filter((filter) => {
        return filtersTags?.some(tag => tag.value === filter.value)
      })?.map(item => item.value)

      props.onSubmit(input, { advSearchMode: selectedModes, advSearchFrom: from })
    }}>
      <div className={styles.form}>
        <div className={styles['input-container']} ref={contentRef} onClick={() => setFiltersVisible(null, true)}>
          <div className={styles["input-wrapper"]}>
            <img src={Utilities.search} />
            <input {...props}
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={(e) => hideSearchOnEnter(e)}
              value={input}
              placeholder={props.placeholder || 'Search'}
              className={`${styles.container} ${props.styleType && styles[props.styleType]}`}
            />
          </div>
          {filtersTags.length > 0 &&
            <div className={styles.tags}>
              {filtersTags?.map((tag, index) => (
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

          {isOpen &&
            <div className={styles.filters}>
              <h5>Search Filters</h5>
              <ul>
                {searchModes?.map((filter, index) => {

                  let active = filtersTags?.some(tag => tag.value === filter.value) ? true : false

                  return (
                    <li key={`filter-${index}`} className={`${styles.filter} ${active ? styles['filter-active'] : ''}`} onClick={() => addTag(filter, true)}>
                      {filter.label}
                    </li>
                  )
                })}

              </ul>
              <ul>
                {searchFrom?.map((item, index) => {

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
      </div>
    </form>
  )
}

export default Search
