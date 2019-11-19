import React, {Component} from "react";
import {Line} from 'react-chartjs-2';
import moment from 'moment'
import {colors} from "@material-ui/core";
import {Input, Button} from "@material-ui/core";

function generateData() {
    let unit = "second";
    function randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
    function randomBar(date, lastClose) {
        let open = randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
        let close = randomNumber(open * 0.95, open * 1.05).toFixed(2);
        return {
            t: date.valueOf(),
            y: close
        };
    }
    let date = moment('Jan 01 2019', 'MMM DD YYYY');
    let data = [];
    for (; data.length < 600 ; date = date.clone().add(1, unit).startOf(unit)) {
        data.push(randomBar(date, data.length > 0 ? data[data.length - 1].y : 30));
    }
    return data;
}

class MyChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: {
                datasets: [{
                    label: 'CHART - Chart.js Corporation',
                    backgroundColor: colors.yellow,
                    borderColor: colors.red,
                    data: generateData(),
                    type: 'line',
                    pointRadius: 0,
                    fill: 'origin',
                    lineTension: 0,
                    borderWidth: 2
                }]
            },
            options: {
                animation: {
                    duration: 0
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        distribution: 'series',
                        offset: true,
                        ticks: {
                            major: {
                                enabled: true,
                                fontStyle: 'bold'
                            },
                            source: 'data',
                            autoSkip: true,
                            autoSkipPadding: 75,
                            maxRotation: 0,
                            sampleSize: 100
                        },
                        // afterBuildTicks: function(scale) {
                        //     var majorUnit = scale._majorUnit;
                        //     var ticks = scale.ticks;
                        //     var firstTick = ticks[0];
                        //     var i, ilen, val, tick, currMajor, lastMajor;
                        //     val = moment(ticks[0].value);
                        //     if ((majorUnit === 'minute' && val.second() === 0)
                        //         || (majorUnit === 'hour' && val.minute() === 0)
                        //         || (majorUnit === 'day' && val.hour() === 9)
                        //         || (majorUnit === 'month' && val.date() <= 3 && val.isoWeekday() === 1)
                        //         || (majorUnit === 'year' && val.month() === 0)) {
                        //         firstTick.major = true;
                        //     } else {
                        //         firstTick.major = false;
                        //     }
                        //     lastMajor = val.get(majorUnit);
                        //     for (i = 1, ilen = ticks.length; i < ilen; i++) {
                        //         tick = ticks[i];
                        //         val = moment(tick.value);
                        //         currMajor = val.get(majorUnit);
                        //         tick.major = currMajor !== lastMajor;
                        //         lastMajor = currMajor;
                        //     }
                        // }
                    }],
                    yAxes: [{
                        gridLines: {
                            drawBorder: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Closing price ($)'
                        }
                    }]
                },
                tooltips: {
                    intersect: false,
                    mode: 'index',
                    callbacks: {
                        label: function(tooltipItem, myData) {
                            var label = myData.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += parseFloat(tooltipItem.value).toFixed(2);
                            return label;
                        }
                    }
                }
            },
            point1: '',
            point2: ''
        }
    }
    render() {
        return(
            <div className="chart">
                <Line width="600px" height="400px" data={this.state.data} options={this.state.options}/>
                <Input value="hello" disabled/>
                <Button variant="contained" color="primary">
                    Primary
                </Button>
            </div>
        )
    }
}

export default MyChart;