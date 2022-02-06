import './Header.css';

function Header()
{
    return(
      <div className="container">      
        <nav class="navbar sticky-top navbar-expand-lg justify-content-between navbar-custom">
          <a class="navbar-brand" href="/">나지미히로의 개인공간</a>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/blog">Blog</a>
              <a class="nav-link" href="/fcTable">풀콤체크표</a>
            </li>
          </ul>
        </nav>
        <hr></hr>
      </div>
    );
}

export default Header;