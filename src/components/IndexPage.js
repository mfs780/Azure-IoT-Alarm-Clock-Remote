'use strict';

import React from 'react';
import io from 'socket.io-client';

let socket = io('http://localhost:3001');

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this);
        this.clickSet = this.clickSet.bind(this);
        this.clickStop = this.clickStop.bind(this);
        this.clickTweet = this.clickTweet.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    clickSet() {
        socket.emit('Set', 'Set=' + this.state.value);
    }
    clickStop() {
        socket.emit('Stop', 'Stop=' + this.state.value);
    }
    clickTweet() {
        socket.emit('Tweet','Tweet=' +  this.state.value);
    }

    render() {



        return (
            <div className="home">
                <p className="title">Alarm Control</p>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
                <div className="buttonclock blue" onClick={this.clickSet}>SET</div>
                <div className="buttonclock red" onClick={this.clickStop}>STOP</div>
                <div className="buttonclock blue" onClick={this.clickTweet}>MESSAGE</div>
            </div>
        );
    }
}
