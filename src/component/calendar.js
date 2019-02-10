import React from "react";
import dateFns from "date-fns";
import classnames from 'classnames';
import styles from './styles.css';

export class Calendar extends React.Component {

  constructor(props){
    super(props);
    const l = window.location.search;
    let month = '';
    let year = ''
    if(l !== ''){
      const p = l.split('').slice(1).join('').split('&&');
      month = p[0];
      year = p[1];
    }
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      year: year,
      month: month
    };
  }


  componentDidMount() {
    this.handleSWitch();
  }

  handleSWitch = () => {
    if(this.state.year !== '' && this.state.month === ''){
      this.setState({
        currentMonth: dateFns.setDate(new Date(this.state.year, 0, 1), 1),
        selectedDate: dateFns.setDate(new Date(this.state.year, 0, 1), 1)
      });
      window.history.pushState('', '', '?1'+ '&&'+ this.state.year);

    }else if(this.state.year === '' && this.state.month !== ''){
      this.setState({
        currentMonth: dateFns.setDate(new Date(new Date().getFullYear(), this.state.month-1, 1), 1),
        selectedDate: dateFns.setDate(new Date(new Date().getFullYear(), this.state.month-1, 1), 1)
      });
      window.history.pushState('', '', '?'+ this.state.month+'&&'+ new Date().getFullYear());

    }else if(this.state.year !== '' && this.state.month !== '') {
      this.setState({
        currentMonth: dateFns.setDate(new Date(this.state.year, this.state.month-1, 1), 1),
        selectedDate: dateFns.setDate(new Date(this.state.year, this.state.month-1, 1), 1)
      });
      window.history.pushState('', '', '?'+this.state.month+'&&'+ this.state.year);
    }else if(this.state.year === '' && this.state.month === ''){
      this.setState({
        currentMonth: new Date(),
        selectedDate: new Date()
      });
      window.history.pushState('', '', '/');
    }
  }

  handleChange = (event)  => {
    console.log(event.target.value)
    this.setState({[event.target.name]: event.target.value}, () => this.handleSWitch());
    this.handleSWitch();
  }

  getNavigation  () {
    const dateFormat = "MMMM YYYY";
    return (
      <div className={classnames(styles.row, styles.navigation)}>
        <div className={classnames(styles.col, styles.colStart)} onClick={this.prevMonth}>
          <div className="icon">chevron_left</div>
        </div>
        <div>
          <select value={this.state.year} onChange={this.handleChange} name='year'>
            <option value="">Select a year</option>
            <option value="2015">2015</option>
            <option value="2016">2016</option>
            <option value="2017">2017</option>
            <option value="2018">2018</option>
            <option value="2019" selected={true}>2109</option>
            <option value="2020">2020</option>
          </select>
        </div>
        <div className={classnames(styles.col, styles.colCenter)}>
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div>
          <select value={this.state.month} onChange={this.handleChange} name='month'>
            <option value="">Select a month</option>
            <option value="1">Jan</option>
            <option value="2">Feb</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">Aug</option>
            <option value="9">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>

          </select>
        </div>

        <div  className={classnames(styles.col, styles.colEnd)} onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  getWeekDays() {
    const dateFormat = "dddd";
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className={classnames(styles.col, styles.colCenter)} key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className={classnames(styles.row, styles.weekDays)}>{days}</div>;
  }

  getDayBoxes() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={classnames(styles.col, styles.cell, styles.dayBox, ` ${
              !dateFns.isSameMonth(day, monthStart)
                ? styles.disabled
                : dateFns.isSameDay(day, selectedDate)
                ? styles.selected
                : ""
              }`)}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className={styles.dateDay}>{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className={classnames(styles.row, styles.dayBorder)} key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="">{rows}</div>;
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
  };



  render() {
    return (
      <div className={classnames(styles.wrapper)}>
        {this.getNavigation()}
        {this.getWeekDays()}
        {this.getDayBoxes()}
      </div>
    );
  }
}
