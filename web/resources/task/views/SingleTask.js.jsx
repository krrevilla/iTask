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
import * as noteActions from '../../note/noteActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import TaskLayout from '../components/TaskLayout.js.jsx';
import CommentForm from '../components/CommentForm.js.jsx';
import NoteListItem from '../../note/components/NoteListItem.js.jsx';


class SingleTask extends Binder {
  constructor(props) {
    super(props);

    this.state = {
      note: _.cloneDeep(this.props.defaultNote.obj)
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
    const { dispatch, match, loggedInId } = this.props;
    let newNote = {
      ...this.state.note,
      _task: match.params.taskId,
      _user: loggedInId
    };

    dispatch(noteActions.sendCreateNote(newNote)).then(noteRes => {
      if (noteRes.success) {
        dispatch(noteActions.invalidateList('_task', match.params.taskId));
        this.setState({
          note: _.cloneDeep(this.props.defaultNote.obj)
        });
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  render() {
    const { note } = this.state;
    const { taskStore, noteStore, match } = this.props;

    /**
     * use the selected.getItem() utility to pull the actual task object from the map
     */
    const selectedTask = taskStore.selected.getItem();

    const noteList = noteStore.lists && noteStore.lists._task ? noteStore.lists._task[match.params.taskId] : null; 

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
    )

    console.log(selectedTask);

    return (
      <TaskLayout>
        <h3> Single Task </h3>
        { isEmpty ?
          (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <h1> { selectedTask.name }
            </h1>
            <p> <em>{selectedTask.description}.</em></p>
            <hr/>
            <br/>
            {isNoteListEmpty ?
              (isNoteListFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
              :
              <div style={{ opacity: isNoteListFetching ? 0.5 : 1 }}>
                {noteListItems.map(note => (
                  <NoteListItem key={note._id} note={note} />
                ))}
              </div>
            }
            <hr/>
            {note && (
              <CommentForm
                note={note}
                handleFormChange={this._handleFormChange}
                handleFormSubmit={this._handleNoteSubmit} />
            )}
            <Link to={`${this.props.match.url}/update`}> Update Task </Link>
          </div>
        }
      </TaskLayout>
    )
  }
}

SingleTask.propTypes = {
  dispatch: PropTypes.func.isRequired,
  defaultNote: PropTypes.object.isRequired,
  taskStore: PropTypes.object.isRequired,
  noteStore: PropTypes.object.isRequired,
  loggedInId: PropTypes.string.isRequired,
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
    , loggedInId: store.user.loggedIn.user._id
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(SingleTask)
);
