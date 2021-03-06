import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { editMode, removeExpense } from '../actions';

export function currencyFormat(number) {
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export function round2Digits(number) {
  return Math.round((Number(number) + Number.EPSILON) * 100) / 100;
}

function convertCurrency(expense) {
  const { currency, value, exchangeRates } = expense;
  const converted = Number(value) * Number(exchangeRates[currency].ask);
  return round2Digits(converted);
}

class TableRow extends Component {
  render() {
    const { expense, removeRow, editRow } = this.props;
    const {
      value,
      description,
      method,
      tag,
      currency,
      exchangeRates,
      id,
    } = expense;
    const { name, ask } = exchangeRates[currency]; // Example of name -> "Dólar Americano/Real Brasileiro"
    const targetCurrency = name.split('/')[0];
    let baseCurrency = name.split('/')[1];
    if (!baseCurrency) baseCurrency = 'Real';
    return (
      <tr className="data-row">
        <td>{ description }</td>
        <td>{ tag }</td>
        <td>{ method }</td>
        <td>{ value }</td>
        <td>{ targetCurrency }</td>
        <td>{ currencyFormat(parseFloat(ask)) }</td>
        <td>{ currencyFormat(convertCurrency(expense)) }</td>
        <td>{ baseCurrency }</td>
        <td>
          <button
            className="btn-control"
            data-testid="delete-btn"
            type="button"
            onClick={ () => removeRow(id) }
          >
            <i className="fas fa-trash-alt" />
          </button>
          <button
            className="btn-control"
            data-testid="edit-btn"
            type="button"
            onClick={ () => editRow(id) }
          >
            <i className="fas fa-pencil-alt" />
          </button>
        </td>
      </tr>
    );
  }
}

TableRow.propTypes = {
  expense: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    tag: PropTypes.string,
    currency: PropTypes.string,
    method: PropTypes.string,
    id: PropTypes.number,
    exchangeRates: PropTypes.shape({
      ask: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
  removeRow: PropTypes.func.isRequired,
  editRow: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  removeRow: (id) => dispatch(removeExpense(id)),
  editRow: (id) => dispatch(editMode(id)),
});

export default connect(null, mapDispatchToProps)(TableRow);
