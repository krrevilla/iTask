import React from 'react';
import { Router, Link } from 'react-router';

import Post from "../PostHandler";

//get/set initial state
let getPostViewState = () => {
	console.log("get app state called in post view");
	return {
		post: Post.Store.get()
	}
}

class List extends React.Component{

	constructor(props, context) {
		super(props);
		this.state = getPostViewState();
		this._onChange = this._onChange.bind(this); //lolwut
	}

	componentWillMount () {
		//request post from server
		Post.Actions.requestSinglePost(this.props.params.postId);
	}

	componentDidMount() {
		Post.Store.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
	  Post.Store.removeChangeListener(this._onChange);
	}

	_onChange() {
		this.setState(getPostViewState());
	}

	render() {
		return(
			<div className="post-view">
				<h1>VIEW POST</h1>
				<p>{this.state.post.title}</p>
				<p>{this.state.post.content}</p>
			</div>
		)
	}
}

export default List;