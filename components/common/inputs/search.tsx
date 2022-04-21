import styles from './search.module.css'
import { Utilities } from '../../../assets'
import { useState } from 'react'

// Components
import Button from '../buttons/button'

const Search = (props) => {

  const [term, setTerm] = useState('')
  const [filtersTags, setFiltersTags] = useState([])

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

  const addTag = ( tag ) => {
    if(filtersTags.some(filter => filter.value === tag.value)) {
      return
    } else {
      setFiltersTags([...filtersTags, tag])
    }
  }  

  const removeTag = (index) => {
    const newTags = filtersTags.filter((tag, i) => index !== i)
    setFiltersTags([...newTags])
  }

  console.log(filtersTags)

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      props.onSubmit(term)
    }}>
      <div className={styles.form}>
        <div className={styles['input-container']}>
          <img src={Utilities.search} />
          <input
            onFocus={() => console.log('focused')}
            onBlur={() => console.log('blur')}
            {...props}
            onChange={(e) => setTerm(e.target.value)}
            value={term}
            placeholder={props.placeholder || 'Search'}
            className={`${styles.container} ${props.styleType && styles[props.styleType]}`}
          />
        </div>
        <Button
          disabled={term.length < 1}
          type={'submit'}
          text='Search'
          styleType='primary'
        />
      </div>
      <div>
        {filters.map((filter, index) => (
          <div key={index} onClick={() => addTag(filter)}>
            {filter.label}
          </div>
        ))}

        {limitBy.map((item, index) => (
          <div key={index}>
            <img src={item.icon} />
            {item.label}
          </div>
        ))}
      </div>
    </form>
  )
}

export default Search
