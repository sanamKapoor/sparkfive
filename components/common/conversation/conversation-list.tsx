import styles from './conversation-list.module.css'
import conversationApi from '../../../server-api/conversation'
import { useState, useEffect, useContext } from 'react'
import update from 'immutability-helper'
import { TeamContext } from '../../../context'

// Components
import Conversation from './conversation'
import CommentInput from './comment-input'

const ConversationList = ({ itemType, itemId }) => {
  const [conversations, setConversations] = useState([])

  const { teamMembers, getTeamMembers } = useContext(TeamContext)

  useEffect(() => {
    getConversations()
    getTeamMembers()
  }, [])

  const getConversations = async () => {
    try {
      const { data } = await conversationApi.getConversations(itemType, itemId)
      setConversations(data)
    } catch (err) {
      console.log(err)
      // TODO: Handle error
    }
  }

  const addComment = async (content, conversationId = 'new') => {
    try {
      const mentions = getMentionsFromContent(content)
      const { data } = await conversationApi.createComment(itemType, itemId, conversationId, { content, mentions })
      if (conversationId === 'new') {
        setConversations(update(conversations, {
          $push: [data]
        }))
      }
      else {
        const conversationIndex = conversations.findIndex(conv => conv.id === conversationId)
        setConversations(update(conversations, {
          [conversationIndex]: { $set: data }
        }))
      }
    } catch (err) {
      console.log(err)
      // TODO: Handle error
    }
  }

  const getMentionsFromContent = (content) => {
    const mentionSet = new Set()
    teamMembers.filter(member => content.includes(`@${member.name}`)).forEach(member => mentionSet.add(member.id))
    return Array.from(mentionSet).map(memberId => ({ id: memberId }))
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Comments</h2>
        <span>{`${conversations.length} comment(s)`}</span>
      </div>

      <CommentInput onSubmit={addComment} />
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <Conversation
              comments={conversation.comments}
              addComment={(content) => addComment(content, conversation.id)} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ConversationList