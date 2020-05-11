/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as taskActions from '../taskActions';
import * as noteActions from '../../note/noteActions'

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import TaskLayout from '../components/TaskLayout.js.jsx';
import CommentForm from '../../note/components/CommentForm.js.jsx';
import ITaskCheckbox from '../../../global/components/forms/ITaskCheckbox.js.jsx';

class SingleTask extends Binder {
  constructor(props) {
    super(props);
    this.state = {
      note: _.cloneDeep(this.props.defaultNote.obj)
      , formHelpers: {}
    }

    this._bind(
      '_handleFormChange'
      , '_handleNoteSubmit'
    );
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
    dispatch(noteActions.fetchDefaultNote());
    dispatch(noteActions.fetchListIfNeeded('_task', match.params.taskId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, match } = this.props;
    dispatch(noteActions.fetchListIfNeeded('_task', match.params.taskId));
    this.setState({
      note: _.cloneDeep(nextProps.defaultNote.obj)
    })
  }

  _handleFormChange(e) {
    /**
     * This let's us change arbitrarily nested objects with one pass
     */
    let newState = _.update(this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState({newState});
  }

  _handleNoteSubmit(e) {
    e.preventDefault();

    const { defaultNote, taskStore, loggedInUser, dispatch, match } = this.props;
    let newNote = {...this.state.note};

    const selectedTask = taskStore.selected.getItem();

    newNote._flow = selectedTask._flow;
    newNote._user = loggedInUser._id;
    newNote._task = match.params.taskId;

    console.log("new Note");
    console.log(newNote);

    dispatch(noteActions.sendCreateNote(newNote)).then(noteRes => {
      if(noteRes.success) {
        dispatch(noteActions.invalidateList('_task', match.params.taskId));
        this.setState({
          note: _.cloneDeep(defaultNote.obj)
        });
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  _handleTaskStatusUpdate(status) {

    const { taskStore, dispatch } = this.props;
    let selectedTask = taskStore.selected.getItem();

    selectedTask.complete = (status == "approve") ? true: false;
    selectedTask.status = "approved";

    dispatch(taskActions.sendUpdateTask(selectedTask)).then(taskRes => {
      if(taskRes.success) {

      } else {
        alert("ERROR - Check logs");
      }
    })
  }

  render() {
    const { note, formHelpers } = this.state;
    const { 
      defaultNote
      , match
      , taskStore
      , noteStore 
      , loggedInUser
    } = this.props;

    /**
     * use the selected.getItem() utility to pull the actual task object from the map
     */
    const selectedTask = taskStore.selected.getItem();

    // get the noteList meta info here so we can reference 'isFetching
    const noteList = noteStore.lists && noteStore.lists._task ? noteStore.lists._task[match.params.taskId] : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual task objetcs
     */
    const noteListItems = noteStore.util.getList("_task", match.params.taskId);

    const isEmpty = (
      !selectedTask
      || !selectedTask._id
      || taskStore.selected.didInvalidate
    );

    const isFetching = (
      taskStore.selected.isFetching
    )

    const isNoteListEmpty = (
      !noteListItems
      || !noteList
    );

    const isNoteListFetching = (
      !noteListItems
      || !noteList
      || noteList.isFetching
    );
    
    const isNewNoteEmpty = !note;

    const parseDatetime = (datetime) => {
      let date = new Date(datetime);

      return date.toLocaleDateString() + ' @ ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }

    const getImageProfile = (user) => {
      let pictureUrl = '/img/defaults/profile.png';

      if(user && user.profilePicUrl) {
        pictureUrl = user.pictureUrl;
      }

      return {backgroundImage: `url(${pictureUrl})`};
    }

    console.log("Task");
    console.log(selectedTask);

    const isUserAdmin = (loggedInUser.roles) ? loggedInUser.roles.includes("admin") : false;

    return (
      <TaskLayout>
        { isEmpty ?
          (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <div className="content-header">
              <div className="title-description-container">
                <div className="title">
                  <ITaskCheckbox
                    completed={selectedTask.complete}
                    status={selectedTask.status}
                    view="default"
                  />
                  <h1> { selectedTask.name } </h1>
                </div>
                <p>{ selectedTask.description }</p>
                {
                  (isUserAdmin && selectedTask.status === "open") ?
                <div className="btn-admin-container">
                  <button className="yt-btn approve" onClick={() => this._handleTaskStatusUpdate('approve')}>Approve</button>
                  <button className="yt-btn reject" onClick={() => this._handleTaskStatusUpdate('reject')}>Reject</button>
                </div>
                :
                ''
                }
              </div>
              <div className="btn-container">
                <Link className="yt-btn x-small" to={`${this.props.match.url}/update`}> Edit </Link>
              </div>
            </div>
            <hr/>
            <div>
            {
              isNoteListEmpty ? "" 
              :
              <div style={{ opacity: isNoteListFetching ? 0.5 : 1}}>
                <ul className="comment-list">
                  {noteListItems.map((note, i) =>
                    <li key={note._id + i}>
                      <div className="profile-pic-wrapper">
                        <div className="profile-pic" style={getImageProfile(note._user)}></div>
                      </div>
                      <div>
                        <h3>{note._user.firstName + " " } {note._user.lastName}</h3>
                        <p>{parseDatetime(note.created)}</p>
                        <p>{note.content}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            }
            </div>
            <hr/>
            {
              !isNewNoteEmpty ?
              <div className="comment-container">
                <CommentForm
                  note={note}
                  formHelpers={formHelpers}
                  formType="create"
                  handleFormChange={this._handleFormChange}
                  handleFormSubmit={this._handleNoteSubmit}
                />
              </div>
              :
              <div></div>
            }

          </div>
        }
      </TaskLayout>
    )
  }
}

SingleTask.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    defaultNote: store.note.defaultItem
    , taskStore: store.task
    , noteStore: store.note
    , loggedInUser: store.user.loggedIn.user
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(SingleTask)
);
