import { FC } from 'react'
import './Existing.css'

const ExistingUser: FC = () => {
  return (
    <div className='existing-user'>
      <div className="existing-header">
        <h2>Hi, Brother Benard</h2>
      </div>
      <div className="existing-content">
        <div className="existing-form-header">
          <p>Please Enter Your Passcode</p>
        </div>
        <div className="existing-form-container">
          <form className="existing-form">
            <div className="existing-form-input-wrapper">
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

    </div>
  )
}

export default ExistingUser
