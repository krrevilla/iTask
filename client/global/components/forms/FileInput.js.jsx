/**
 * Helper component for rendering and handling file inputs
 *
 * NOTE: This is a 'fork' of the old 'react-file-input' repo, which is no
 * longer maintained. We will probably continue to iterate on this.
 * See other projects (sof) for examples of integrating on the server side.
 *
 * TODO: Could use an example of how to use
 */

var React = require('react');

var FileInput = React.createClass({
  getInitialState: function() {
    return {
      value: '',
      styles: {
        parent: {
          position: 'relative',
          zIndex: 0
        },
        file: {
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          width: '100%',
          zIndex: 1
        },
        text: {
          position: 'relative',
          zIndex: -1
        }
      }
    };
  },

  handleChange: function(e) {
    this.setState({
      value: e.target.value.split(/(\\|\/)/g).pop()
    });
    if (this.props.onChange) this.props.onChange(e);
  },

  render: function() {
    return React.DOM.div({
        style: this.state.styles.parent
      },

      // Actual file input
      React.DOM.input({
        type: 'file',
        name: this.props.name,
        className: this.props.className,
        onChange: this.handleChange,
        disabled: this.props.disabled,
        accept: this.props.accept,
        style: this.state.styles.file,
        multiple: this.props.multiple
      }),

      // Emulated file input
      React.DOM.input({
        type: 'text',
        tabIndex: -1,
        name: this.props.name + '_filename',
        value: this.state.value,
        className: this.props.className,
        onChange: function() {},
        placeholder: this.props.placeholder,
        disabled: this.props.disabled,
        style: this.state.styles.text
      }));
  }
});

module.exports = FileInput;
