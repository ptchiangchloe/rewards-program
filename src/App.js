import './App.css';
import { customerRecord } from './customerRecord';
import react from 'react';

import { Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const MONTHS = {
  '4': 'May',
  '5': 'June',
  '6': 'July'
}

class App extends react.Component {
  state = {
    customers: [],
    showTable: false
  }
  
  handleClick = () => {
      let customers = this.processCustomerNameIntoArray();
      this.setState({
        customers: customers,
        showTable: true
      })
  }

  sortCustomerDataByMonth() {
    let customerMonth = new Map();

    for(let i=0; i<customerRecord.length; i++) {
      let name = customerRecord[i].name;
      name = name.charAt(0).toUpperCase() + name.slice(1);
      let month = customerRecord[i].transactionDate.getMonth();
      const transactionAmount = customerRecord[i].transactionAmount;

      if(customerMonth.has(name)) {
        let months = customerMonth.get(name);
        if(months[month]) {
          let points = this.pointCalculator(transactionAmount);
          months[month].push(points)
        } else {
          months[month] = [];
          let points = this.pointCalculator(transactionAmount);
          months[month].push(points)
        }
        customerMonth.set(name, months);
      } else {
        let months = {}
        months[month] = [];
        let points = this.pointCalculator(transactionAmount);
        months[month].push(points)
        customerMonth.set(name, months);
      }
    }

    return customerMonth;
  }

  processCustomerNameIntoArray() {
    let customers = new Set()
    for(let i=0; i<customerRecord.length; i++) {
      let name = customerRecord[i].name
      name = name.charAt(0).toUpperCase() + name.slice(1)
      customers.add(name);
    }

    return Array.from(customers);
  }

  pointCalculator(dollar) {
    let sum = 0;
    if(dollar > 50) {
      sum += dollar - 50 
    }
    if(dollar > 100) {
      sum += (dollar - 100) * 2 
    }
    return sum;
  }
  
  render() {
    let customerMonth = this.sortCustomerDataByMonth();
    if(this.state.showTable) {
      return (
        <div className="App">
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Customer Name</TableCell>
                  <TableCell align="center">Time</TableCell>
                  <TableCell align="center">Reward Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.state.customers.map((name, idx) => {
                    let dataByName = customerMonth.get(name);
                    return ( Object.entries(dataByName).map((entry) => {
                      return (
                        <TableRow>
                          <TableCell align="center" className="customer-name">
                            {name}
                          </TableCell>
                          <TableCell align="center">
                            {MONTHS[entry[0]]}
                          </TableCell>
                          <TableCell align="center">
                            {entry[1][0]} points
                          </TableCell>
                        </TableRow>
                      )
                    }))
                  })
                }
                {
                  this.state.customers.map((name, idx) => {
                    let months = customerMonth.get(name);
                    let total = 0;
                    for(let month in months) {
                      total += +months[month];
                    }
                    return (
                      <TableRow key={idx}>
                        <TableCell align="center" className="customer-name">
                          {name}
                        </TableCell>
                        <TableCell align="center">
                          Total
                        </TableCell>
                        <TableCell align="center">
                          {total} points
                        </TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>    
            </Table>
          </TableContainer>   
        </div>
      );
    } else {
      return (
        <div className="App">
          <Button variant="contained" onClick={this.handleClick}>
                Calculate the reward points
          </Button>
        </div>
      )
    }
  }
}

export default App;
