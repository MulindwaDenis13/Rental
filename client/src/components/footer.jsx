function Footer() {
  return (
    <>
      <footer>
        <h5>
          <label htmlFor="nav-toggle">
            <span className="las la-bars"></span>
          </label>
          <span className="health_unit_name">
            Dreamscom Technologies Ltd Copyright Reserved &copy;
            {new Date(Date.now()).getFullYear()}
          </span>
        </h5>
      </footer>
    </>
  );
}

export default Footer;
