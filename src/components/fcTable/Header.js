import './Header.css';
function Header()
{
    return(
      <div className="container">      
        <header className="App-header d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">

        <a href="/fcTable" className="d-flex  text-dark text-decoration-none">
            <h1 className="fs-5">프로세카 기록체크표</h1>
        </a>

        </header>
      </div>
    );
}

export default Header;