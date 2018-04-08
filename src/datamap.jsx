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
		width: PropTypes.any,
		style: PropTypes.object,
		drag: PropTypes.bool,
		center: PropTypes.array,
        scale: PropTypes.number,
        rotate: PropTypes.array
	};

    static defaultProps = {
      center : [23, -3],
      scale  : 200,
      rotate : [23, -3],
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
		    center: this.props.center,
		    scale: this.props.scale,
		    rotate: this.props.rotate
		};
	}

	componentDidMount() {
		
		if (this.props.responsive) {
			window.addEventListener('resize', this.resizeMap);
		}
		this.drawMap();
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
	}

	clear() {
		for (const child of Array.from(this.container.childNodes)) {
			this.container.removeChild(child);
		}

		delete this.map;
	}

	setProjection = (element) => {
		const projection = d3.geo[this.props.projection]()
			.center(this.state.center)
			.rotate(this.state.rotate)
			.scale(this.state.scale),
		      path = d3.geo.path()
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
				element: this.container
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


    onMove(e) {
        this.setState(prevState => {
		     return {
		     	...this.state,
		     	currentPositionX: e.clientX,
			    currentPositionY: e.clientY,
		     	rotate: [
		     	   prevState.rotate[0] + this.getRotationStep(e.clientX, prevState.currentPositionX),
		     	   prevState.rotate[1] + this.getRotationStep(prevState.currentPositionY, e.clientY)
		     	]   
		     }
		});   
		this.reDrawMap();	  
    }

    onMouseDown = (e) => {
        if (!this.props.drag) {
    	    return;
    	}
        this.container.addEventListener('mousemove', this.onMouseMove);
        this.container.addEventListener('mouseup', this.onMouseUp);
        this.setState({
        	...this.state,
            currentPositionX: e.clientX,
			currentPositionY: e.clientY,
        });
        e.preventDefault();
    }

    onMouseUp = (e) =>  {
        this.container.removeEventListener('mousemove', this.onMouseMove);
        this.container.removeEventListener('mouseup', this.onMouseUp);
        e.preventDefault();
    }

    onMouseMove = (e) =>  {
        this.onMove(e);
        e.preventDefault();
    }

    getRotationStep(prev, next){
        return (prev - next) / 10 ;
    }

	render() {
		const style = {
			height: '100%',
			position: 'relative',
			width: '100%',
			...this.props.style
		};

		return <div ref={container => this.container = container} onMouseDown={this.onMouseDown} style={style} />;
	}

}
