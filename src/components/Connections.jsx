import React from 'react';


const Connections = ({users, addConnections}) => {

  return (
    <div className="connectionsContainer">
        { users.map(user => (
            <div key={user.uid} onClick={addConnections(user.uid)}>
                <span>{user.email}</span>
            </div>
            ),
        )}
    </div>
  );
};


export default Connections;
