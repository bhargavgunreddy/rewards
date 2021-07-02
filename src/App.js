import './App.css';

import React, { useCallback, useEffect, useState } from 'react'


const RewardsApp = () => {

  const rewardsPolicy = `Rewards Policy: 
  A customer receives 2 points for every dollar spent over 100 in each transaction, plus 1 point for every dollar spent over 50 in each transaction
  e.g. a 123 dollar purchase = 2x23 + 1x73 = 119 points.
  (Calculation seems off in the question i fixed it)
  `;

  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [rewardsPerMonth, setRewardsPerMonth] = useState({});
  const [totalRewards, setTotalRewards] = useState(0);

  const populateTransactions = useCallback(() => {
    return transactions.map((record, index) => (
      <tr key={index}>
        <td>{record.transactionDate}</td>
        <td>{record.category}</td>
        <td>{record.amount}</td>
      </tr>)
    );
  }
    , [transactions]);

  const getRewardsForAmount = useCallback((amount) => {
    let rewards = 0;
    if (amount > 50) {
      rewards += (amount - 50) * 1;
      if (amount > 100) {
        rewards += (amount - 100) * 2;
      }
    }
    return rewards;
  }, []);

  const rewardsPerMonthList = useCallback(() => {
    return Object.keys(rewardsPerMonth).map((month, idx) => (
      <tr key={idx}>
        <td>{month}</td>
        <td>{rewardsPerMonth[month]}</td>
      </tr>
    ))
  }, [rewardsPerMonth]);

  // fetch all transactions
  useEffect(() => {
    fetch('./transactions.json')
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
      },
        (err) => setError(err));
  }, []);

  // Calcluate rewards based on transactions
  useEffect(() => {
    let totalRewards = 0;
    let rewardsPerMonth = {};
    transactions.forEach((record) => {
      // get month from current record
      const month = new Date(record.transactionDate).toLocaleString('en-us', { month: 'short' });
      if (rewardsPerMonth[month]) {
        rewardsPerMonth[month] += getRewardsForAmount(record.amount);
      } else {
        rewardsPerMonth[month] = getRewardsForAmount(record.amount);
      }
      totalRewards += getRewardsForAmount(record.amount);
    });
    setRewardsPerMonth(rewardsPerMonth);
    setTotalRewards(totalRewards);

  }, [transactions])


  return (
    <div className="App">
      <header>{rewardsPolicy}</header>
      <section className='rewards-section'>
        <section className='transactions-table'>
          {error && <section> {error}</section>}
          <table className="table">
            <thead>
              <tr>
                <td>Date</td>
                <td>Category</td>
                <td>Amount</td>
              </tr>
            </thead>
            <tbody>
              {populateTransactions()
              }
            </tbody>
          </table>
        </section>
        <section className='rewards-table'>
          <table>
            <thead>
              <tr>
                <td>Month</td>
                <td>Rewards</td>
              </tr>
            </thead>
            <tbody>
              {rewardsPerMonthList()}
              <tr>
                <td>Total Rewards</td>
                <td>{totalRewards}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
    </div>
  );
}

export default RewardsApp;
