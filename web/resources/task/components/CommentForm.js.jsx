/**
 * Reusable stateless form component for Commment
 */

// import primary libraries
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import form components
// import { TextInput } from '../../../../global/components/forms';
// import form components
import { TextAreaInput } from '../../../global/components/forms';

const CommentForm = ({
    note
    , handleFormChange
    , handleFormSubmit
}) => {
    return (
        <form name="commentForm" onSubmit={handleFormSubmit}>
            <TextAreaInput
              change={handleFormChange}
              name="note.content"
              required={false}
              value={note.content}
            />
            <button disabled={note.content === ''} className="yt-btn " type="submit" > Add Comment </button>
        </form>
    );
}

CommentForm.propTypes = {
    note: PropTypes.object.isRequired
    , handleFormChange: PropTypes.func.isRequired
    , handleFormSubmit: PropTypes.func.isRequired
}

export default CommentForm;
