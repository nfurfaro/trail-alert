import RaisedButton from 'material-ui/RaisedButton';
import {grey900} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import React, { Component } from 'react';
import request from 'superagent';
import './App.css';


const iconStyles = {
  fontSize: 50,
};

const inputStyles = {
  errorStyle: {
    color: 'red',
  },
  underlineStyle: {
    borderColor: '#FFDEA8',
  },
  floatingLabelStyle: {
    color: '#FFDEA8',
  },
  floatingLabelFocusStyle: {
    color: '#FFDEA8',
  },
  inputStyle: {
    color: '#FFDEA8',
    fontSize: 20,
  },
};

const btnStyles = {
  button: {
    backgroundColor: '#FFDEA8',
  },
  label: {
    color: grey900,
    label: 'Subscribe'
  },
};

class App extends Component {
  constructor(props) {
     super(props);
      this.state = {
        value: 0
      };
    }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  handleSubscribe() {
      (Number.isInteger(Number(this.state.value))) &&
      (((this.state.value).toString().length) === 10) ?
        request
           .post('https://1r12pvcy81.execute-api.us-east-1.amazonaws.com/production/subscribe')
           // .post('https://tzgvaie938.execute-api.us-east-1.amazonaws.com/dev/subscribe')
           // .post('subscribe')
           .query(`mobileNum=${Number(this.state.value)}`)
           .set('Accept', 'application/json')
           .set('Content-Type', 'application/json')
           .end(function(err, res){
             if (err || !res.ok) {
               // alert(err)
               alert('Oops. There seems to be a problem. Please confirm that you used your current mobile number')
             } else
               alert('Success! You should be receiving a confirmation text shortly.');
           }): alert('Please enter a valid 10-digit mobile number.');
  }

  render() {
    return (
      <div className="App">
        <div className={"text"}>
          <FontIcon className="material-icons" style={iconStyles} color={'#FFDEA8'}>notifications</FontIcon>
          <h1>Trail Alert</h1>
          <h4>Sms trail-grooming updates </h4>
          <TextField
            id="input"
            inputStyle={inputStyles.inputStyle}
            floatingLabelText="Mobile number:"
            floatingLabelStyle={inputStyles.floatingLabelStyle}
            floatingLabelFocusStyle={inputStyles.floatingLabelFocusStyle}
            underlineStyle={inputStyles.underlineStyle}
            underlineFocusStyle={inputStyles.underlineStyle}
            onChange={this.handleChange}


          /><br/>
          <RaisedButton
            className="RsdBtn"
            id="subscribe"
            label='Subscribe'
            labelPosition="before"
            onClick={this.handleSubscribe.bind(this)}
            primary={true}
            icon={null}
            buttonStyle={btnStyles.button}
            labelStyle={btnStyles.label}

          />
        </div>
      </div>
    );
  }
}

export default App;


