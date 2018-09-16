import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  getFromStorage,
  getInStorage,
  setInStorage
} from '../../utils/storage';

class Home extends Component {
  constructor(props) {
    super(props);


    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onlogout = this.onlogout.bind(this);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: ''
    };

  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
      if (obj && obj.token) {
       const { token } = obj;
      // verify token
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false

            });
          } else {
            this.setState({
              isLoading: false,
            })
          }
        });

    } else {
      this.setState({
        isLoading: false
      })
    }
  }

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    })
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    })
  }

  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    })
  }

  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    })
  }
  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    })
  }
  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    })
  }


  onSignUp() {
    //Grab State
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword

    } = this.state;

    this.setState({
      isLoading: true
    });
    //Post request to backend
    fetch('/api/account/signup', {
     
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpFirstName: '',
            signUpLastName: '',
            signUpPassword: ''
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false
          })

        }

      });
  };




  onSignIn() {
      //Grab State
    const {
     
      signInEmail,
      signInPassword,

    }= this.state;

    this.setState({
      isLoading: true
    });
    //Post request to backend
    fetch('/api/account/signin', {
     
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage('the_main_app' , {token : json.token});
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token:json.token
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false
          })

        }

      });
  }

onlogout(){
  this.setState({
    isLoading:true
  })
  const obj = getFromStorage('the_main_app');
      if (obj && obj.token) {
       const { token } = obj;
      // verify token
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token:'',
              isLoading: false

            });
          } else {
            this.setState({
              isLoading: false,
            })
          }
        });

    } else {
      this.setState({
        isLoading: false
      })
    }
}

  render() {
    const {
      isLoading,
      token,
      signInEmail,
      signInPassword,
      signInError,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpError
    } = this.state;

    if (isLoading) {
      return (<div><p>is Loading...</p></div>);
    }
    if (!token) {
      return (
        <div>
          <div>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : (null)

            }
            <p>Sign In</p>
            <input
              type="text"
              placeholder="type your email"
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
            />
            <br />
            <input
              type="password"
              placeholder="type your password"
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            />
            <br />
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <br />
          <br />
          <div>
            {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : (null)

            }

            <p>Sign up</p>
            <input
              type="text"
              placeholder="Enter First Name"
              value={signUpFirstName}
              onChange={this.onTextboxChangeSignUpFirstName}
            />
            <br />
            <input
              type="text"
              placeholder="Enter Last Name"
              value={signUpLastName}
              onChange={this.onTextboxChangeSignUpLastName}
            />
            <br />
            <input
              type="text"
              placeholder="type your email"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            />
            <br />
            <input
              type="password"
              placeholder="type your password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            />
            <br />
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </div>
      );
    }
    return (
      <div>
        <p>Account</p>
        <button onClick={this.onlogout}>logout</button>
      </div>


    );
  }
}

export default Home;
