import { FC, FormEvent, useState } from 'react';
import "./Welcome.css"
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { verifyStudent } from '../services/UserManagement';


const Welcome: FC = () => {
  const navigate = useNavigate();
  const [indexNumber, setIndexNumber] = useState('');
  const verifyIndexNumberMutation = useMutation((indexNumber: string) => verifyStudent(indexNumber), {
    onSuccess: (data) => {
      console.log(data)
      // if (data.already_exists) {
      //   //navigate('/existing-user');
      // } else {
      //   //navigate('/new-user');
      // }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (indexNumber) {
      verifyIndexNumberMutation.mutate(indexNumber);
    }
  };

  return (
    <div className='welcome'>
      <div className="welcome-header-wrapper">
        <p className="small-header">Welcome to</p>
        <h1 className="anagozo">
          Anakagzo Live
        </h1>
      </div>
      <div className="form-container">
        <h2 className="form-header">Enter Your Index Number Eg: 700123</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-input-wrapper">
            <label htmlFor="index-number">Index Number</label>
            <input
              type="text"
              name="index-number"
              value={indexNumber}
              onChange={(e) => setIndexNumber(e.target.value)}
            />
          </div>
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
