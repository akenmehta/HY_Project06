import React from 'react';
import ReactDOM from 'react-dom';

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
			name: '',
			noName: true,
			currentMessage : '',
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
			name: this.state.name
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
		this.setState({ noName: false});
	}

	render() {
		return(
			<div>
				<h1>chatReact</h1>
				<main>
					<ul id="list">
						{this.state.allMessages.map( (message) => {
							return(
									<li key={message.id}>
										<p className="name">{message.name}</p>
										<p className="message">{message.message}</p>
									</li>								
							);
						})}
						<li style={{ float:"left", clear: "both", border: "none", height: 0, margin: 0, background: '#fff'}}
	             		ref={(el) => { this.messagesEnd = el; }} />
					</ul>

					{this.state.noName ? 
						(
							<form onSubmit={this.handleSubmitName}>
								<input 
									type="text" 
									name="name" 
									value={this.state.name} 
									onChange={this.handleChange}
									placeholder="Enter name">
								</input>

								<input
									type="submit"
									value="GO">
								</input>
							</form>
						) :
						(
							<form onSubmit={this.handleSubmitMessages}>
								<input 
									type="text" 
									name="currentMessage" 
									value={this.state.currentMessage} 
									onChange={this.handleChange}
									placeholder="Enter message">
								</input>

								<input
									type="submit"
									value="GO">
								</input>
							</form>
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
	        name: items[item].name
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

ReactDOM.render(<App />, document.getElementById('app'));
