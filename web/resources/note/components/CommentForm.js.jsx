/**
 * Reusable stateless form component for Note
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import form components
import { TextAreaInput } from '../../../global/components/forms';

const CommentForm = ({
  formHelpers
  , formTitle
  , formType
  , handleFormChange
  , handleFormSubmit
  , note
}) => {

  // set the button text
  const buttonText = formType === "create" ? "Add Comment" : "Update Comment";

  // set the form header
  const header = formTitle ? <div className="formHeader"><h2> {formTitle} </h2><hr/></div> : <div/>;

  return (
  <div className="form-container -slim">
    <form name="noteForm" className="note-form" onSubmit={handleFormSubmit}>
      {header}
      <TextAreaInput
        change={handleFormChange}
        name="note.content"
        value={note.content}
      />
      <div className="input-group">
        <div className="yt-row space-between">
          <button className="yt-btn " type="submit" > {buttonText} </button>
        </div>
      </div>
    </form>
  </div>
  )
}

CommentForm.propTypes = {
  formHelpers: PropTypes.object
  , formTitle: PropTypes.string
  , formType: PropTypes.string.isRequired
  , handleFormChange: PropTypes.func.isRequired
  , handleFormSubmit: PropTypes.func.isRequired
  , note: PropTypes.object.isRequired
}

CommentForm.defaultProps = {
  formHelpers: {}
  , formTitle: ''
}

export default CommentForm;
