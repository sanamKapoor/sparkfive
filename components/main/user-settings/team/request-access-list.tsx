import styles from './member-list.module.css'

// Components
import Request from './request'

const RequestAccessList = ({ members, type = 'member', onChange }) => {

  return (
    <>
      <ul className={styles.container}>
        {members.map(member => (
          <Request
            key={member.id}
            id={member.id}
            email={member.email}
            name={member.name}
            onChange={(type)=>{onChange(type, member)}}
          />
        ))}
      </ul>
    </>
  )
}

export default RequestAccessList
