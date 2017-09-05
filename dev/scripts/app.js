import React from 'react';
import ReactDOM from 'react-dom'; 
import Moment from 'moment';

var config = {
apiKey: "AIzaSyDbl_Rr4UZl9VYZYll84wsEGWrlw3KxD1Y",
authDomain: "todoapp-c421f.firebaseapp.com",
databaseURL: "https://todoapp-c421f.firebaseio.com",
projectId: "todoapp-c421f",
storageBucket: "todoapp-c421f.appspot.com",
messagingSenderId: "247045125391"
};
firebase.initializeApp(config);

const dbRef = firebase.database().ref('/');

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			noName: true,
			name: '',
			currentMessage : '',
			date: '',
			allMessages: [],
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmitMessages = this.handleSubmitMessages.bind(this);
		this.handleSubmitName = this.handleSubmitName.bind(this);
	}

	handleSubmitMessages(e) {
		e.preventDefault();
		const itemsRef = firebase.database().ref('items');
		const item = {
			message: this.state.currentMessage,
			name: this.state.name,
			date: Moment().format('lll')
		}
		if(this.state.currentMessage !== '')
			itemsRef.push(item);

		this.setState({
			currentMessage: '',
		});
	}

	handleChange(e) {
		if(this.state.noName)
			this.setState({	name: e.target.value });
		else
			this.setState({ currentMessage: e.target.value });
	}

	handleSubmitName(e) {
		e.preventDefault();
		this.setState({ noName: false });
	}

	render() {
		return(
			<div>
				<h1>chatReact</h1>
				<h3>Chat in real-time with people that are online.</h3>
				<main>
					<ul id="list">
						{this.state.allMessages.map( (message) => {
							return	<Messages key={message.id}
											  name={message.name}
											  message={message.message}
											  date={message.date}/> 
						})}
						<li className="invisible-li"
	             			ref={(el) => { this.messagesEnd = el; }} />
					</ul>

					{this.state.noName ? 
						( <NameForm submit={this.handleSubmitName}
									value={this.state.name}
									change={this.handleChange} />
						) :
						( <MessageForm submit={this.handleSubmitMessages}
									   value={this.state.currentMessage}
									   change={this.handleChange} />
						)}
				</main>
			</div>
		);
	}

	componentDidMount() {
		const itemsRef = firebase.database().ref('items');

	  	itemsRef.on('value', (snapshot) => {
	    let items = snapshot.val();
	    let newState = [];

	    for (let item in items) {
	      newState.push({
	        id: item,
	        message: items[item].message,
	        name: items[item].name,
	        date: items[item].date
	      });
	    }

	    this.setState({
	      allMessages: newState
	    });

	    this.scrollToBottom();
	  });
	}

	scrollToBottom() {
	  const node = ReactDOM.findDOMNode(this.messagesEnd);
	  node.scrollIntoView({ behavior: "smooth" });
	}

	componentDidUpdate() {
	    this.scrollToBottom();
	}

}

const MessageForm = (props) => {
	return (
		<form onSubmit={props.submit}>
			<input 
				type="text" 
				name="currentMessage" 
				value={props.value} 
				onChange={props.change}
				placeholder="Enter message">
			</input>

			<input
				type="submit"
				value="GO">
			</input>
		</form>
	);
};

const NameForm = (props) => {
	return (
		<form onSubmit={props.submit}>
			<input 
				type="text" 
				name="name" 
				value={props.value} 
				onChange={props.change}
				placeholder="Enter name">
			</input>

			<input
				type="submit"
				value="GO">
			</input>
		</form>
	);
};

const Messages = (props) => {
	return (
		<li>
			<p className="name">
				{props.name}
				<span className="date">{props.date}</span>
			</p>
			<p className="message">{props.message}</p>
		</li>
	);
};

ReactDOM.render(<App />, document.getElementById('app'));
