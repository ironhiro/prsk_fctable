export function Footer()
{
    const year = new Date().getFullYear();
    return(
        <div className="container">
            <footer className="App-footer d-flex flex-wrap justify-content-end py-3 my-4 border-top">
                <p className="col mb-0 text-muted">Copyrightⓒ {year} All rights reserved by ironhiro.</p>
            </footer>
        </div>
    );
}