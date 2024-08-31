import React, { useState } from 'react';
// import { auth, db } from './firebaseConfig';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';

const SignInUpPage = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [isSignUp, setIsSignUp] = useState(true);
  // const [error, setError] = useState('');

  // const handleAuth = async () => {
  //   try {
  //     if (isSignUp) {
  //       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //       const user = userCredential.user;
  //       await setDoc(doc(db, 'users', user.email), {
  //         email: user.email,
  //         uid: user.uid,
  //         createdAt: new Date()
  //       });
  //     } else {
  //       await signInWithEmailAndPassword(auth, email, password);
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  return (
    <div>
      <h1>planned later...</h1>
      {/* <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
      {error && <p>{error}</p>}
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
      </button> */}
    </div>
  );
};

export default SignInUpPage;