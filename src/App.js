import './App.css'
import { useReducer } from 'react';


function reducer(inp, action) {
	switch (action.type) {
	  case 'update_kredit': {
		return {
			...inp,
			kredit: action.val,
		};
	  }
	  case 'update_annulitaet': {
		return {
			...inp,
			annulitaet: action.val,
		};
	  }
	  case 'update_zinssatz': {
		return {
			...inp,
			zinssatz: action.val,
		};
	  }
	}
	throw Error('Unknown action: ' + action.type);
}

function App() {
	const initialInput = { kredit: 0, annulitaet: 1, zinssatz: 0.5};
	const [inp, dispatch] = useReducer(reducer, initialInput);

    return (
		<div className='app flexCol' >
			<h1>Kreditrechner</h1>
			<InputComp inp={inp} update={dispatch} />
			<DisplayComp inp={inp} />
		</div>
    );
}

function InputComp({inp, update}) {
	return (
		<div className='inputcomp' >
			<InputNumber descr='Kredit' ty='update_kredit' num={inp.kredit} changeNum={update} />
			<InputNumber descr='Annulität' ty='update_annulitaet' num={inp.annulitaet} changeNum={update} />
			<InputNumber descr='Zinssatz' ty='update_zinssatz' num={inp.zinssatz} changeNum={update} />
		</div>
    );
}

function InputNumber({descr, num, changeNum, ty}) {
	return (
		<div className='flexRow spacebetween'>
			<label htmlFor={descr} style={{marginRight: '1em'}}>{descr}</label>
			<input id={descr} value={num} onChange={e => changeNum({type: `${ty}`, val: e.target.value})} type='number' />
		</div>
    );
}

function DisplayComp({inp}) {
	function genTable() {
		let A = [{Rest: inp.kredit, Zinsen: inp.kredit * inp.zinssatz, Annulität: inp.annulitaet}];

		while (A[A.length-1].Rest > 0) {
			let RestNeu = Math.max(A[A.length-1].Rest - A[A.length-1].Annulität + A[A.length-1].Zinsen, 0);
			A.push({Rest: RestNeu, Zinsen: RestNeu * inp.zinssatz, Annulität: inp.annulitaet});
			
			if (RestNeu >= A[A.length-2].Rest) {
				A.push({Rest: 'X', Zinsen: 'X', Annulität: 'X'});
				break;
			}
		}
		return A;
	}

	const A=genTable();
	return (
		<div className='displaycomp' >
			<Table A={A} /> 
		</div>
    );
}

function Table({A}) {
	const format = (x) => Number.isInteger(x) ? Math.round(x * 10) / 10 : x;
	return (
		<table>
			<thead>
				<tr>
					{Object.keys(A[0]).map(ke => <th key={ke}>{ke}</th>)}
				</tr>
			</thead>
			<tbody>
				{A.map((s,i) => 
					<tr key={i}>
						{Object.keys(A[0]).map(ke => <td key={ke+i}>{format(s[ke])}</td>)}
					</tr>)}
			</tbody>
		</table>
	);
}

export default App;
