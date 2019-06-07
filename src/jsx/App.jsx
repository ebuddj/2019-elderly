import React, {Component} from 'react'
import style from './../styles/styles.less';

// https://alligator.io/react/axios-react/
import axios from 'axios';

// https://underscorejs.org/
import _ from 'underscore';

import {RadialChart, CircularGridLines, XYPlot, ArcSeries, XAxis, YAxis, MarkSeries} from 'react-vis';

import {Polar} from 'react-chartjs-2';

let data = [];

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
        borderColor:[],
        borderWidth:[],
        borderAlign:[],
        data:[]
      }],
      labels:[]
    };
    _.each(_.sortBy(data, (country) => { return country.continent; }), (country) => {
      current_data.datasets[0].data.push(country[this.state.year]);
      current_data.datasets[0].backgroundColor.push(this.getCountryColor(country.continent, country[this.state.year] * 3));
      current_data.datasets[0].borderWidth.push(0);
      current_data.labels.push(country.name);
    });
    this.setState((state, props) => ({
      data:current_data
    }));
  }
  getCountryColor(continent, value) {
    let continentColors = {
      'Africa':'rgba(255, 0, 0, ' + value + ')',
      'Asia':'rgba(255, 127, 0, ' + value + ')',
      'Asia':'rgba(255, 255, 0, ' + value + ')',
      'Europe':'rgba(0, 255, 0, ' + value + ')',
      'N. America':'rgba(0, 0, 255, ' + value + ')',
      'Oceania':'rgba(75, 0, 130, ' + value + ')',
      'S. America':'rgba(139, 0, 255, ' + value + ')'
    }
    return continentColors[continent];
  }
  render() {
    let options = {
      responsive: true,
      scale: {
        ticks: {
          min: 0,
          max: 0.2
        }
      },
      legend: {
        display: false,
      }
    }
    return (
      <div className={style.app}>
        <h3>{this.state.year}</h3>
        <div>
          <Polar data={this.state.data} options={options} />
        </div>
      </div>
    );
  }
}
export default App;