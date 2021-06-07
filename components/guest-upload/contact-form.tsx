import styles from './contact-form.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

// Components
import FormInput from '../common/inputs/form-input'
import Input from '../common/inputs/input'
import TextArea from '../common/inputs/text-area'

const ContactForm = ({ id, onSubmit, disabled = false, teamName = '' }) => {
  const { control, handleSubmit, errors } = useForm()

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
                    defaultValue={''}
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
                    defaultValue={''}
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
                label={`Note to ${teamName} (i.e name of project, campaign, etc)`}
                InputComponent={
                  <TextArea
                      type='text'
                      id='notes'
                      rows={5}
                      disabled={disabled}
                      additionalClasses={styles.input}
                  />
                }
                defaultValue={''}
                name='notes'
                control={control}
                rules={{ minLength: 4, maxLength: 300 }}
                errors={errors}
                message={'This field should be between 4 and 300 characters long'}
            />
          </div>
        </div>
      </>
    </form>
  )
}

export default ContactForm
