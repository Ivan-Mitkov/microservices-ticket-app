import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link text-decoration-none font-weight-bolder text-warning">
              {label}
            </a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar sticky-top navbar-light bg-dark">
      <Link href="/">
        <a className="navbar-brand text-warning font-weight-bold">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav nav-pills d-flex align-items-center ">{links}</ul>
      </div>
    </nav>
  );
};
export default Header;
