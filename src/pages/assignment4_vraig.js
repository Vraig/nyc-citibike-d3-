import React from 'react'
import * as d3 from "d3"
import 'bootstrap/dist/css/bootstrap.css'

import { Row, Col, Container} from 'react-bootstrap'
import ScatterPlot from '../components/ScatterPlot'
import BarChart from '../components/BarChart'

// NYC CitiBike 2020 dataset
const csvUrl = 'https://gist.githubusercontent.com/hogwild/3b9aa737bde61dcb4dfa60cde8046e04/raw/citibike2020.csv'

function useData(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(()=>{
        d3.csv(csvPath).then(data => {
            data.forEach(d => {
                // Convert strings to numbers for calculations
                d.start = +d.start;
                d.tripdurationS = +d.tripdurationS;
                d.end = +d.end;
                d.tripdurationE = +d.tripdurationE;
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

const Charts = () => {
    const [month, setMonth] = React.useState('4');
    const [windowSize, setWindowSize] = React.useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    React.useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const dataAll = useData(csvUrl);

    if (!dataAll) {
        return <pre>Loading...</pre>;
    };

    // Setup chart dimensions based on window size
    const containerPadding = 40;
    const headerHeight = 120;
    const availableHeight = windowSize.height - headerHeight - containerPadding;
    const availableWidth = windowSize.width - containerPadding;
    
    const WIDTH = Math.min(600, (availableWidth / 2) - 40);
    const HEIGHT = Math.min(450, availableHeight - 20);
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }; 
    const innerHeightScatter = HEIGHT - margin.top - margin.bottom;
    const innerHeightBar = HEIGHT - margin.top - margin.bottom - 120;
    const innerWidth = WIDTH - margin.left - margin.right;
    
    const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Filter data for selected month
    const data = dataAll.filter(d => { 
        return d.month === MONTH[month] 
    });

    // Create scales for charts
    const xScaleScatter = d3.scaleLinear()
        .domain([0, d3.max(dataAll, d => d.tripdurationS)])
        .range([0, innerWidth])
        .nice(); 
    
    const yScaleScatter = d3.scaleLinear()
        .domain([0, d3.max(dataAll, d => d.tripdurationE)])
        .range([innerHeightScatter, 0])
        .nice();

    const xScaleBar = d3.scaleBand()
        .domain(data.map(d => d.station))
        .range([0, innerWidth])
        .padding(0.1);
       
    const yScaleBar = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.start)])
        .range([innerHeightBar, 0])
        .nice();

    const changeHandler = (event) => {
       setMonth(event.target.value);
    };

    return (
        <Container fluid style={{ height: '100vh', padding: '20px', overflow: 'hidden' }}>
            <Row className="mb-3">
                <Col lg={12} className="text-center">
                    <h4 className="mb-0">NYC CitiBike Data Visualization - 2020</h4>
                </Col>
            </Row>
            {/* show the 2 charts side by side and Setup chart dimensions based on window size */}
            {/*i did this because of visibility design. it's hard to see the 2 charts vertically */}
            <Row className="mb-3">
                <Col lg={6} md={8} className="mx-auto">
                    <div className="d-flex align-items-center">
                        <label htmlFor="month-slider" className="me-2 small">Month:</label>
                        <input 
                            id="month-slider"
                            key="slider" 
                            type='range' 
                            min='0' 
                            max='11' 
                            value={month} 
                            step='1' 
                            onChange={changeHandler}
                            className="form-range me-2"
                            style={{flex: 1}}
                        />
                        <input 
                            key="monthText" 
                            type="text" 
                            value={MONTH[month]} 
                            readOnly
                            className="form-control form-control-sm"
                            style={{width: '60px'}}
                        />
                    </div>
                </Col>
            </Row>
            <Row className="justify-content-center" style={{ height: `${availableHeight}px` }}>
                <Col xs={6} className="ps-1 pe-1" style={{ height: '100%' }}>
                    <ScatterPlot 
                        svgWidth={WIDTH} 
                        svgHeight={HEIGHT} 
                        marginLeft={margin.left} 
                        marginTop={margin.top} 
                        data={data} 
                        xScale={xScaleScatter} 
                        yScale={yScaleScatter} 
                    />
                </Col>
                <Col xs={6} className="ps-1 pe-1" style={{ height: '100%' }}>
                    <BarChart 
                        svgWidth={WIDTH} 
                        svgHeight={HEIGHT} 
                        marginLeft={margin.left} 
                        marginTop={margin.bottom} 
                        data={data} 
                        xScale={xScaleBar} 
                        yScale={yScaleBar} 
                    />
                </Col>
            </Row>
        </Container>
    )   
}

export default Charts
