import { Fragment, useContext, useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { CustomerContext } from "../../App";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

export default function CustomNavbar(props: any) {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("customer context is undefined");
  }
  const { customer, updateCustomer } = context;
  const navigate = useNavigate();
  const { updateProductCount } = props;

  const [expanded, setExpanded] = useState(false);

  //implement logout function, set context customer to guest again.
  async function logout() {
    //implement logout function, set context customer to guest again.
    // Try to get guest from database
    try {
      const response = await fetch(`http://localhost:3000/customers/guest`);
      const data = await response.json();
      updateCustomer(data);
      console.log(customer);
    } catch (error) {
      console.error("there was an error fetching guest customers: " + error);
    }
    navigate("/");
  }

  // Setting first name of the user in the navigation and returning the link dynamically.
  function showName() {
    if (customer.firstName !== "Guest") {
      return (
        <Nav.Link
          as={Link}
          to="/"
          onClick={() => {
            logout();
            setExpanded(false);
          }}>
          Logout
        </Nav.Link>
      );
    } else {
      return (
        <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/Login">
          Login
        </Nav.Link>
      );
    }
  }

  useEffect(() => {
    if (customer.customerId !== 0) {
      getBasketCount();
    }
  });
  async function getBasketCount() {
    const response = await fetch(
      `http://localhost:3000/baskets/${customer.customerId}`,
      {
        mode: "cors",
        method: "GET",
      }
    );
    const data = await response.json();
    updateProductCount(data.length);
  }

  return (
    <Fragment>
      <Navbar
        expanded={expanded}
        expand="lg"
        sticky="top"
        className="px-4 px-lg-5">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              className="logo-img"
              src="assets/images/Badeanden_logo-01.png"
              alt=""
            />
          </Navbar.Brand>
          <Navbar.Brand as={Link} to="/">
            Ducktastic
          </Navbar.Brand>
          <Navbar.Toggle
            onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
            aria-controls="responsive-navbar-nav"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Categories">
                <NavDropdown.Item
                  onClick={() => setExpanded(false)}
                  as={Link}
                  to="/All-Products">
                  All Products
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => setExpanded(false)}
                  as={Link}
                  to="/All-Products">
                  All Categories
                </NavDropdown.Item>
                <NavDropdown title="Item Category 1" drop="end">
                  <NavDropdown.Item
                    onClick={() => setExpanded(false)}
                    as={Link}
                    to="/">
                    Sub-cat 1
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => setExpanded(false)}
                    as={Link}
                    to="/">
                    Sub-cat 2
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => setExpanded(false)}
                    as={Link}
                    to="/">
                    Sub-cat 3
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Item Category 2" drop="end">
                  <NavDropdown.Item
                    onClick={() => setExpanded(false)}
                    as={Link}
                    to="/">
                    Sub-cat 1
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => setExpanded(false)}
                    as={Link}
                    to="/">
                    Sub-cat 2
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => setExpanded(false)}
                    as={Link}
                    to="/">
                    Sub-cat 3
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Item Category 3" drop="end">
                  <NavDropdown.Item
                    onClick={() => setExpanded(false)}
                    as={Link}
                    to="/">
                    Sub-cat 1
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => setExpanded(false)}
                    as={Link}
                    to="/">
                    Sub-cat 2
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => setExpanded(false)}
                    as={Link}
                    to="/">
                    Sub-cat 3
                  </NavDropdown.Item>
                </NavDropdown>
              </NavDropdown>
              <Nav.Link
                onClick={() => setExpanded(false)}
                as={Link}
                to="/About">
                About
              </Nav.Link>
            </Nav>
            {/* Dynamic login/logout link call to the function */}
            <Nav.Link className="customnavbar-name" disabled>
              {customer?.firstName}
            </Nav.Link>
            {showName()}
            <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/Basket">
              Basket{" "}
              <span
                className="badge bg-dark text-white ms-1 rounded-pill"
                id="basketNumber">
                {props.productCount}
              </span>
            </Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </Fragment>
  );
}
