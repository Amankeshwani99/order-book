import React from "react";

const BidsTable: React.FC<{ count: number; amount: number; price: number }> = (
  props
) => {
  const totalValue = props.count && props.count * props.amount;
  return (
    <tr>
      <td>{props.price && props.price.toLocaleString()}</td>
      <td>{totalValue && totalValue.toFixed(2)}</td>
      <td>{props.amount && props.amount.toFixed(2)}</td>
      <td>{props.count}</td>
    </tr>
  );
};

export default BidsTable;
