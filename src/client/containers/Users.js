import _ from 'lodash'
import React from 'react'

import { getColor } from '../colors'

import './Users.css'

const UserList = ({ users, isOp, isVoiced }) =>
  <ol>
    {_.map(users, ({ nick }) => (
      <li
        key={nick}
        className='nick strong'
        style={{ color: getColor(nick) }}
        title={nick}
      >
        <span className='prefix'>{(isOp ? '@' : '') + (isVoiced ? '+' : '')}</span>
        {nick}
      </li>
    ))}
  </ol>

const Users = ({ users, groupedUsers }) =>
  <div id='users'>
    <h3 className='strong'>Users ({_.size(users)})</h3>

    <UserList users={groupedUsers['op']} isOp />
    <UserList users={groupedUsers['voiced']} isVoiced />
    <UserList users={groupedUsers['normal']} />
  </div>

export default Users
