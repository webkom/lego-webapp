import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux'
import {connectReduxForm, initialize} from 'redux-form';


function validateContact(data) {
	const errors = {};
	if(!data.username) {
		errors.username = 'Required';
	}
	if(!data.firstName) {
		errors.firstName = 'Required';
	}
	if(!data.lastName) {
		errors.lastName = 'Required';
	}
	if(!data.email) {
		errors.email = 'Required';
	}else if(!data.email.match('.+\@.+\..+')){
		errors.email = 'Invalid email';
	}
	return errors;
}

@connect( (state) => ({user:state.auth.user||{}}))
@connectReduxForm({
	form: 'contact',
	fields: ['username', 'firstName', 'lastName', 'email'],
	validate: validateContact,
})
class ContactForm extends Component {
	static propTypes = {
		fields: PropTypes.object.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		dispatch: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	}

	componentWillMount(){
		console.log(this.props.user)
		let {user} = this.props;
		this.props.dispatch(initialize('contact', {
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
		})); // clear form
	}

	render() {
		const { fields: {username, firstName, lastName, email}, handleSubmit } = this.props;
		return (
			<form onSubmit={handleSubmit}>
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

				<button onClick={handleSubmit}>Submit</button>
			</form>
		);
	}
}

class ContactFormWrapper extends Component{
	handleSubmit(data){
		console.log(data);
	}
	render(){
		return <ContactForm onSubmit={::this.handleSubmit} />
	}
}

// export the wrapped component
export default ContactFormWrapper;



