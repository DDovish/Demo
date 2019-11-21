import React, {Component} from "react";
import {Line} from 'react-chartjs-2';
import moment from 'moment'
import{TextField,Button} from "@material-ui/core"
import Grid from "@material-ui/core/Grid";

//generate random data and time increases by second
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
    let date = moment('Nov 01 2019', 'MMM DD YYYY');
    let data = [];
    for (; data.length < 600 ; date = date.clone().add(1, unit).startOf(unit)) {
        data.push(randomBar(date, data.length > 0 ? data[data.length - 1].y : 30));
    }
    console.log(data)
    return data;
}

//define the chart
class MyChart extends Component {
    constructor(props){
        super(props);
        let dataGenerated = generateData()
        this.state = {
            data: {
                datasets: [{
                    label: 'CHART1 - Chart.js Corporation',
                    backgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    data: dataGenerated,
                    type: 'line',
                    pointRadius: 0,
                    fill: 'false',
                    lineTension: 0,
                    borderWidth: 2
                },
                {
                    label: 'Selected',
                    backgroundColor: "rgba(25,25,255,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    data: [],
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
                legend: {
                    onClick: (e) => e.stopPropagation()
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
                    }],
                    yAxes: [{
                        gridLines: {
                            drawBorder: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Power (W)'
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                tooltips: {
                    intersect: false,
                    mode: 'index',
                    callbacks: {
                        label: function(tooltipItem, myData) {
                            let label = myData.datasets[tooltipItem.datasetIndex].label || '';
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
            point2: '',
            turn1: true,
            area: ''
        }
    }
//Do the math
    calculateArea(){
        let point1 = this.state.point1
        let point2 = this.state.point2
        if(point1 === '' || point2 === '') {
            alert("Please select points!")
            return
        }
        if(this.state.data.datasets[0].data[point1].t > this.state.data.datasets[0].data[point2].t){
            point1 = this.state.point2
            point2 = this.state.point1
        }
        // Here we use Newton-Leibniz formula to calculate the integration
        let Ya = this.state.data.datasets[0].data[point1].y
        let Yb = this.state.data.datasets[0].data[point2].y
        let s1 = 0
        let s2 = 0
        for(let i = 1; i<= (point2-point1)/2;i++){
            let X = 2*(i) - 1
            s1 += Number(this.state.data.datasets[0].data[X].y)
        }
        for(let i = 1; i<= (point2-point1)/2-1; i++){
            let X = 2*(i)
            s2 += Number(this.state.data.datasets[0].data[X].y)
        }
        let integrateArea = (Number(Ya) + Number(Yb) + s1 * 4 + s2 * 2) / 3
        console.log(integrateArea)
        this.setState({area:integrateArea.toFixed(2)})

        let oldDataset = this.state.data.datasets[0].data
        let originDataset = {...this.state.data.datasets}
        let newDataset = oldDataset.slice(0,point1).map(el => ({ t: el.t, y: 0})).concat(oldDataset.slice(point1,point2)).concat(oldDataset.slice(point2).map(el => ({ t: el.t, y: 0})))
        originDataset[1].data = newDataset
        this.setState({originDataset})
        console.log(this.state.data.datasets[0])
        console.log(this.state.data.datasets[1])
    }

    setPoints(elements){
        if(elements.length > 0) {
            let clickedDatasetIndex = elements[0]._datasetIndex
            let clickedElementIndex = elements[0]._index
            let electricity = this.state.data.datasets[0].data[clickedElementIndex].y
            console.log(clickedDatasetIndex)
            console.log(clickedElementIndex)
            alert("Power is  " + electricity + "W")
            if(this.state.turn1){ this.setState({turn1:false, point1:clickedElementIndex})}
            else{this.setState({turn1:true, point2:clickedElementIndex})}
        }
        else{
            alert("You need to click on point!")
        }
    }

    render() {
        return(
            <div className="chart">
                <Line width={800} height={600} data={this.state.data} options={this.state.options}
                      getElementAtEvent={ elements => {this.setPoints(elements)}}/>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <TextField  value = {"Point1 Time is " + this.state.point1 + "s"} disabled/>
                        <TextField  value = {"Point2 Time is " + this.state.point2 + "s"} disabled/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="Total Energy" value={this.state.area} disabled/>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" color="primary" onClick={ ()=>{
                            this.calculateArea()
                        }}>
                            Calculate
                        </Button>
                    </Grid>
                </Grid>

            </div>
        )
    }
}
export default MyChart;
