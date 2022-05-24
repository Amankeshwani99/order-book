import React from "react";

const Table: React.FC<{ count: number; amount: number; price: number }> = (
  props
) => {
  const totalValue = props.count && props.count * props.amount;
  return (
    <tr>
      <td>{props.count}</td>
      <td>{props.amount && props.amount.toFixed(2)}</td>
      <td>{totalValue && totalValue.toFixed(2)}</td>
      <td>{props.price && props.price.toLocaleString()}</td>
    </tr>
  );
};

export default Table;
