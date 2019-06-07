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
      data:{
        datasets:[{
          backgroundColor:[],
          data:[]
        }],
        labels:[]
      },
      animation: {
        duration: 500
      },
      year:1960,
      hoveredSection: false
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
            year:self.state.year + 1
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
    _.each(_.sortBy(data, (country) => { return order[country.continent]; }), (country) => {
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
    // rgba(230, 25, 75, 1.0)
    // rgba(60, 180, 75, 1.0)
    // rgba(245, 130, 49, 1.0)
    // rgba(128, 0, 0, 1.0)
    // rgba(240, 50, 230, 1.0)
    // rgba(0, 0, 117, 1.0)
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
  render() {
    let options = {
      onHover:function(event) {
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
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
          tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
          tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
          tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
          tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
          tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
          tooltipEl.style.pointerEvents = 'none';
        }
      },
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
      maintainAspectRatio: true,
      legend: {
        display: false,
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
        <h3>Share of over 65 year olds per country in {this.state.year}</h3>
        <div className={style.chart_container}>
          <legend>

          </legend>
          <Polar data={this.state.data} options={options} width={400} height={400} />
        </div>
        <h3>Conclusion: We are getting older</h3>
      </div>
    );
  }
}
export default App;