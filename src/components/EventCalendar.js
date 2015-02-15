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
    var diff = moment(this.state.date).startOf('month').weekday() - 1;
    var day;
    var i;
    
    for (i = 0; i < diff + 1; i++) {
      day = moment([this.state.date.year(), this.state.date.month(), i - diff]);
      days.push({day: day, className: 'prev-month'});
    }

    var numberOfDays = this.state.date.daysInMonth();
    for (i = 1; i <= numberOfDays; i++) {
      day = moment([this.state.date.year(), this.state.date.month(), i]);
      days.push({day: day});
    }

    i = 1;
    while (days.length % 7 !== 0) {
      day = moment([this.state.date.year(), this.state.date.month(), i++]);
      days.push({day: day, className: 'next-month'});
    }

    return days;
  },

  _onNext() {
    this.setState({date: this.state.date.add(1, 'months')});
  },

  _onPrev() {
    this.setState({date: this.state.date.subtract(1, 'months')});
  },

  weekdayAbbrevs: function() {
    return [0, 1, 2, 3, 4, 5, 6].map((i) => {
      return moment().weekday(i).format('dd');
    })
  },

  render() {
    return (
      <div className='content'>
        <div className='calendar'>
          <h2>
            <span onClick={this._onPrev}>&laquo;</span>
            <span id="month-year">{this.state.date.format('MMMM YYYY')}</span>
            <span onClick={this._onNext}>&raquo;</span>
          </h2>
          <div className='calendar-grid'>
            {this.weekdayAbbrevs().map(function(weekAbb, i) {
              return (
                <div key={'weekday-abbrev-' + i} className={"weekday-abbrev"}>
                  <span className='weekday-abbrev-letter'><b>{weekAbb}</b></span>
                </div>
              );
            })}
            {this.days().map(function(day, i) {
              return (
                <div key={'day-' + i} className={day.className}>
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
