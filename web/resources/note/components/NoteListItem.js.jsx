// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Binder from '../../../global/components/Binder.js.jsx';
import * as noteActions from '../noteActions';
import * as userActions from '../../user/userActions';
import moment from 'moment';

class NoteListItem extends Binder {

  componentDidMount() {
    const { loggedIn, dispatch, note } = this.props;
    const isAdmin = loggedIn.user.roles.includes('admin'); 

    if (isAdmin) {
      dispatch(userActions.fetchSingleIfNeeded(note._user));
    }
  }

  render() {
    const { note, userDetails } = this.props;

    return (
      <React.Fragment>
        <div>
          {userDetails
            ? <strong>{`${userDetails.firstName} ${userDetails.lastName}`}</strong>
            : <strong>User ID: {note._user}</strong>
          }
          <br />
          <em>{moment(note.created).format('M/D/YYYY @ h:mma')}</em>
          <br />
          <br />
          <p>{note.content}</p>
        </div>
        <hr />
      </React.Fragment>
    )
  }
}

NoteListItem.propTypes = {
  note: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loggedIn: PropTypes.object.isRequired,
  userDetails: PropTypes.object.isRequired
}

const mapStoreToProps = (store, componentProps) => {
  return {
    loggedIn: store.user.loggedIn
    , userDetails: store.user.byId[componentProps.note._user] || null
  };
}

export default connect(mapStoreToProps)(NoteListItem);
