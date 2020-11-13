import Header from '../Header'
import SearchBar from '../SearchBar'

const Layout = ({children}) => {
    return (
        <>
            <div className="hmtop">
                <Header />
                <SearchBar />
            </div>
            
            {children}
        </>
    )
}

export default Layout