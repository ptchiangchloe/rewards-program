import './App.css';
import { customerRecord } from './customerRecord';
import react from 'react';

// import material-ui for styling
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

// Translate single transaction based object into client-month based Map object. 
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
  
//receives 2 points for every dollar spent over $100 in each transaction, 
// plus 1 point for every dollar spent over $50 in each transaction
//(e.g. a $120 purchase = 2x$20 + 1x$50 = 90 points).
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
  
// When the user clicks `CALCULATE THE REWARD POINTS`
// the click handler will triger a translation from the single transaction based 
// data set to the client-month based data set, and then the new 
// data set will be translated into the UI values by the JSX template.

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
