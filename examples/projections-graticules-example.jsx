/* global d3 */

import React from 'react';

import Datamap from '../src';
import Example from './example';

const colors = d3.scale.category10();

export default class ProjectionsGraticulesExample extends React.Component {
    // setProjection(element) {
	   //  const projection = d3.geo.orthographic();
	   //  projection.scale((600 + 1) / 2 / Math.PI)
	   //  projection.scale(250).clipAngle(90).rotate([90, 0]);
	   //  // TODO: Rotate 90 should be binded to mouse move. each x+1 mouse move should change rotation x with 0.1;
	   //  // Basicly, set a rotation object in the state and on mouse move update it, use the state parameter inside this function. Should work.
	   //  projection.translate([600 / 2, 600 / 1.8]);
	   //  const path = d3.geo.path()
	   //    .projection(projection);
	   //  return { path, projection };
    // }



  	render() {
		return (
			<Example
				label="Projections & Graticules"
				mapStyle={{
					height: '600px'
				}}
			>
				<Datamap
					style={{
						height: '600px'
					}}
					scope="world"
					projection="orthographic"
					rotate={true}
					rotationAngleX={10}
					rotationAngleY={0}
					fills={{
						defaultFill: '#abdda4',
						gt50: colors(Math.random() * 20),
						eq50: colors(Math.random() * 20),
						lt25: colors(Math.random() * 10),
						gt75: colors(Math.random() * 200),
						lt50: colors(Math.random() * 20),
						eq0: colors(Math.random() * 1),
						pink: '#0fa0fa',
						gt500: colors(Math.random() * 1)
					}}
					projectionConfig={{
						rotation: [97, -30]
					}}
					data={{
						USA: { fillKey: 'lt50' },
						MEX: { fillKey: 'lt25' },
						CAN: { fillKey: 'gt50' },
						GTM: { fillKey: 'gt500' },
						HND: { fillKey: 'eq50' },
						BLZ: { fillKey: 'pink' },
						GRL: { fillKey: 'eq0' }
					}}
					bubbles={[
						{
							name: 'Bubble 1',
							latitude: 21.32,
							longitude: -7.32,
							radius: 5,
							fillKey: 'gt500'
						},
						{
							name: 'Bubble 2',
							latitude: 12.32,
							longitude: 27.32,
							radius: 5,
							fillKey: 'eq0'
						},
						{
							name: 'Bubble 3',
							latitude: 0.32,
							longitude: 23.32,
							radius: 5,
							fillKey: 'lt25'
						},
						{
							name: 'Bubble 4',
							latitude: -31.32,
							longitude: 23.32,
							radius: 3,
							fillKey: 'eq50'
						}
					]}
					graticule
					arcOptions={{
						greatArc: true,
						animationSPeed: 2000
					}}
				/>
			</Example>
		);
	}

}
