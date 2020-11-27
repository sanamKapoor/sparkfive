import { useState } from 'react'
import { TagContext } from '../context'
import tagApi from '../server-api/tag'

export default ({ children }) => {
  const [tags, setTags] = useState([])
  const [topTags, setTopTags] = useState([])

  const getTags = async () => {
    try {
      const { data } = await tagApi.getTags()
      setTags(data)
    } catch (err) {
      console.log(err)
    }
  }

  const getTopTags = async () => {
    try {
      const { data } = await tagApi.getTopTags()
      setTopTags(data)
    } catch (err) {
      console.log(err)
    }
  }

  const tagValue = {
    tags,
    setTags,
    getTags,

    topTags,
    setTopTags,
    getTopTags
  }

  return (
    <TagContext.Provider value={tagValue}>
      {children}
    </TagContext.Provider>
  )
}