import PropTypes from 'prop-types';
import React from 'react';
import Datamaps from 'datamaps';

const MAP_CLEARING_PROPS = [
	'height', 'scope', 'setProjection', 'width'
];

const propChangeRequiresMapClear = (oldProps, newProps) => {
	return MAP_CLEARING_PROPS.some((key) =>
		oldProps[key] !== newProps[key]
	);
};

export default class Datamap extends React.Component {

	static propTypes = {
		arc: PropTypes.array,
		arcOptions: PropTypes.object,
		bubbleOptions: PropTypes.object,
		bubbles: PropTypes.array,
		data: PropTypes.object,
		graticule: PropTypes.bool,
		height: PropTypes.any,
		labels: PropTypes.bool,
		responsive: PropTypes.bool,
		style: PropTypes.object,
		updateChoroplethOptions: PropTypes.object,
		width: PropTypes.any
	};

	constructor(props) {
		super(props);
		this.resizeMap = this.resizeMap.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

		this.state = {
			currentPositionX: 0,
			currentPositionY: 0,
			center: [23, -3],
			scale: 200,
			rotation: [23, -3]
		};
	}

	componentDidMount() {
		
		if (this.props.responsive) {
			window.addEventListener('resize', this.resizeMap);
		}
		this.drawMap();
		//this.update();
	}

	componentWillReceiveProps(newProps) {
		if (propChangeRequiresMapClear(this.props, newProps)) {
			this.clear();
		}
		
	}

	componentDidUpdate() {
		this.drawMap();
	}

	componentWillUnmount() {
		this.clear();
		if (this.props.responsive) {
			window.removeEventListener('resize', this.resizeMap);
		}
		clearInterval(this.interval);
	}

	update() {        
		this.interval = setInterval(() => {
            this.setState(prevState => {
		     return {
		     	...this.state,
		     	rotation: [prevState.rotation[0] + this.props.rotationAngleX, prevState.rotation[1] + this.props.rotationAngleY]
		     }
			});
			this.reDrawMap();
		}, 1000);
	}

	clear() {
		const { container } = this.refs;

		for (const child of Array.from(container.childNodes)) {
			container.removeChild(child);
		}

		delete this.map;
	}

	 setProjection = (element) => {
	 	let self = this;
		const projection = d3.geo.orthographic()
			.center(this.state.center)
			.rotate(this.state.rotation)
			.scale(this.state.scale);
		const path = d3.geo.path()
			.projection(projection);

		return { path, projection };
	}

	drawMap() {
		const {
			arc,
			arcOptions,
			bubbles,
			bubbleOptions,
			data,
			graticule,
			labels,
			updateChoroplethOptions,
			...props
		} = this.props;
		let map = this.map;

		if (!map) {
			map = this.map = new Datamaps({
				...props,
				data,
				setProjection: this.setProjection,
				element: this.refs.container
			});
		} else {
			map.updateChoropleth(data, updateChoroplethOptions);
		}

		if (arc) {
			map.arc(arc, arcOptions);
		}

		if (bubbles) {
			map.bubbles(bubbles, bubbleOptions);
		}

		if (graticule) {
			map.graticule();
		}

		if (labels) {
			map.labels();
		}
	}

	reDrawMap(){
		this.clear();
		this.drawMap();
	}

	resizeMap() {
		this.map.resize();
	}

	mouseMoveMap(){
		document.getElementById('map').addEventListener("mousedown", function(){
			 console.log(e.clientX, e.clientY);
	        isDown = true;
	    })
	    .addEventListener("mousemove", function(e){
	        if(isDown) {
	            console.log(e.clientX, e.clientY);
	        }
	     })
	    .addEventListener("mouseup", function(){

	        isDown = false;
	    });     
	}



    onMove(e) {
      //  const x = Math.trunc((e.pageX - this.state.relX) / this.gridX) * this.gridX;
        //const y = Math.trunc((e.pageY - this.state.relY) / this.gridY) * this.gridY;
        console.log(e.pageX +'-'+this.state.currentPositionX, e.pageY +'-'+ this.state.currentPositionY);

        this.setState(prevState => {
		     return {
		     	...this.state,
		     	currentPositionX: e.clientX,
			    currentPositionY: e.clientY,
		     	rotation: [prevState.rotation[0] + (e.clientX - prevState.currentPositionX), prevState.rotation[1] + ( prevState.currentPositionY - e.clientY )]
		     }
			});   
		this.reDrawMap();	  
    }

    onMouseDown(e) {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        this.setState({
        	...this.state,
            currentPositionX: e.clientX,
			currentPositionY: e.clientY,
        });
        e.preventDefault();
    }

    onMouseUp(e) {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        //this.props.onStop && this.props.onStop(this.state.x, this.state.y);
        e.preventDefault();
    }

    onMouseMove(e) {
        this.onMove(e);
        e.preventDefault();
    }

	render() {
		const style = {
			height: '100%',
			position: 'relative',
			width: '100%',
			...this.props.style
		};

		return <div ref="container" onMouseDown={this.onMouseDown} id="map" style={style} />;
	}

}
