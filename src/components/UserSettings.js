import React, {Component, PropTypes} from 'react';

export default class UserSettings extends Component {
	static propTypes = {
		fields: PropTypes.object.isRequired,
		onSubmit: PropTypes.func.isRequired,
	}

	render() {
		const { fields: {username, firstName, lastName, email}, onSubmit } = this.props;
		return (
			<form onSubmit={onSubmit}>
				<label>Username</label>
				<input type="text" {...username}/>     {/* will pass value, onBlur and onChange*/}
				{username.error && username.touched ? <span style={{color:'red',fontWeight:'bold'}}>{username.error}</span>:null}
				<br />

				<label>First name</label>
				<input type="text" {...firstName}/>  {/* will pass value, onBlur and onChange*/}
				{firstName.error && firstName.touched ? <span style={{color:'red',fontWeight:'bold'}}>{firstName.error}</span>:null}
				<br />

				<label>Last name</label>
				<input type="text" {...lastName}/>    {/* will pass value, onBlur and onChange*/}
				{lastName.error && lastName.touched ? <span style={{color:'red',fontWeight:'bold'}}>{lastName.error}</span>:null}
				<br />

				<label>Email</label>
				<input type="text" {...email}/>    {/* will pass value, onBlur and onChange*/}
				{email.error && email.touched ? <span style={{color:'red',fontWeight:'bold'}}>{email.error}</span>:null}
				<br />

				<button onClick={onSubmit}>Submit</button>
			</form>
		);
	}
}




