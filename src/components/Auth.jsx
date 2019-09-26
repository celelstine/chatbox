import React from 'react';

export class Auth extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null,
      message: null,
      title: 'Signup'
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.switchForm = this.switchForm.bind(this);
  }

  handleSubmit() {
    const {
      email, password, title
    } =  this.state;
    const { auth} = this.props;

    console.log('see', auth);

    const dis = this;

    if (title === 'Signup') {
      auth.createUserWithEmailAndPassword(email, password)
      .then(function(res) {
        const user = {
          'uid': res.user.uid,
          'email': res.user.email,
        }

      dis.props.db.collection("users").doc(user.uid).set(user)
      .then(function() {
        dis.props.updateAuth(user);
      })
      .catch(function(error) {
        const errorMessage = error.message;
        dis.setState({
          'message': errorMessage
        })
      });
        


      })
      .catch(function(error) {
        const errorMessage = error.message;
        dis.setState({
          'message': errorMessage
        })
      });
    } else {
      auth.signInWithEmailAndPassword(email, password)
      .then(function(res) {
        dis.props.updateAuth({
          'uid': res.user.uid,
          'email': res.user.email,
        });
      })
      .catch(function(error) {
        const errorMessage = error.message;
        dis.setState({
          'message': errorMessage
        })
      });
    }
  }

  handleChange ({target}) {
    this.setState({
      [target.name]: target.value,
    })
  }

  switchForm() {
    const {title} =  this.state;
    let currentForm = 'Signup';
    if (title === currentForm) {
      currentForm = 'Login'
    }

    this.setState({
      'title': currentForm
    });

  }

  render() {
    const {
      email, password, message, title
    } =  this.state;

    const disableButton  = (email && password) ? false : true;

    return (
    <div className="Container">
      <h2 className="loginHeader">
      {title}
      <span onClick={this.switchForm}>
        {title === 'Signup'
          ?
          'Login'
          :
          'Signup'
      
        }
      </span>
      </h2>
      
      <p className='errorText'>
        {message}
      </p>

        <label htmlFor="email">Email</label>
        <input 
          name="email" type="text" placeholder="Enter your email"
          value={email}
          onChange={this.handleChange}
        />

        <br />

        <label htmlFor="email">Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={this.handleChange}
        />
        <br />
        <button type="submit" disabled={disableButton}  onClick={this.handleSubmit}>
          {title}
        </button>


    </div>
    );
  }
}


export default Auth;