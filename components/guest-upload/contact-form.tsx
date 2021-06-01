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

const ContactForm = () => {
  const { control, handleSubmit, errors } = useForm()

  const { countries, states, loadStates } = useContext(LocationContext)
  const { team, patchTeam } = useContext(TeamContext)

  const [country, setCountry] = useState('')
  const [state, seState] = useState('')
  const[name, setName] = useState('')
  const[email, setEmail] = useState('')
  const[notes, setNotes] = useState('')

  const onSubmit = fieldData => {
    const { address, city, zip } = fieldData
    const patchData = {
      address,
      city,
      state,
      country,
      zip
    }
    patchTeam(patchData)
  }

  const getSelectedItem = (type, value) => {
    const findFn = (item) => item.name === value
    switch (type) {
      case 'country':
        return countries.find(findFn)
      default:
        return states.find(findFn)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
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
                      />
                    }
                    name='name'
                    defaultValue={name}
                    control={control}
                    rules={{ minLength: 2, maxLength: 30 }}
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
                      />
                    }
                    name='email'
                    defaultValue={email}
                    control={control}
                    rules={{ minLength: 3, maxLength: 30 }}
                    errors={errors}
                    message={'This field should be between 3 and 30 characters long'}
                />
              </div>
            </div>

            <FormInput
                labId='note'
                label='Note to Customer (i.e name of project, campaign,etc)'
                InputComponent={
                  <TextArea
                      type='text'
                      id='note'
                      rows={5}
                  />
                }
                defaultValue={notes}
                name='note'
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
