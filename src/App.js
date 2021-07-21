import './App.css';
import { customerRecord } from './customerRecord';
import react from 'react';

const Months = {
  '4': 'May',
  '5': 'June',
  '6': 'July'
}

class App extends react.Component {
  state = {
    customers: [],
  }
  
  handleClick = () => {
      console.log("return a log");
      let customers = this.processCustomerNames();
      let sortCustomerDataByMonth = this.sortCustomerDataByMonth();
      this.setState({
        customers: customers
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

    console.log(customerMonth);
    return customerMonth;
  }

  processCustomerNames() {
    let customers = new Set()
    for(let i=0; i<customerRecord.length; i++) {
      // console.log(customerRecord[i].transactionDate.getMonth());
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
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.handleClick}>
            calculate the reward points
          </button>
          <table class="data-table">
              {this.state.customers.map((name, idx) => {
                let customerMonth = this.sortCustomerDataByMonth();

                let dataByname = customerMonth.get(name);

                console.log(dataByname)

                return ( Object.entries(dataByname).map((entry) => {
                  console.log(entry);
                  return (
                    <tr>
                      <td>
                        {name}
                      </td>
                      <td>
                        {Months[entry[0]]}
                      </td>
                      <td>
                        {entry[1][0]} points
                      </td>
                    </tr>
                  )
                })

                )

              })}
            
            <tr>500</tr>
            <tr>1600</tr>
          </table>
        </header>
      </div>
    );
  }
}

export default App;
