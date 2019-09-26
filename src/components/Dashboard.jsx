import React from 'react';

import Connections from './Connections';

export class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        users: [],
        connections: [],
        messages: [],
        errorMessage: null,
        currentUser: null,
    };

    this.getUsers = this.getUsers.bind(this);
    // this.getMessages = this.getMessages.bind(this);
    this.getConnections = this.getConnections.bind(this);
    this.addConnections = this.addConnections.bind(this);


    this.UsersRef = this.props.db.collection("users");
    this.messageRef = this.props.db.collection("messages");
    this.connectionsRef = this.props.db.collection("connections");
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    const { user } = this.props;
    const dis = this;

    this.UsersRef.get()
    .then(function(querySnapshot) {
      const users = []
      querySnapshot.forEach(function(doc) {
        users.push(doc.data());
      });
      dis.setState({
        users,
        currentUser: users[0].uid
      });
      dis.getConnections();
    });
  }

  getConnections() {
    const { user } = this.props;
    const dis = this;

    this.connectionsRef.where("users", "array-contains", user.uid)
      .get()
      .then(function(querySnapshot) {
        const connnections = []
        querySnapshot.forEach(function(doc) {
          connnections.push(doc.data());
        });
        dis.setState({connnections});

        console.log('connnections', connnections);
      });

  }

  addConnections(uid) {
    console.log('came here', uid);
    const { connections } = this.state;
    const { user } = this.props;
    const dis = this;

    const connection = {
      users: [ uid, user.uid]
    }

    const newConnection= this.connectionsRef.doc();

    newConnection.set(connection)
      .then(function() {
        connections.push(connection);
        dis.setState({connections});
      })
      .catch(function(error) {
        const errorMessage = error.message;
        dis.setState({
          'message': errorMessage
        })
      });
  }

  // getMessages() {
  //   const { user } = this.props;
  //   const { currentUser } = this.state;
  //   const dis = this;

  //   console.log('currentUser', currentUser);

  //   if (currentUser) {
  //     this.messageRef.where("users", "array-contains", user.uid)
  //     .where("users", "array-contains", currentUser)
  //     .get()
  //     .then(function(querySnapshot) {
  //       const messages = []
  //       querySnapshot.forEach(function(doc) {
  //         messages.push(doc.data());
  //       });
  //       dis.setState({messages});
  //     });
  //   }
  // }

  


  render() {
    const {
        messages, title, currentUser, connnections
    } =  this.state;
    console.log('see')
    const { user } = this.props;
    const users = this.state.users.filter(u => u.uid !== user.uid);

    return (
    <div className="dashboardContainer">
        <h4> Dashboard </h4>

        <Connections users={users} uid={user.uid}  addConnections={this.addConnections}/>
    </div>
    );
  }
}


export default Dashboard;