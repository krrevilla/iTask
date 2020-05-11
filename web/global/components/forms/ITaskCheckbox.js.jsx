/**
 * Helper form component for rendering checkboxes
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';

const setCheckboxBGColor = (completed, status, view) => {

  let cbClass = "checkbox-container ";

  if(completed && status === "approved") {
    cbClass += (view === "default") ? "approve" : (view === "single-flow") ? "approve-purple" : "";
  } else if( !completed && status === "approved") {
    cbClass += (view === "default") ? "reject" : "";
  }

  return cbClass;
}

const showCheckmark = (completed, status, view) => {
  if(completed && status === "approved" && (view === "default" || view === "single-flow"))
    return true;
  else if(!completed && status === "approved" && (view === "default"))
    return true;

  return false;
}

const ITaskCheckbox = ({
  completed
  , status
  , view
}) => {
  return (
    <div className={setCheckboxBGColor(completed, status, view)}>
      { (showCheckmark(completed, status, view)) ?  <div className="checkmark"></div> : '' }
    </div>
  )
}

ITaskCheckbox.propTypes = {
  checked: PropTypes.bool
}

ITaskCheckbox.defaultProps = {
  checked: false
}

export default ITaskCheckbox;
