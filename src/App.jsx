import React from 'react';
import './App.css';

import { db, auth} from './firebase.js';
import Auth from './components/Auth';
import DashBoard from './components/Dashboard'


export class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    this.updateAuth = this.updateAuth.bind(this);
    this.onAuthChange = null;
  }

  componentDidMount() {
    const dis = this;
    this.onAuthChange = auth.onAuthStateChanged(function(user) {
      if (user) {
        dis.setState({'user' : {
          'uid': user.uid,
          'email': user.email,
        }});
        // User is signed in.
      } else {
        dis.setState({'user': null});
      }
    });
  }

  componentWillUnmount() {

    if (this.onAuthChange) {
      this.onAuthChange();
    }
    
  }

  updateAuth(user) {
    this.setState({user});
  }

  render() {
    const {
      user
    } =  this.state;
    return (
    <div className="App">
      {user ?
        <DashBoard db={db} user={user} />
        :
        <Auth auth={auth} db={db} updateAuth={this.updateAuth} />
      }
    </div>
    );
  }
}
export default App;
