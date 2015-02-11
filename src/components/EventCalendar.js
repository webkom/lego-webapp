'use strict';

var React = require('react');
var moment = require('moment');
var EventStore = require('../stores/EventStore');

var EventCalendar = React.createClass({

  getInitialState() {
    return {
      date: moment()
    };
  },

  days() {
    var days = [];
    var date = this.state.date.startOf('month');
    var diff = date.weekday() - this.props.weekOffset;
    var day;

    var i;
    for (i = 0; i < diff; i++) {
      day = moment([this.state.date.year(), this.state.date.month(), i - diff + 1]);
      days.push({day: day, classNames: 'prev-month'});
    }

    var numberOfDays = date.daysInMonth();
    for (i = 1; i <= numberOfDays; i++) {
      day = moment([this.state.date.year(), this.state.date.month(), i]);
      days.push({day: day});
    }

    i = 1;
    while (days.length % 7 !== 0) {
      day = moment([this.state.date.year(), this.state.date.month(), i++]);
      days.push({day: day, classNames: 'next-month'});
    }

    return days;
  },

  _onNext() {
    this.setState({date: this.state.date.add(1, 'months')});
  },

  _onPrev() {
    this.setState({date: this.state.date.subtract(1, 'months')});
  },

  render() {
    return (
      <div className='content'>
        <div className='calendar'>
          <h2>
            <span onClick={this._onPrev}>&laquo;</span>
            <span>{this.state.date.format('MMMM YYYY')}</span>
            <span onClick={this._onNext}>&raquo;</span>
          </h2>
          <div className='calendar-grid'>
            {this.days().map(function(day, i) {
              return (
                <div key={'day-' + i} className={day.classNames}>
                  <span className='day-number'>{day.day.date()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = EventCalendar;
