import { FC } from 'react'
import './New.css'

const NewUser: FC = () => {
  return (
    <div className='new-user'>
      <div className="new-header">
        <h2>Hi, Brother Benard</h2>
        <p>An Email is going to be sent</p>
        <strong>to your email address</strong>
      </div>
      <div className="new-content">
        <p>Use the code sent to you to login into your app</p>
      </div>
      <div className="form-container">
        <form className="form">
          <div className="form-input-wrapper">
            <label htmlFor="index-number">Passcode</label>
            <input
              type="text"
              name="passcode"
            />
          </div>
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default NewUser
