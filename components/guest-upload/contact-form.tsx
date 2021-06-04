import styles from './contact-form.module.css'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LocationContext, TeamContext } from '../../context'

// Components
import Button from '../common/buttons/button'
import FormInput from '../common/inputs/form-input'
import Input from '../common/inputs/input'
import TextArea from '../common/inputs/text-area'
import Select from '../common/inputs/select'

const ContactForm = ({ id, onSubmit, disabled = false }) => {
  const { control, handleSubmit, errors } = useForm()

  const { countries, states, loadStates } = useContext(LocationContext)
  const { team, patchTeam } = useContext(TeamContext)

  const[name, setName] = useState('')
  const[email, setEmail] = useState('')
  const[notes, setNotes] = useState('')

  const submitForm = data => {
      onSubmit(data)
  }

  return (
    <form id={id} onSubmit={handleSubmit(submitForm)} className={styles['form']}>
      <>
        <div className={styles.container}>
          <div>
            <div className={styles['fields-pair']}>
              <div className={styles.city}>
                <FormInput
                    labId='name'
                    label='Your Name'
                    InputComponent={
                      <Input
                          type='text'
                          id='name'
                          disabled={disabled}
                          additionalClasses={styles.input}
                      />
                    }
                    name='name'
                    defaultValue={name}
                    control={control}
                    rules={{ required: true, minLength: 2, maxLength: 30 }}
                    errors={errors}
                    message={'This field should be between 2 and 30 characters long'}
                />
              </div>
              <div className={styles.city}>
                <FormInput
                    labId='email'
                    label='Email Address'
                    InputComponent={
                      <Input
                          type='text'
                          id='email'
                          disabled={disabled}
                          additionalClasses={styles.input}
                      />
                    }
                    name='email'
                    defaultValue={email}
                    control={control}
                    rules={{ required: true, pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Wrong email format"
                        } }}
                    errors={errors}
                    message={'Wrong email format'}
                />
              </div>
            </div>

            <FormInput
                labId='notes'
                label={'Note to Customer (i.e name of project, campaign, etc)'}
                InputComponent={
                  <TextArea
                      type='text'
                      id='notes'
                      rows={5}
                      disabled={disabled}
                      additionalClasses={styles.input}
                  />
                }
                defaultValue={notes}
                name='notes'
                control={control}
                rules={{ minLength: 4, maxLength: 50 }}
                errors={errors}
                message={'This field should be between 4 and 50 characters long'}
            />
          </div>
        </div>
      </>
    </form>
  )
}

export default ContactForm
