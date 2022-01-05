import { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {useRouter} from "next/router"

import styles from './signup-form.module.css'
import { LoadingContext, UserContext } from '../../context'
import userApi from '../../server-api/user'

// Components
import AuthButton from '../common/buttons/auth-button'
import FormInput from '../common/inputs/form-input'
import Input from '../common/inputs/input'
import TextArea from "../common/inputs/text-area";

import toastUtils from '../../utils/toast'


const SignupForm = ({ teamId, inviteCode = '', email = '', onlyWorkEmail = false }) => {
    const router = useRouter();
    const { control, handleSubmit, errors, setValue, getValues } = useForm()
    const [submitError, setSubmitError] = useState('')
    const { setIsLoading } = useContext(LoadingContext)
    const { afterAuth } = useContext(UserContext)
    const onSubmit = async fieldData => {
        try {
            setIsLoading(true)

            // Setup password for request access
            if(inviteCode){
                const createData = {
                    teamId,
                    password: fieldData.password,
                    inviteCode,
                }
                const { data } = await userApi.completeRequestAccess(createData)

                await afterAuth(data)

            }else{// Create new request
                const createData = {
                    teamId,
                    email: fieldData.email,
                    name: fieldData.name,
                    company: fieldData.company,
                    phone: fieldData.phone,
                    state: fieldData.state,
                    city: fieldData.city,
                    message: fieldData.message,
                }
                const { data } = await userApi.requestAccess(createData )

                toastUtils.success("Request has been sent");

                // Go to login page
                router.push("/login")
            }

        } catch (err) {
            if (err.response?.data?.message) {
                setSubmitError(err.response.data.message)
            } else {
                setSubmitError('Something went wrong, please try again later')
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setValue('email', email)
    }, [email])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
            {!inviteCode && <>
                <div>
                    <FormInput
                        InputComponent={
                            <Input
                                type='text'
                                placeholder='Full Name'
                            />
                        }
                        name='name'
                        control={control}
                        rules={{ minLength: 4, maxLength: 30, required: true }}
                        errors={errors}
                        message={'This field should be between 4 and 30 characters long'}
                    />
                </div>
                <div>
                    <FormInput
                        InputComponent={
                            <Input
                                type='text'
                                placeholder='Work Email Address'
                            />
                        }
                        name='email'
                        control={control}
                        rules={{ required: true, pattern: onlyWorkEmail ?  /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!abc.com)(?!xyz.com)(?!pqr.com)(?!rediffmail.com)(?!live.com)(?!outlook.com)(?!me.com)(?!msn.com)(?!ymail.com)([\w-]+\.)+[\w-]{2,4})?$/i : /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,15}$/i }}
                        message={onlyWorkEmail ? 'Please enter your work email address' : 'Invalid email address'}
                        errors={errors}
                    />
                </div>
                <div>
                    <FormInput
                        InputComponent={
                            <Input
                                type='text'
                                placeholder='Phone Number'
                            />
                        }
                        name='phone'
                        control={control}
                        rules={{ required: true, pattern: /\d/i, maxLength: 20 }}
                        message={'Invalid phone number'}
                        errors={errors}
                    />
                </div>
                <div>
                    <FormInput
                        InputComponent={
                            <Input
                                type='text'
                                placeholder='Company Name'
                            />
                        }
                        name='company'
                        control={control}
                        rules={{ minLength: 2, maxLength: 40, required: true }}
                        message={'This field should be between 2 and 40 characters long'}
                        errors={errors}
                    />
                </div>
                <div>
                    <FormInput
                        InputComponent={
                            <Input
                                type='text'
                                placeholder='City'
                            />
                        }
                        name='city'
                        control={control}
                        rules={{ required: true }}
                        message={'City Required'}
                        errors={errors}
                    />
                </div>
                <div>
                    <FormInput
                        InputComponent={
                            <Input
                                type='text'
                                placeholder='State'
                            />
                        }
                        name='state'
                        control={control}
                        rules={{ required: true }}
                        message={'State Required'}
                        errors={errors}
                    />
                </div>
                <div>
                    <FormInput
                        labId='message'
                        InputComponent={
                            <TextArea
                                type='text'
                                id='message'
                                rows={5}
                                placeholder={'How will you use these digital assets?'}
                            />
                        }
                        defaultValue={''}
                        name='message'
                        control={control}
                        rules={{ required: true }}
                        errors={errors}
                        message={'This field should be between 4 and 300 characters long'}
                    />
                </div>
            </>}

            {inviteCode && <>
                <div>
                    <FormInput
                        InputComponent={
                            <Input
                                type='password'
                                placeholder='Password'
                            />
                        }
                        name='password'
                        control={control}
                        message={'This field should be minimun 8 characters long'}
                        rules={{ minLength: 8, maxLength: 80, required: true }}
                        errors={errors}
                    />
                </div>
                <div>
                    <FormInput
                        InputComponent={
                            <Input
                                type='password'
                                placeholder='Confirm Password'
                            />
                        }
                        name='passwordConfirm'
                        control={control}
                        rules={{ validate: value => value === getValues().password }}
                        message={'Passwords must match'}
                        errors={errors}
                    />
                </div>
            </>}

            {submitError &&
            <p className='submit-error'>{submitError}</p>
            }
            <div className={styles['button-wrapper']}>
                <AuthButton
                    type={'submit'}
                    text={'Sign Up'}
                />
            </div>
        </form>
    )
}

export default SignupForm
