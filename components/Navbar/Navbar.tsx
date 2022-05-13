import Link from "next/link";
import React, { Fragment } from "react";
import classes from "./Navbar.module.css";

function Navbar() {
  return (
    <Fragment>
      <div className={classes.navbar}>
        <h2>Order Book App</h2>
        <ul className={classes.navitems}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/graph">Graph</Link>
          </li>
        </ul>
      </div>
    </Fragment>
  );
}

export default Navbar;
