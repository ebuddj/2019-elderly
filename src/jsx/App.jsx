import React, {Component} from 'react'
import style from './../styles/styles.less';

// https://alligator.io/react/axios-react/
import axios from 'axios';

// https://underscorejs.org/
import _ from 'underscore';

import {RadialChart, CircularGridLines, XYPlot, ArcSeries, XAxis, YAxis, MarkSeries} from 'react-vis';

import {Polar} from 'react-chartjs-2';

let data = [];

const order = {
  'Africa':3,
  'Asia':4,
  'Europe':0,
  'N. America':1,
  'Oceania':5,
  'S. America':2
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      active_continents:['Africa','Asia','Europe','N. America','Oceania','S. America'],
      data:{
        datasets:[{
          backgroundColor:[],
          data:[]
        }],
        labels:[]
      },
      year:1960
    }
  }
  componentDidMount() {
    let self = this;
    axios.get('./data/data.json', {
    })
    .then(function (response) {
      data = response.data;
      self.updateData();
      setInterval(() => {
        if (self.state.year >= 2017) {
          self.setState((state, props) => ({
            year:1960
          }), self.updateData);
        }
        else {
          self.setState((state, props) => ({
            year:state.year + 1
          }), self.updateData);
        }
      }, 500);
    })
    .catch(function (error) {
    })
    .then(function () {
    });
  }
  componentWillUnMount() {
  }
  updateData() {
    let current_data = {
      datasets:[{
        backgroundColor:[],
        borderAlign:[],
        borderColor:[],
        borderWidth:[],
        data:[],
        hoverBackgroundColor:'#000'
      }],
      labels:[]
    };
    _.each(_.sortBy(data.filter((value, index, arr) => { if (this.state.active_continents.includes(value.continent)) { return value; }}), (country) => { return order[country.continent]; }), (country) => {
      current_data.datasets[0].data.push(country[this.state.year] * 100);
      current_data.datasets[0].backgroundColor.push(this.getCountryColor(country.continent, country[this.state.year] * 4));
      current_data.datasets[0].borderWidth.push(0);
      current_data.labels.push(country.name);
    });
    this.setState((state, props) => ({
      data:current_data
    }));
  }
  getCountryColor(continent, value) {
    let continentColors = {
      'Africa':'rgba(230, 25, 75, ' + value + ')',
      'Asia':'rgba(60, 180, 75, ' + value + ')',
      'Europe':'rgba(245, 130, 49, ' + value + ')',
      'N. America':'rgba(128, 0, 0, ' + value + ')',
      'Oceania':'rgba(240, 50, 230, ' + value + ')',
      'S. America':'rgba(0, 0, 117, ' + value + ')'
    }
    return continentColors[continent];
  }
  selectContinent(continent) {
    if (this.state.active_continents.includes(continent) === true) {
      this.setState((state, props) => ({
        active_continents:this.state.active_continents.filter((value, index, arr) => { if (value !== continent) return value; })
      }));
    }
    else {
      this.setState((state, props) => ({
        active_continents:this.state.active_continents.concat(continent)
      }));
    }
  }
  render() {
    let options = {
      legend: {
        display: false,
      },
      maintainAspectRatio: true,
      responsive: true,
      scale: {
        ticks: {
          callback:function(value) {
            return value + '%';
          },
          fontFamily: 'verdana',
          fontSize: 11,
          fontStyle: 'normal',
          max: 27,
          min: 0,
          stepSize: 3
        }
      },
      tooltips: {
        enabled: false,
        custom: function(tooltipModel) {
          let tooltipEl = document.getElementById('chartjs-tooltip');
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = '<div></div>';
            document.body.appendChild(tooltipEl);
          }
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }
          if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
          }
          else {
            tooltipEl.classList.add('no-transform');
          }
          if (tooltipModel.body) {
            tooltipEl.innerHTML = tooltipModel.body[0].lines[0].split(':')[0];
          }
          let position = this._chart.canvas.getBoundingClientRect();
          tooltipEl.style.opacity = 1;
          tooltipEl.className = style.tooltip;
          tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
          tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
          tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
        }
      }
    }
    let size;
    if (window.innerWidth < window.innerHeigh) {
      size = window.innerWidth
    }
    else {
      size = window.innerHeight
    }
    return (
      <div className={style.app}>
        <h3>Share of over 65 year olds per country in <span>{this.state.year}</span></h3>
        <div className={style.chart_container}>
          <Polar data={this.state.data} options={options} width={size} height={size} />
          <legend>
            <div>Filter by continent</div>
            <span onClick={() => this.selectContinent('Africa')} className={style.africa} style={this.state.active_continents.includes('Africa') ? {opacity: 1} : {}}>Africa</span>
            <span onClick={() => this.selectContinent('Asia')} className={style.asia} style={this.state.active_continents.includes('Asia') ? {opacity: 1} : {}}>Asia</span>
            <span onClick={() => this.selectContinent('Europe')} className={style.europe} style={this.state.active_continents.includes('Europe') ? {opacity: 1} : {}}>Europe</span>
            <span onClick={() => this.selectContinent('N. America')} className={style.n_america} style={this.state.active_continents.includes('N. America') ? {opacity: 1} : {}}>N. America</span>
            <span onClick={() => this.selectContinent('Oceania')} className={style.oceania} style={this.state.active_continents.includes('Oceania') ? {opacity: 1} : {}}>Oceania</span>
            <span onClick={() => this.selectContinent('S. America')} className={style.s_america} style={this.state.active_continents.includes('S. America') ? {opacity: 1} : {}}>S. America</span>
          </legend>
        </div>
        <h3>Conclusion:<br />We are getting older</h3>
        <p>Source: <a href="https://data.worldbank.org/">Worldbank</a></p>
      </div>
    );
  }
}
export default App;